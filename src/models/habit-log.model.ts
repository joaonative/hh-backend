import { Schema, Document, model, Types } from "mongoose";

export interface HabitLogDocument extends Document {
  timestamp: Date;
  monthlyOccurrences?: number;
  user: Types.ObjectId | string; // Referência ao ID do usuário
  habit: Types.ObjectId | string; // Referência ao ID do hábito
}

const habitLogSchema = new Schema<HabitLogDocument>({
  timestamp: { type: Date, default: Date.now },
  monthlyOccurrences: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  habit: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
});

const HabitLogModel = model<HabitLogDocument>("HabitLog", habitLogSchema);

export default HabitLogModel;
