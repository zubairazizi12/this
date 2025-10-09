import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvaluationFormE extends Document {
  trainer: Types.ObjectId;
  residentName: string;
  fatherName: string;
  trainingYear: string;
  incidentTitle: string;
  date: string;
  scores: { score: string; teacherName: string; notes?: string }[]; // 👈 آرایه
  averageScore: string;
}

const EvaluationFormESchema = new Schema<IEvaluationFormE>(
  {
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    residentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    trainingYear: { type: String, required: true },
    incidentTitle: { type: String, required: true },
    date: { type: String, required: true },
    scores: [
      {
        score: { type: String, default: "" },
        teacherName: { type: String, default: "" },
        notes: { type: String, default: "" }
      }
    ],
    averageScore: { type: String, default: "" },
  },
  { timestamps: true }
);

export const EvaluationFormE = mongoose.model<IEvaluationFormE>(
  "EvaluationFormE",
  EvaluationFormESchema
);
