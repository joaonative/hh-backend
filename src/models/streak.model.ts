import mongoose, { Schema, Document } from "mongoose";

interface StreakDocument extends Document {
  author: string;
  streakCount: number;
  weeklyDays: boolean[];
  lastUpdate: Date;
}

const StreakSchema = new Schema<StreakDocument>({
  author: { type: String, required: true },
  streakCount: { type: Number, default: 0 },
  weeklyDays: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false],
  },
  lastUpdate: { type: Date },
});

const StreakModel = mongoose.model<StreakDocument>("Streak", StreakSchema);

export default StreakModel;
