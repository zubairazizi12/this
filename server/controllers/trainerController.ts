import { Request, Response } from "express";
import TrainerModel from "../models/trainerModel";

export const TrainerController = {
  // ➕ ایجاد ترینر جدید
  createTrainer: async (req: Request, res: Response) => {
    try {
      const {
        name,
        lastName,
        province,
        department,
        specialty,
        email,
        phoneNumber,
      } = req.body;

      // ✅ اعتبارسنجی اولیه (حداقل فیلدهای ضروری)
      if (!name || !lastName || !province || !department || !specialty) {
        return res.status(400).json({
          message: "لطفاً تمام فیلدهای ضروری (نام، تخلص، ولایت، دیپارتمنت، رشته) را تکمیل کنید",
        });
      }

      // ✅ اگر ایمیل تکراری نباشد (اختیاری)
      if (email) {
        const existing = await TrainerModel.findOne({ email });
        if (existing) {
          return res.status(409).json({ message: "این ایمیل قبلاً ثبت شده است" });
        }
      }

      const newTrainer = await TrainerModel.create(req.body);
      res.status(201).json({
        message: "ترینر با موفقیت ایجاد شد",
        data: newTrainer,
      });
    } catch (error) {
      console.error("❌ Error creating trainer:", error);
      res.status(500).json({ message: "خطا در ثبت ترینر" });
    }
  },

  // 📋 دریافت لیست تمام ترینرها
  getAllTrainers: async (_req: Request, res: Response) => {
    try {
      const trainers = await TrainerModel.find().sort({ createdAt: -1 });
      res.status(200).json(trainers);
    } catch (error) {
      console.error("❌ Error fetching trainers:", error);
      res.status(500).json({ message: "خطا در دریافت ترینرها" });
    }
  },

  // 🔍 دریافت یک ترینر بر اساس ID
  getTrainerById: async (req: Request, res: Response) => {
    try {
      const trainer = await TrainerModel.findById(req.params.id);
      if (!trainer) {
        return res.status(404).json({ message: "ترینر یافت نشد" });
      }
      res.status(200).json(trainer);
    } catch (error) {
      console.error("❌ Error fetching trainer by ID:", error);
      res.status(500).json({ message: "خطا در دریافت ترینر" });
    }
  },

  // ✏️ بروزرسانی ترینر
  updateTrainer: async (req: Request, res: Response) => {
    try {
      const updatedTrainer = await TrainerModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedTrainer) {
        return res.status(404).json({ message: "ترینر یافت نشد" });
      }

      res.status(200).json({
        message: "ترینر با موفقیت بروزرسانی شد",
        data: updatedTrainer,
      });
    } catch (error) {
      console.error("❌ Error updating trainer:", error);
      res.status(500).json({ message: "خطا در بروزرسانی ترینر" });
    }
  },

  // 🗑️ حذف ترینر
  deleteTrainer: async (req: Request, res: Response) => {
    try {
      const deletedTrainer = await TrainerModel.findByIdAndDelete(req.params.id);
      if (!deletedTrainer) {
        return res.status(404).json({ message: "ترینر یافت نشد" });
      }
      res.status(200).json({ message: "ترینر با موفقیت حذف شد" });
    } catch (error) {
      console.error("❌ Error deleting trainer:", error);
      res.status(500).json({ message: "خطا در حذف ترینر" });
    }
  },
};
