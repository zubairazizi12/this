// controllers/form-H.ts
import { Request, Response } from "express";
import { EvaluationFormH } from "../models/form-H";

// ایجاد فرم جدید
export const createEvaluationFormH = async (req: Request, res: Response) => {
  try {
    const form = new EvaluationFormH({
      ...req.body, // studentId را هم می‌گیرد
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "خطا در ایجاد فرم", error });
  }
};

// گرفتن تمام فرم‌ها (بدون نیاز به آیدی)
export const getEvaluationFormsH = async (req: Request, res: Response) => {
  try {
    const forms = await EvaluationFormH.find().populate("studentId");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};
