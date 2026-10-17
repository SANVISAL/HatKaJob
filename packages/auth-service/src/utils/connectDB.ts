import mongoose from "mongoose";

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Connected to MongoDB successfully!");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export { connectMongoDB };
