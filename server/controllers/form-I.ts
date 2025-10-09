// controllers/rotationFormController.ts
import { Request, Response } from "express";
import RotationForm from "../models/form-I";

// 🔹 Create new Rotation Form
export const createRotationForm = async (req: Request, res: Response) => {
  try {
    const { trainerId, header, persianRows, persianNote, rotationName, rows } = req.body;

    if (!trainerId) return res.status(400).json({ message: "TrainerId الزامی است" });

    const newForm = new RotationForm({
      trainerId,
      header,
      persianRows,
      persianNote,
      rotationName,
      rows,
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ایجاد فرم" });
  }
};

// 🔹 Get all Rotation Forms for a specific trainer
export const getRotationForms = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) return res.status(400).json({ message: "TrainerId الزامی است" });

    const forms = await RotationForm.find({ trainerId }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت فرم‌ها" });
  }
};

// 🔹 Get Rotation Form by ID (still by form ID)
export const getRotationFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const form = await RotationForm.findById(id);
    if (!form) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت فرم" });
  }
};

// 🔹 Update Rotation Form by ID
export const updateRotationForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedForm = await RotationForm.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedForm) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json(updatedForm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در بروزرسانی فرم" });
  }
};

// 🔹 Delete Rotation Form by ID
export const deleteRotationForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedForm = await RotationForm.findByIdAndDelete(id);
    if (!deletedForm) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json({ message: "فرم با موفقیت حذف شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در حذف فرم" });
  }
};
