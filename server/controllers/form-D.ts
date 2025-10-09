import { Request, Response } from "express";
import { ConferenceEvaluation } from "../models/form-D";

// ذخیره فرم جدید
export const createEvaluation = async (req: Request, res: Response) => {
  try {
    if (!req.body.trainer) {
      return res.status(400).json({ message: "Trainer ID خالی است و فرم ذخیره نمی‌شود." });
    }

    const newEvaluation = new ConferenceEvaluation(req.body);
    await newEvaluation.save();
    res.status(201).json({ message: "دیتا با موفقیت ذخیره شد ✅" });
  } catch (err: any) {
    console.error("Error saving evaluation:", err);
    res.status(500).json({ message: "خطا در ذخیره دیتا ❌", error: err.message });
  }
};

// گرفتن فرم‌ها بر اساس trainerId
export const getEvaluations = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.query;

    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID خالی است." });
    }

    const evaluations = await ConferenceEvaluation.find({ trainer: trainerId }).populate("trainer");
    res.status(200).json(evaluations);
  } catch (err: any) {
    console.error("Error fetching evaluations:", err);
    res.status(500).json({ message: "خطا در گرفتن دیتا ❌", error: err.message });
  }
};
