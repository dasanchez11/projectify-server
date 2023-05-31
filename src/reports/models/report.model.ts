import { ObjectId } from "mongoose";

export class Report {
  _id: ObjectId;
  projectId: ObjectId;
  userId: ObjectId;
  hours: number;
  week: string;
}
