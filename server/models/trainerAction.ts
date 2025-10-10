import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrainerAction extends Document {
  trainer: Types.ObjectId; // رفرنس به ترینر
  description: string; // توضیحات اکشن
  selectedForms: string[]; // آرایه فرم‌های انتخاب شده (مثل ["A", "B", "C"])
  createdAt: Date;
  updatedAt: Date;
}

const TrainerActionSchema = new Schema<ITrainerAction>(
  {
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    selectedForms: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const TrainerAction = mongoose.model<ITrainerAction>(
  "TrainerAction",
  TrainerActionSchema
);
