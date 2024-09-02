import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env",
});

const DB_URI: string = process.env.MONGODB_URI!;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URI).then((data: any) => {
      console.log(`Database connected with ${data?.connection?.host}`);
    });
  } catch (error: any) {
    console.log(error?.message);
  }
};

export { connectToDB };
