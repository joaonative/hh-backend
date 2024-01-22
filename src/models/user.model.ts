import { Schema, Document, model } from "mongoose";

interface Habit {
  name: string;
  description: string;
  frequency: number;
  monthlyOccurrences: number;
  totalOccurrences: number;
}

interface UserDocument extends Document {
  name: string;
  email: string;
  habits?: Habit[];
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  habits: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      frequency: { type: Number, required: true },
      monthlyOccurrences: { type: Number, default: 0 },
      totalOccurrences: { type: Number, default: 0 },
    },
  ],
});

const UserModel = model<UserDocument>("User", userSchema);

export default UserModel;
