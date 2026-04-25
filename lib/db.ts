import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { sanitizeFilter: true });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}