import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrainerAcademicYear extends Document {
  trainerId: Types.ObjectId;
  academicYear: string;
  calendarYear: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainerAcademicYearSchema = new Schema<ITrainerAcademicYear>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      enum: ["سال اول", "سال دوم", "سال سوم", "سال چهارم"],
    },
    calendarYear: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TrainerAcademicYearSchema.index({ trainerId: 1, calendarYear: 1 }, { unique: true });

export const TrainerAcademicYear = mongoose.model<ITrainerAcademicYear>(
  "TrainerAcademicYear",
  TrainerAcademicYearSchema
);
