import mongoose, { Schema, Document } from "mongoose";

export interface IEvaluationFormG extends Document {
  residentId: mongoose.Types.ObjectId; // رفرنس به Resident
  year: string;
  name: string;
  fatherName: string;
  trainingYear: string;
  department: string;
  exam1Written: number;
  exam1Practical: number;
  exam2Written: number;
  exam2Practical: number;
  finalWritten: number;
  finalPractical: number;
  total: number;
  average: string;
  teacherName: string;
  teacherSigned: boolean;
  departmentHead: string;
  programHead: string;
  hospitalHead: string;
}

const EvaluationFormGSchema = new Schema<IEvaluationFormG>(
  {
    residentId: { type: Schema.Types.ObjectId, ref: "Resident" },
    year: String,
    name: String,
    fatherName: String,
    trainingYear: String,
    department: String,
    exam1Written: { type: Number, default: 0 },
    exam1Practical: { type: Number, default: 0 },
    exam2Written: { type: Number, default: 0 },
    exam2Practical: { type: Number, default: 0 },
    finalWritten: { type: Number, default: 0 },
    finalPractical: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    average: String,
    teacherName: String,
    teacherSigned: { type: Boolean, default: false },
    departmentHead: String,
    programHead: String,
    hospitalHead: String,
  },
  { timestamps: true }
);

export const EvaluationFormG = mongoose.model<IEvaluationFormG>(
  "EvaluationFormG",
  EvaluationFormGSchema
);
