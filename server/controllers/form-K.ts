import { Request, Response } from "express";
import { MonographEvaluation } from "../models/form-K";

// ایجاد فرم جدید
export const createMonographEvaluation = async (req: Request, res: Response) => {
  try {
    const form = new MonographEvaluation({
      trainer: req.body.trainer,
      name: req.body.name,
      lastName: req.body.lastName,
      fatherName: req.body.fatherName,
      idNumber: req.body.idNumber,
      field: req.body.field,
      trainingYear: req.body.trainingYear,
      startYear: req.body.startYear,
      date: req.body.date,
      evaluations: req.body.evaluations,
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "خطا در ایجاد فرم", error });
  }
};

// گرفتن فرم‌ها بر اساس trainerId
export const getMonographEvaluations = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.query;
    const filter = trainerId ? { trainer: trainerId } : {};
    const forms = await MonographEvaluation.find(filter).populate("trainer");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "خطا در گرفتن فرم‌ها", error });
  }
};
