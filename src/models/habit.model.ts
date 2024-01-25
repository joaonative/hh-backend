import { Schema, Document, model, Types } from "mongoose";
import UserModel from "./user.model";

export interface HabitDocument extends Document {
  author: string;
  name: string;
  description: string;
  frequency: number;
  monthlyOccurrences: number;
  totalOccurrences: number;
}

const habitSchema = new Schema<HabitDocument>({
  author: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  frequency: { type: Number, required: true },
  monthlyOccurrences: { type: Number, default: 0 },
  totalOccurrences: { type: Number, default: 0 },
});

habitSchema.path("author").validate(async function (value: string) {
  const user = await UserModel.findOne({ email: value });
  return !!user;
}, "Author must be a valid user email.");

const HabitModel = model<HabitDocument>("Habit", habitSchema);

export default HabitModel;
