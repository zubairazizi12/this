// models/MonographEvaluationForm.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMonographEvaluationForm extends Document {
  name: string;
  lastName: string;
  fatherName: string;
  idNumber: string;
  field: string;
  trainingYear: string;
  startYear: string;
  date: string;
  chef: string;
  departmentHead: string;
  hospitalHead: string;
  evaluations: {
    section: string;     // نام بخش مثل نمره سیکل، مجموع نمرات ...
    percentage: string;  // فیصدی
    score: string;       // نمره
    teacherName: string; // نام استاد
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// اسکیمای هر آیتم ارزیابی
const MonographEvaluationItemSchema: Schema = new Schema({
  section: { type: String, required: true },
  percentage: { type: String, required: true },
  score: { type: String, required: true },
  teacherName: { type: String, required: true },
});

// اسکیمای اصلی فرم
const MonographEvaluationFormSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    idNumber: { type: String, required: true },
    field: { type: String, required: true },
    trainingYear: { type: String, required: true },
    startYear: { type: String, required: true },
    date: { type: String, required: true },
    chef: { type: String, required: true },
    departmentHead: { type: String, required: true },
    hospitalHead: { type: String, required: true },
    evaluations: [MonographEvaluationItemSchema], // آرایه ارزیابی‌ها
  },
  {
    timestamps: true, // createdAt و updatedAt اتوماتیک
  }
);

export const MonographEvaluationForm = mongoose.model<IMonographEvaluationForm>(
  "MonographEvaluationForm",
  MonographEvaluationFormSchema
);
