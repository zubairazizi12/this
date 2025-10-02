// controllers/monographEvaluation.ts
import { Request, Response } from "express";
import { MonographEvaluation } from "../models/form-K"; // <-- حتما نام فایل صحیح

export const createMonographEvaluation = async (req: Request, res: Response) => {
  console.log("[createMonographEvaluation] body:", JSON.stringify(req.body).slice(0,200));
  try {
    const form = new MonographEvaluation(req.body);
    const saved = await form.save();
    console.log("[createMonographEvaluation] saved id:", saved._id);
    return res.status(201).json(saved);
  } catch (err) {
    console.error("[createMonographEvaluation] error:", err);
    // بازگرداندن JSON با پیام خطا
    return res.status(400).json({ message: (err as any)?.message || "خطا", error: err });
  }
};

export const getMonographEvaluations = async (_req: Request, res: Response) => {
  try {
    const forms = await MonographEvaluation.find().populate("studentId");
    return res.json(forms);
  } catch (error) {
    console.error("[getMonographEvaluations] error:", error);
    return res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};
