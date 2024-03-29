import { Schema, Document, model, Query } from "mongoose";
import HabitModel, { HabitDocument } from "./habit.model";

interface UserDocument extends Document {
  name: string;
  email: string;
  habits?: HabitDocument[];
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    habits: [{ type: Schema.Types.ObjectId, ref: "Habit" }],
  },
  { timestamps: true }
);

const UserModel = model<UserDocument>("User", userSchema);

export default UserModel;
