import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Successfully connected to MongoDB ${conn.connection.host}`.bgBlue.white
    );
  } catch (error) {
    console.log(`❌ MongoDB Connection Error: ${error.message}`);
  }
};
