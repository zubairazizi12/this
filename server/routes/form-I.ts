import express, { Request, Response } from "express";
import RotationForm, { IRotationForm } from "../models/form-I";
import mongoose from "mongoose";

const router = express.Router();

// 🔹 ذخیره فرم برای یک ترینر مشخص
router.post("/", async (req: Request, res: Response) => {
  try {
    const { trainerId, header, persianRows, persianNote, rotationName, rows } = req.body;

    if (!trainerId) {
      return res.status(400).json({ error: "TrainerId الزامی است" });
    }

    const form: IRotationForm = new RotationForm({
      trainerId: new mongoose.Types.ObjectId(trainerId), // 👈 مهم
      header,
      persianRows,
      persianNote,
      rotationName,
      rows,
    });

    await form.save();
    res.status(201).json({ message: "✅ فرم ذخیره شد", id: form._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ خطا در ذخیره فرم" });
  }
});

// 🔹 گرفتن لیست فرم‌های یک ترینر مشخص
router.get("/:trainerId", async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) {
      return res.status(400).json({ error: "TrainerId الزامی است" });
    }

    const forms = await RotationForm.find({
      trainerId: new mongoose.Types.ObjectId(trainerId), // 👈 مهم
    }).sort({ createdAt: -1 });

    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ خطا در گرفتن فرم‌ها" });
  }
});


export default router;
