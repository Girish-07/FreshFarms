import "dotenv/config";

import mongoose from "mongoose";
import { products } from "../data/catalog.js";
import Product from "../models/Product.js";

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to Backend/.env before running npm run seed.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const product of products) {
    await Product.updateOne({ id: product.id }, { $set: product }, { upsert: true });
  }

  console.log(`Seeded ${products.length} products.`);
};

try {
  await seed();
} catch (error) {
  console.error("Catalog seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
