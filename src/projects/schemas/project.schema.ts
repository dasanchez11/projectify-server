import { Project } from "../models/project.model";
import { Schema, model, Model } from "mongoose";

const ProjectSchema = new Schema<Project>({
  name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 160 },
});

export const ProjectModel: Model<Project> = model("project", ProjectSchema);
