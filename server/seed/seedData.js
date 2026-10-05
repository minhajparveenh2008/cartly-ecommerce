import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB, { isMongoConnected, resetLocalStore } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { sampleProducts } from "./sampleProducts.js";

dotenv.config();

export const seedIfEmpty = async () => {
  if (!isMongoConnected()) {
    return;
  }

  const count = await Product.countDocuments();
  if (count > 0) {
    return;
  }

  console.log("Empty MongoDB database detected. Seeding initial Cartly catalog and demo accounts...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const existingAdmin = await User.findOne({ email: "admin@cartly.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Cartly Admin",
      email: "admin@cartly.com",
      password: adminPassword,
      role: "admin",
    });
  }

  const existingUser = await User.findOne({ email: "user@cartly.com" });
  if (!existingUser) {
    await User.create({
      name: "Aarav Sharma",
      email: "user@cartly.com",
      password: userPassword,
      role: "user",
    });
  }

  const cleanProducts = sampleProducts.map(({ _id, ...rest }) => rest);
  await Product.insertMany(cleanProducts);
  console.log(`Seeded ${cleanProducts.length} products and demo accounts (admin@cartly.com / user@cartly.com).`);
};

const runSeedCli = async () => {
  try {
    await connectDB();
    if (isMongoConnected()) {
      await Product.deleteMany();
      await User.deleteMany();
      await seedIfEmpty();
      console.log("MongoDB seed completed successfully.");
    } else {
      resetLocalStore();
      console.log("Local persistent store reset and seeded with 14 products and demo accounts.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  runSeedCli();
}
