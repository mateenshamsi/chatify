import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
    }
    }
