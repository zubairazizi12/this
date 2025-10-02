import { Request, Response } from "express";
import { EvaluationFormE } from "../models/form-E";

// ایجاد فرم جدید
export const createEvaluationFormE = async (req: Request, res: Response) => {
  try {
    // بدنه‌ی درخواست باید شامل residentId و بقیه فیلدها باشد
    const form = new EvaluationFormE(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "خطا در ایجاد فرم", error });
  }
};

// گرفتن تمام فرم‌ها بدون فیلتر
export const getAllEvaluationFormsE = async (req: Request, res: Response) => {
  try {
    const forms = await EvaluationFormE.find().populate("residentId");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن تمام فرم‌ها", error });
  }
};

// گرفتن تمام فرم‌ها برای یک Resident خاص
export const getEvaluationFormsByResident = async (
  req: Request,
  res: Response
) => {
  try {
    const { residentId } = req.params;
    // جستجو بر اساس residentId
    const forms = await EvaluationFormE.find({ residentId }).populate(
      "residentId"
    );
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};

// گرفتن یک فرم با آیدی خودش
export const getEvaluationFormEById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const form = await EvaluationFormE.findById(id).populate("residentId");
    if (!form) {
      return res.status(404).json({ message: "فرم پیدا نشد" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم", error });
  }
};

// آپدیت فرم
export const updateEvaluationFormE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await EvaluationFormE.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "فرم پیدا نشد" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "خطا در آپدیت فرم", error });
  }
};

// حذف فرم
export const deleteEvaluationFormE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await EvaluationFormE.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "فرم پیدا نشد" });
    res.json({ message: "فرم حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف فرم", error });
  }
};
