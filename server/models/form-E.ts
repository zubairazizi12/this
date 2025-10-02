import mongoose, { Schema, Document } from "mongoose";

export interface IEvaluationFormE extends Document {
  residentId: mongoose.Types.ObjectId; // رفرنس به Resident
  year: string;
  name: string;
  fatherName: string;
  trainingYear: string;
  incidentTitle: string;
  date: string;
  score: string;
  teacherName: string;
  teacherSigned: boolean;
  notes: boolean;
  averageScore: string;
  departmentHead: string;
  programHead: string;
  hospitalHead: string;
}

const EvaluationFormESchema = new Schema<IEvaluationFormE>(
  {
    // این فیلد رفرنس به Resident است
    residentId: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
     
    },
    year: String,
    name: String,
    fatherName: String,
    trainingYear: String,
    incidentTitle: String,
    date: String,
    score: String,
    teacherName: String,
    teacherSigned: { type: Boolean, default: false },
    notes: { type: Boolean, default: false },
    averageScore: String,
    departmentHead: String,
    programHead: String,
    hospitalHead: String,
  },
  { timestamps: true }
);

export const EvaluationFormE = mongoose.model<IEvaluationFormE>(
  "EvaluationFormE",
  EvaluationFormESchema
);
