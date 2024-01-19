import mongoose from "mongoose";
import dotenv from "dotenv";
import { ConnectOptions } from "mongoose";

dotenv.config();

const mongooseOptions: ConnectOptions = {
  writeConcern: {
    w: "majority",
    wtimeout: 0,
    j: false,
  },
};

export const mongooseConnection = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      console.error("MongoDB URL not provided in the environment variables.");
      return;
    }

    await mongoose.connect(mongoURL, mongooseOptions);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
