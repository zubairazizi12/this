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
    section: string;
    percentage: string;
    score: string;
    teacherName: string;
    teacherSigned: boolean;
    characteristics: string;
    total: string;
    finalResult: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MonographEvaluationItemSchema: Schema = new Schema({
  section: { type: String, required: true },
  percentage: { type: String, required: true },
  score: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherSigned: { type: Boolean, default: false },
  characteristics: { type: String, default: "" },
  total: { type: String, required: true },
  finalResult: { type: String, required: true }
});

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
    evaluations: [MonographEvaluationItemSchema]
  },
  {
    timestamps: true
  }
);

export const MonographEvaluationForm = mongoose.model<IMonographEvaluationForm>(
  "MonographEvaluationForm",
  MonographEvaluationFormSchema
);