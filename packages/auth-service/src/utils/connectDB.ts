import mongoose from "mongoose";
import getConfig from "./config";

async function connectMongoDB() {
  try {
    await mongoose.connect(getConfig(process.env.NODE_ENV).mongoUrl!);
    console.log("Connected to MongoDB successfully!");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
}

export { connectMongoDB };
