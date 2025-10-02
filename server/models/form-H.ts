// models/form-H.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvaluationFormH extends Document {
  studentId: mongoose.Types.ObjectId; // رفرنس به Resident
  year: string;
  residentName: string;
  fatherName: string;
  department: string;
  trainingYear: string;
  totalScore: number;
  averageScore: number;
  instructorName: string;
  instructorSigned: boolean;
  shiftDepartment: string;
  programDirector: string;
  presidentSigned: boolean;
}

const EvaluationFormHSchema = new Schema<IEvaluationFormH>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Resident" }, // 👈 رفرنس
    year: String,
    residentName: String,
    fatherName: String,
    department: String,
    trainingYear: String,
    totalScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    instructorName: String,
    instructorSigned: { type: Boolean, default: false },
    shiftDepartment: String,
    programDirector: String,
    presidentSigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const EvaluationFormH = mongoose.model<IEvaluationFormH>(
  "EvaluationFormH",
  EvaluationFormHSchema
);
