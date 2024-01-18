import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const mongooseConnection = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      console.error("MongoDB URL not provided in the environment variables.");
      return;
    }

    await mongoose.connect(mongoURL);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
