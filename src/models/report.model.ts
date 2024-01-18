import { Schema, Document, model, Types } from "mongoose";

export interface ReportDocument extends Document {
  timestamp: Date;
  author: string;
  report: string;
}

const ReportSchema = new Schema<ReportDocument>(
  {
    author: { type: String, required: true },
    report: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ReportModel = model<ReportDocument>("Report", ReportSchema);

export default ReportModel;
