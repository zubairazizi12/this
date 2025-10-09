import { Request, Response } from "express";
import { EvaluationFormG } from "../models/form-G";

// ذخیره فرم جدید
export const createEvaluationFormG = async (req: Request, res: Response) => {
  try {
    const { trainerId, personalInfo, scores } = req.body;

    if (!trainerId) return res.status(400).json({ message: "شناسه ترینر الزامی است." });
    if (!personalInfo || !scores) return res.status(400).json({ message: "اطلاعات کامل فرم الزامی است." });

    // محاسبه میانگین کل (averageScore)
    const filledRows = scores.slice(0, 5);
    const totalSum = filledRows.reduce((sum: number, row: any) => sum + (Number(row.total) || 0), 0);
    const averageScore = totalSum / filledRows.length;

    const form = new EvaluationFormG({
      trainer: trainerId,
      personalInfo,
      scores,
      averageScore,
    });

    await form.save();
    res.status(201).json({ message: "فرم با موفقیت ذخیره شد", form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ذخیره فرم", error: err });
  }
};

// دریافت فرم‌ها بر اساس trainerId
export const getEvaluationFormsByTrainer = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) return res.status(400).json({ message: "شناسه ترینر الزامی است." });

    const forms = await EvaluationFormG.find({ trainer: trainerId }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت فرم‌ها", error: err });
  }
};
