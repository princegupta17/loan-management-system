import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;
  const connection = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
