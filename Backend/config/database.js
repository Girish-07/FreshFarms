import mongoose from "mongoose";

export const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI is not set; using in-memory catalog data.");
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.✅");
};
