import { Request, Response } from "express";
import { EvaluationFormH } from "../models/form-H";

// ایجاد فرم جدید
export const createEvaluationFormH = async (req: Request, res: Response) => {
  try {
    const form = new EvaluationFormH({
      trainer: req.body.trainer, // ⬅️ از فرانت می‌آید
      residentName: req.body.residentName,
      fatherName: req.body.fatherName,
      department: req.body.department,
      trainingYears: req.body.trainingYears,
      averageScore: req.body.averageScore,
      shiftDepartment: req.body.shiftDepartment,
      programDirector: req.body.programDirector,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "خطا در ایجاد فرم", error });
  }
};

// گرفتن فرم‌ها بر اساس trainerId
export const getEvaluationFormsH = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.query; // ?trainerId=xxxx
    const filter = trainerId ? { trainer: trainerId } : {};
    const forms = await EvaluationFormH.find(filter).populate("trainer");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};
