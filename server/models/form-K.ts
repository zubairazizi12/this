// models/monographEvaluation.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMonographEvaluation extends Document {
  studentId: mongoose.Types.ObjectId;
  name: string;
  lastName: string;
  fatherName: string;
  idNumber: string;
  field: string;
  trainingYear: string;
  startYear: string;
  date: string;
  evaluations: {
    section: string;
    writingStyle: string;
    presentation: string;
    answersToQuestions: string;
    defense: string;
    answersToAdditional: string;
    percentage: string;
    score: string;
    teacherName: string;
    teacherSigned: boolean;
    characteristics: string;
    total: string;
    average: string;
  }[];
}

const EvaluationItemSchema = new Schema(
  {
    section: String,
    writingStyle: String,
    presentation: String,
    answersToQuestions: String,
    defense: String,
    answersToAdditional: String,
    percentage: String,
    score: String,
    teacherName: String,
    teacherSigned: Boolean,
    characteristics: String,
    total: String,
    average: String,
  },
  { _id: false }
);

const MonographEvaluationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
    },
    name: String,
    lastName: String,
    fatherName: String,
    idNumber: String,
    field: String,
    trainingYear: String,
    startYear: String,
    date: String,
    evaluations: [EvaluationItemSchema],
  },
  { timestamps: true }
);

export const MonographEvaluation = mongoose.model<IMonographEvaluation>(
  "MonographEvaluation",
  MonographEvaluationSchema
);
