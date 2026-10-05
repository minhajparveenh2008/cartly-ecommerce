import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { sampleProducts } from "../seed/sampleProducts.js";

let mongoConnected = false;
const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "cartly-db.json");

export const isMongoConnected = () => mongoConnected;

const createInitialStore = () => {
  const now = new Date().toISOString();
  const adminPassword = bcrypt.hashSync("admin123", 10);
  const userPassword = bcrypt.hashSync("user123", 10);

  const users = [
    {
      _id: "user_admin_01",
      name: "Cartly Admin",
      email: "admin@cartly.com",
      password: adminPassword,
      role: "admin",
      createdAt: now,
    },
    {
      _id: "user_cust_01",
      name: "Aarav Sharma",
      email: "user@cartly.com",
      password: userPassword,
      role: "user",
      createdAt: now,
    },
  ];

  const products = sampleProducts.map((p, index) => ({
    ...p,
    createdAt: new Date(Date.now() - (sampleProducts.length - index) * 3600000).toISOString(),
    updatedAt: now,
  }));

  const orders = [
    {
      _id: "ORD-849201",
      user: "user_cust_01",
      items: [
        {
          product: "prod_elec_01",
          name: "Studio Wireless Over-Ear Headphones",
          image: "/src/assets/images/product_electronics_headphones_1791220188656.jpg",
          price: 249.0,
          quantity: 1,
        },
        {
          product: "prod_acc_04",
          name: "Braided USB-C Fast Charge Cable (2m)",
          image: "/images/products/cable.svg",
          price: 24.0,
          quantity: 2,
        },
      ],
      totalAmount: 297.0,
      shippingAddress: {
        fullName: "Aarav Sharma",
        address: "42 Indiranagar 100 Feet Road",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
        phone: "+91 98765 43210",
      },
      paymentMethod: "Cash on Delivery / Demo Payment",
      status: "Shipped",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: "ORD-849145",
      user: "user_cust_01",
      items: [
        {
          product: "prod_home_02",
          name: "Matte Ceramic Pour-Over Coffee Set",
          image: "/images/products/pourover.svg",
          price: 64.0,
          quantity: 1,
        },
      ],
      totalAmount: 64.0,
      shippingAddress: {
        fullName: "Aarav Sharma",
        address: "42 Indiranagar 100 Feet Road",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
        phone: "+91 98765 43210",
      },
      paymentMethod: "Cash on Delivery / Demo Payment",
      status: "Delivered",
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  return { users, products, orders };
};

let memoryStore = null;

export const getLocalStore = () => {
  if (memoryStore) return memoryStore;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch (err) {
    // Fallback to in-memory store if filesystem is read-only
  }
  memoryStore = createInitialStore();
  saveLocalStore(memoryStore);
  return memoryStore;
};

export const saveLocalStore = (store) => {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    // Keep in memory if write fails
  }
};

export const resetLocalStore = () => {
  const initial = createInitialStore();
  saveLocalStore(initial);
  return initial;
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isValidUri =
    uri &&
    !uri.includes("<username>") &&
    !uri.includes("MY_MONGODB_URI") &&
    (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"));

  if (isValidUri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      mongoConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(
        `MongoDB connection failed (${error.message}). Using embedded persistent document store.`
      );
      mongoConnected = false;
    }
  } else {
    getLocalStore();
    console.log(
      "Database initialized: Embedded MongoDB-compatible persistent store ready (set MONGODB_URI in .env for external MongoDB Atlas)."
    );
  }
  return false;
};

export default connectDB;
