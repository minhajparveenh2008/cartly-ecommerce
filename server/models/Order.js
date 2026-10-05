import mongoose from "mongoose";
import crypto from "crypto";
import { isMongoConnected, getLocalStore, saveLocalStore } from "../config/db.js";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "Order must contain at least one item"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Cash on Delivery / Demo Payment",
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const MongooseOrder = mongoose.models.Order || mongoose.model("Order", orderSchema);

const populateLocalOrderUser = (order, users) => {
  const foundUser = users.find((u) => String(u._id) === String(order.user));
  return {
    ...order,
    userDetails: foundUser
      ? { _id: foundUser._id, name: foundUser.name, email: foundUser.email }
      : { _id: String(order.user), name: order.shippingAddress?.fullName || "Customer", email: "" },
  };
};

export const Order = {
  schema: orderSchema,
  model: MongooseOrder,

  async create(data) {
    if (isMongoConnected()) {
      const doc = await MongooseOrder.create({
        user: data.user,
        items: data.items,
        totalAmount: Number(data.totalAmount),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod || "Cash on Delivery / Demo Payment",
        status: data.status || "Pending",
      });
      const populated = await MongooseOrder.findById(doc._id)
        .populate("user", "name email")
        .lean();
      return {
        ...populated,
        _id: String(populated._id),
        user: populated.user?._id ? String(populated.user._id) : String(data.user),
        userDetails: populated.user?._id
          ? {
              _id: String(populated.user._id),
              name: populated.user.name,
              email: populated.user.email,
            }
          : {
              _id: String(data.user),
              name: data.shippingAddress.fullName,
              email: "",
            },
      };
    }

    const store = getLocalStore();
    const now = new Date().toISOString();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      _id: `ORD-${randomDigits}`,
      user: String(data.user),
      items: data.items,
      totalAmount: Number(data.totalAmount),
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod || "Cash on Delivery / Demo Payment",
      status: data.status || "Pending",
      createdAt: now,
      updatedAt: now,
    };
    store.orders.unshift(newOrder);
    saveLocalStore(store);
    return populateLocalOrderUser(newOrder, store.users);
  },

  async findByUser(userId) {
    if (isMongoConnected()) {
      const docs = await MongooseOrder.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .lean();
      return docs.map((d) => ({
        ...d,
        _id: String(d._id),
        user: d.user?._id ? String(d.user._id) : String(userId),
        userDetails: d.user?._id
          ? { _id: String(d.user._id), name: d.user.name, email: d.user.email }
          : null,
      }));
    }
    const store = getLocalStore();
    return store.orders
      .filter((o) => String(o.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((o) => populateLocalOrderUser(o, store.users));
  },

  async findById(id) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const d = await MongooseOrder.findById(id).populate("user", "name email").lean();
      if (!d) return null;
      return {
        ...d,
        _id: String(d._id),
        user: d.user?._id ? String(d.user._id) : String(d.user),
        userDetails: d.user?._id
          ? { _id: String(d.user._id), name: d.user.name, email: d.user.email }
          : null,
      };
    }
    const store = getLocalStore();
    const found = store.orders.find((o) => String(o._id) === String(id));
    return found ? populateLocalOrderUser(found, store.users) : null;
  },

  async findAll() {
    if (isMongoConnected()) {
      const docs = await MongooseOrder.find({})
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .lean();
      return docs.map((d) => ({
        ...d,
        _id: String(d._id),
        user: d.user?._id ? String(d.user._id) : String(d.user),
        userDetails: d.user?._id
          ? { _id: String(d.user._id), name: d.user.name, email: d.user.email }
          : {
              _id: String(d.user),
              name: d.shippingAddress?.fullName || "Customer",
              email: "",
            },
      }));
    }
    const store = getLocalStore();
    return [...store.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((o) => populateLocalOrderUser(o, store.users));
  },

  async updateStatus(id, status) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const d = await MongooseOrder.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      )
        .populate("user", "name email")
        .lean();
      if (!d) return null;
      return {
        ...d,
        _id: String(d._id),
        user: d.user?._id ? String(d.user._id) : String(d.user),
        userDetails: d.user?._id
          ? { _id: String(d.user._id), name: d.user.name, email: d.user.email }
          : null,
      };
    }
    const store = getLocalStore();
    const idx = store.orders.findIndex((o) => String(o._id) === String(id));
    if (idx === -1) return null;
    store.orders[idx] = {
      ...store.orders[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    saveLocalStore(store);
    return populateLocalOrderUser(store.orders[idx], store.users);
  },
};

export default Order;
