import mongoose from "mongoose";
import crypto from "crypto";
import { isMongoConnected, getLocalStore, saveLocalStore } from "../config/db.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MongooseUser = mongoose.models.User || mongoose.model("User", userSchema);

export const User = {
  schema: userSchema,
  model: MongooseUser,

  async findOne(query) {
    if (isMongoConnected()) {
      const doc = await MongooseUser.findOne(query).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const store = getLocalStore();
    return (
      store.users.find((u) => {
        if (query.email && u.email.toLowerCase() !== String(query.email).toLowerCase()) {
          return false;
        }
        if (query._id && String(u._id) !== String(query._id)) {
          return false;
        }
        return true;
      }) || null
    );
  },

  async findById(id) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await MongooseUser.findById(id).lean();
      return doc ? { ...doc, _id: String(doc._id) } : null;
    }
    const store = getLocalStore();
    return store.users.find((u) => String(u._id) === String(id)) || null;
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = await MongooseUser.create({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role || "user",
      });
      const obj = doc.toObject();
      return { ...obj, _id: String(obj._id) };
    }
    const store = getLocalStore();
    const newUser = {
      _id: `user_${crypto.randomBytes(6).toString("hex")}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role === "admin" ? "admin" : "user",
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveLocalStore(store);
    return newUser;
  },

  async deleteMany() {
    if (isMongoConnected()) {
      return MongooseUser.deleteMany({});
    }
    const store = getLocalStore();
    store.users = [];
    saveLocalStore(store);
  },

  async insertMany(users) {
    if (isMongoConnected()) {
      return MongooseUser.insertMany(users);
    }
    const store = getLocalStore();
    store.users.push(...users);
    saveLocalStore(store);
    return users;
  },
};

export default User;
