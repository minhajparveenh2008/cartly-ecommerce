import Order, { ORDER_STATUSES } from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User role only)
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Cannot place an order with an empty cart." });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        message: "Please complete all required shipping address fields.",
      });
    }

    // Validate stock and calculate total from authoritative product records
    const verifiedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.product || item._id;
      const quantity = Number(item.quantity);

      if (!productId || Number.isNaN(quantity) || quantity < 1) {
        return res
          .status(400)
          .json({ message: "Invalid order item or quantity." });
      }

      const dbProduct = await Product.findById(productId);
      if (!dbProduct) {
        return res.status(404).json({
          message: `Product "${item.name || productId}" is no longer available.`,
        });
      }

      if (dbProduct.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}, requested: ${quantity}.`,
        });
      }

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity,
        newStock: dbProduct.stock - quantity,
      });

      calculatedTotal += dbProduct.price * quantity;
    }

    // Deduct stock for each product
    for (const vItem of verifiedItems) {
      await Product.findByIdAndUpdate(vItem.product, {
        stock: vItem.newStock,
      });
    }

    const orderItems = verifiedItems.map(({ newStock, ...rest }) => rest);

    const createdOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: Number(calculatedTotal.toFixed(2)),
      shippingAddress: {
        fullName: String(shippingAddress.fullName).trim(),
        address: String(shippingAddress.address).trim(),
        city: String(shippingAddress.city).trim(),
        state: String(shippingAddress.state).trim(),
        postalCode: String(shippingAddress.postalCode).trim(),
        phone: String(shippingAddress.phone).trim(),
      },
      paymentMethod: paymentMethod || "Cash on Delivery / Demo Payment",
      status: "Pending",
    });

    return res.status(201).json(createdOrder);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUser(req.user._id);
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Order owner or Admin)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const isOwner = String(order.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized to view another customer's order.",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${ORDER_STATUSES.join(", ")}`,
      });
    }

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Restore product stock if transitioning into Cancelled from a non-Cancelled state
    if (status === "Cancelled" && existingOrder.status !== "Cancelled") {
      for (const item of existingOrder.items) {
        const prod = await Product.findById(item.product);
        if (prod) {
          await Product.findByIdAndUpdate(prod._id, {
            stock: prod.stock + Number(item.quantity),
          });
        }
      }
    }

    const updatedOrder = await Order.updateStatus(req.params.id, status);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return next(error);
  }
};
