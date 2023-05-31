import { Schema, model, Model } from "mongoose";
import { Report } from "../models/report.model";
import { ObjectId } from "mongodb";

const ReportSchema = new Schema<Report>({
  projectId: { type: ObjectId, required: true },
  userId: { type: ObjectId, required: true },
  hours: { type: Number, required: true },
  week: { type: String, required: true },
});

export const ReportModel: Model<Report> = model("report", ReportSchema);
