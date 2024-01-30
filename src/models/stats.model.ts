import { Schema, Document, model, Types } from "mongoose";

interface StatsDocument extends Document {
  userId: Types.ObjectId;
  month: number;
  year: number;
  totalOccurrences: number;
  totalGoodOccurrences: number;
  totalBadOccurrences: number;
}

const statsSchema = new Schema<StatsDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalOccurrences: { type: Number, default: 0 },
  totalGoodOccurrences: { type: Number, default: 0 },
  totalBadOccurrences: { type: Number, default: 0 },
});

const MonthlyStatsModel = model<StatsDocument>("MonthlyStats", statsSchema);

export default MonthlyStatsModel;
