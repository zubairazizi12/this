import { Request, Response } from "express";
import { EvaluationFormG } from "../models/form-G";

// ایجاد فرم جدید بدون نیاز به residentId
export const createEvaluationFormG = async (req: Request, res: Response) => {
  try {
    const form = new EvaluationFormG({
      ...req.body,
      total:
        (Number(req.body.exam1Written) || 0) +
        (Number(req.body.exam1Practical) || 0) +
        (Number(req.body.exam2Written) || 0) +
        (Number(req.body.exam2Practical) || 0) +
        (Number(req.body.finalWritten) || 0) +
        (Number(req.body.finalPractical) || 0),
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "خطا در ایجاد فرم", error });
  }
};

// گرفتن تمام فرم‌ها
export const getEvaluationFormsG = async (req: Request, res: Response) => {
  try {
    const forms = await EvaluationFormG.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};

// گرفتن فرم با ID
export const getEvaluationFormGById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const form = await EvaluationFormG.findById(id);
    if (!form) return res.status(404).json({ message: "فرم پیدا نشد" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم", error });
  }
};

// آپدیت فرم
export const updateEvaluationFormG = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await EvaluationFormG.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "فرم پیدا نشد" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "خطا در آپدیت فرم", error });
  }
};

// حذف فرم
export const deleteEvaluationFormG = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await EvaluationFormG.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "فرم پیدا نشد" });
    res.json({ message: "فرم حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف فرم", error });
  }
};
