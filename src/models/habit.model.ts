import { Schema, Document, model, Types } from "mongoose";
import UserModel from "./user.model";

export interface HabitDocument extends Document {
  author: string;
  name: string;
  description: string;
  frequency: number;
  goal: number;
  monthlyOccurrences: number;
  lastPerformed: Date | null;
  isGood: boolean;
}

const habitSchema = new Schema<HabitDocument>({
  author: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  frequency: { type: Number, default: 0 },
  goal: { type: Number, required: true },
  monthlyOccurrences: { type: Number, default: 0 },
  lastPerformed: { type: Date, default: null },
  isGood: { type: Boolean, default: true },
});

habitSchema.path("author").validate(async function (value: string) {
  const user = await UserModel.findOne({ email: value });
  return !!user;
}, "Author must be a valid user email.");

const HabitModel = model<HabitDocument>("Habit", habitSchema);

export default HabitModel;
