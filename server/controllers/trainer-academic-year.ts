import { Request, Response } from "express";
import { TrainerAcademicYear } from "../models/trainer-academic-year";
import mongoose from "mongoose";

export class TrainerAcademicYearController {
  static async create(req: Request, res: Response) {
    try {
      const { trainerId, academicYear, calendarYear, startDate, endDate } = req.body;

      if (!trainerId || !academicYear || !calendarYear) {
        return res.status(400).json({ message: "اطلاعات کامل الزامی است" });
      }

      const existingRecord = await TrainerAcademicYear.findOne({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        calendarYear,
      });

      if (existingRecord) {
        return res.status(400).json({ 
          message: "این ترینر قبلاً برای این سال تقویمی ثبت شده است" 
        });
      }

      await TrainerAcademicYear.updateMany(
        { trainerId: new mongoose.Types.ObjectId(trainerId) },
        { isActive: false }
      );

      const academicYearRecord = new TrainerAcademicYear({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        academicYear,
        calendarYear,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: true,
      });

      await academicYearRecord.save();
      res.status(201).json({ 
        message: "✅ سال تحصیلی با موفقیت ثبت شد", 
        academicYearRecord 
      });
    } catch (error) {
      console.error("❌ Error creating academic year:", error);
      res.status(500).json({ message: "خطا در ثبت سال تحصیلی", error });
    }
  }

  static async getByTrainerId(req: Request, res: Response) {
    try {
      const { trainerId } = req.params;

      const academicYears = await TrainerAcademicYear.find({
        trainerId: new mongoose.Types.ObjectId(trainerId),
      })
        .sort({ calendarYear: -1 })
        .populate("trainerId");

      res.status(200).json(academicYears);
    } catch (error) {
      console.error("❌ Error fetching academic years:", error);
      res.status(500).json({ message: "خطا در دریافت سال‌های تحصیلی", error });
    }
  }

  static async getCurrentAcademicYear(req: Request, res: Response) {
    try {
      const { trainerId } = req.params;

      const currentAcademicYear = await TrainerAcademicYear.findOne({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        isActive: true,
      })
        .sort({ calendarYear: -1 })
        .populate("trainerId");

      if (!currentAcademicYear) {
        return res.status(404).json({ message: "سال تحصیلی فعال پیدا نشد" });
      }

      res.status(200).json(currentAcademicYear);
    } catch (error) {
      console.error("❌ Error fetching current academic year:", error);
      res.status(500).json({ message: "خطا در دریافت سال تحصیلی فعلی", error });
    }
  }

  static async promoteTrainer(req: Request, res: Response) {
    try {
      const { trainerId } = req.params;
      const { newCalendarYear } = req.body;

      if (!newCalendarYear) {
        return res.status(400).json({ message: "سال تقویمی جدید الزامی است" });
      }

      const currentAcademicYear = await TrainerAcademicYear.findOne({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        isActive: true,
      }).sort({ calendarYear: -1 });

      if (!currentAcademicYear) {
        return res.status(404).json({ message: "سال تحصیلی فعال پیدا نشد" });
      }

      const academicYearMap: { [key: string]: string } = {
        "سال اول": "سال دوم",
        "سال دوم": "سال سوم",
        "سال سوم": "سال چهارم",
      };

      const nextAcademicYear = academicYearMap[currentAcademicYear.academicYear];

      if (!nextAcademicYear) {
        return res.status(400).json({ 
          message: "این ترینر در آخرین سال تحصیلی است و نمی‌تواند ارتقا یابد" 
        });
      }

      currentAcademicYear.isActive = false;
      await currentAcademicYear.save();

      const newAcademicYearRecord = new TrainerAcademicYear({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        academicYear: nextAcademicYear,
        calendarYear: newCalendarYear,
        isActive: true,
      });

      await newAcademicYearRecord.save();

      res.status(200).json({
        message: `✅ ترینر به ${nextAcademicYear} ارتقا یافت`,
        previousYear: currentAcademicYear,
        newYear: newAcademicYearRecord,
      });
    } catch (error) {
      console.error("❌ Error promoting trainer:", error);
      res.status(500).json({ message: "خطا در ارتقای ترینر", error });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const academicYears = await TrainerAcademicYear.find()
        .sort({ calendarYear: -1 })
        .populate("trainerId");

      res.status(200).json(academicYears);
    } catch (error) {
      console.error("❌ Error fetching all academic years:", error);
      res.status(500).json({ message: "خطا در دریافت سال‌های تحصیلی", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await TrainerAcademicYear.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).populate("trainerId");

      if (!updated) {
        return res.status(404).json({ message: "سال تحصیلی پیدا نشد" });
      }

      res.status(200).json({ message: "✅ سال تحصیلی بروزرسانی شد", updated });
    } catch (error) {
      console.error("❌ Error updating academic year:", error);
      res.status(500).json({ message: "خطا در بروزرسانی سال تحصیلی", error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await TrainerAcademicYear.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "سال تحصیلی پیدا نشد" });
      }

      res.status(200).json({ message: "✅ سال تحصیلی حذف شد" });
    } catch (error) {
      console.error("❌ Error deleting academic year:", error);
      res.status(500).json({ message: "خطا در حذف سال تحصیلی", error });
    }
  }
}
