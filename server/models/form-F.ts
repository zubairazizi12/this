import mongoose, { Schema, Document } from "mongoose";

interface MonthScore {
  month: number;
  value: number;
}

interface Activity {
  id: string;
  title: string;
  percent: number;
  months: MonthScore[];
  total: number;
}

interface Section {
  name: string;
  activities: Activity[];
}

export interface IChecklist extends Document {
  studentName: string;
  fatherName: string;
  year: string;
  sections: Section[];
}

const MonthScoreSchema = new Schema<MonthScore>({
  month: { type: Number, required: true },
  value: { type: Number, required: true },
});

const ActivitySchema = new Schema<Activity>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  percent: { type: Number, required: true },
  months: { type: [MonthScoreSchema], required: true },
  total: { type: Number, required: true },
});

const SectionSchema = new Schema<Section>({
  name: { type: String, required: true },
  activities: { type: [ActivitySchema], required: true },
});

const ChecklistSchema = new Schema<IChecklist>({
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  year: { type: String, required: true },
  sections: { type: [SectionSchema], required: true },
});

export default mongoose.model<IChecklist>("Checklist", ChecklistSchema);
