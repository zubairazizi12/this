// controllers/form-D.ts
import { Request, Response } from "express";
import ConferenceEvaluation from "../models/form-D";

export const createEvaluation = async (req: Request, res: Response) => {
  try {
    const newEvaluation = new ConferenceEvaluation(req.body);
    await newEvaluation.save();
    res.status(201).json({ message: "دیتا با موفقیت ذخیره شد ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ذخیره دیتا ❌" });
  }
};

export const getEvaluations = async (req: Request, res: Response) => {
  try {
    const { residentId } = req.query;

    // اگر residentId فرستاده نشده باشد فیلتر نمی‌کنیم و همه دیتاها را برمی‌گردانیم
    const filter: any = {};
    if (residentId && residentId !== "undefined" && residentId !== "null") {
      filter.residentId = residentId;
    }

    const evaluations = await ConferenceEvaluation.find(filter).populate("residentId");
    res.status(200).json(evaluations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در گرفتن دیتا ❌" });
  }
};
