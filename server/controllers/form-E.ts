import { Request, Response } from "express";
import { EvaluationFormE } from "../models/form-E";

// ایجاد فرم جدید
export const createEvaluationFormE = async (req: Request, res: Response) => {
  try {
    const {
      trainer,
      residentName,
      fatherName,
      trainingYear,
      incidentTitle,
      date,
      scores,            // 👈 آرایه می‌گیریم
      averageScore,
    } = req.body;

    if (!trainer) {
      return res.status(400).json({ message: "Trainer ID الزامی است" });
    }

    const form = new EvaluationFormE({
      trainer,
      residentName,
      fatherName,
      trainingYear,
      incidentTitle,
      date,
      scores,
      averageScore,
    });

    const saved = await form.save();
    res.status(201).json(saved);
  } catch (err: any) {
    console.error("Error saving EvaluationFormE:", err);
    res.status(500).json({ message: err.message || "خطا در ذخیره فرم" });
  }
};


// گرفتن فرم‌ها بر اساس trainerId
export const getEvaluationFormsE = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.query;
    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID الزامی است" });
    }
    const forms = await EvaluationFormE.find({ trainer: trainerId });
    res.json(forms);
  } catch (err: any) {
    console.error("Error fetching forms:", err);
    res.status(500).json({ message: "خطا در دریافت فرم‌ها" });
  }
};
