import mongoose, { Schema, Document } from "mongoose";

interface IActivity {
  section: string;
  activity: string;
  evaluators: boolean[];
}

export interface ITeacherActivity extends Document {
  teachers: string[];
  activities: IActivity[];
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  section: { type: String, required: true },
  activity: { type: String, required: true },
  evaluators: { type: [Boolean], required: true },
});

const TeacherActivitySchema: Schema = new Schema(
  {
    teachers: { type: [String], required: true },
    activities: { type: [ActivitySchema], required: true },
  },
  { timestamps: true }
);

export const TeacherActivityModel = mongoose.model<ITeacherActivity>(
  "TeacherActivity",
  TeacherActivitySchema
);
