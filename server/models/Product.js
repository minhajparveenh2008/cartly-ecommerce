import mongoose from "mongoose";
import crypto from "crypto";
import { isMongoConnected, getLocalStore, saveLocalStore } from "../config/db.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Electronics", "Accessories", "Home", "Lifestyle"],
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseProduct =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export const Product = {
  schema: productSchema,
  model: MongooseProduct,

  async findAll() {
    if (isMongoConnected()) {
      const docs = await MongooseProduct.find({}).sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: String(d._id) }));
    }
    const store = getLocalStore();
    return [...store.products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async findById(id) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await MongooseProduct.findById(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const store = getLocalStore();
    return store.products.find((p) => String(p._id) === String(id)) || null;
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = await MongooseProduct.create({
        name: data.name.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category,
        image: data.image.trim(),
        stock: Number(data.stock),
      });
      const obj = doc.toObject();
      return { ...obj, _id: String(obj._id) };
    }
    const store = getLocalStore();
    const now = new Date().toISOString();
    const newProduct = {
      _id: `prod_${crypto.randomBytes(5).toString("hex")}`,
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      category: data.category,
      image: data.image.trim(),
      stock: Number(data.stock),
      createdAt: now,
      updatedAt: now,
    };
    store.products.unshift(newProduct);
    saveLocalStore(store);
    return newProduct;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await MongooseProduct.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const store = getLocalStore();
    const idx = store.products.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) return null;
    const existing = store.products[idx];
    const updated = {
      ...existing,
      ...(updates.name !== undefined ? { name: String(updates.name).trim() } : {}),
      ...(updates.description !== undefined
        ? { description: String(updates.description).trim() }
        : {}),
      ...(updates.price !== undefined ? { price: Number(updates.price) } : {}),
      ...(updates.category !== undefined ? { category: updates.category } : {}),
      ...(updates.image !== undefined ? { image: String(updates.image).trim() } : {}),
      ...(updates.stock !== undefined ? { stock: Number(updates.stock) } : {}),
      updatedAt: new Date().toISOString(),
    };
    store.products[idx] = updated;
    saveLocalStore(store);
    return updated;
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await MongooseProduct.findByIdAndDelete(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const store = getLocalStore();
    const idx = store.products.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) return null;
    const [removed] = store.products.splice(idx, 1);
    saveLocalStore(store);
    return removed;
  },

  async countDocuments() {
    if (isMongoConnected()) {
      return MongooseProduct.countDocuments();
    }
    return getLocalStore().products.length;
  },

  async deleteMany() {
    if (isMongoConnected()) {
      return MongooseProduct.deleteMany({});
    }
    const store = getLocalStore();
    store.products = [];
    saveLocalStore(store);
  },

  async insertMany(products) {
    if (isMongoConnected()) {
      return MongooseProduct.insertMany(products);
    }
    const store = getLocalStore();
    store.products.push(...products);
    saveLocalStore(store);
    return products;
  },
};

export default Product;
