import mongoose, { Schema, Document } from "mongoose";

interface IWeek {
  cases: number;
  level: "Basic" | "Intermediate" | "Advanced" | "";
}

interface IEnglishRow {
  weeks: IWeek[];
  total: number;
}

interface IPersianRow {
  mark: string;
  teacherName: string;
  teacherSign: string;
  note: string;
}

export interface IRotationForm extends Document {
  trainerId: mongoose.Schema.Types.ObjectId; // اضافه شد
  header: {
    studentName: string;
    department: string;
    rotationFrom: string;
    rotationTo: string;
    date: string;
  };
  persianRows: IPersianRow[];
  persianNote: string;
  rotationName: string;
  rows: IEnglishRow[];
  createdAt: Date;
}

const WeekSchema = new Schema<IWeek>({
  cases: { type: Number, default: 0 },
  level: { type: String, enum: ["Basic", "Intermediate", "Advanced", ""], default: "" },
});

const EnglishRowSchema = new Schema<IEnglishRow>({
  weeks: { type: [WeekSchema], default: [] },
  total: { type: Number, default: 0 },
});

const PersianRowSchema = new Schema<IPersianRow>({
  mark: String,
  teacherName: String,
  teacherSign: String,
  note: String,
});

const RotationFormSchema = new Schema<IRotationForm>({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true }, // اضافه شد
  header: {
    studentName: String,
    department: String,
    rotationFrom: String,
    rotationTo: String,
    date: String,
  },
  persianRows: [PersianRowSchema],
  persianNote: String,
  rotationName: String,
  rows: [EnglishRowSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRotationForm>("RotationForm", RotationFormSchema);
