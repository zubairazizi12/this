import { Request, Response } from "express";
import Checklist from "../models/form-F";

// ایجاد Checklist
export const createChecklist = async (req: Request, res: Response) => {
  try {
    const { studentName, fatherName, year, sections } = req.body;

    if (!studentName || !fatherName || !year || !sections) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    const checklist = new Checklist({
      studentName,
      fatherName,
      year,
      sections,
    });

    const saved = await checklist.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ذخیره اطلاعات" });
  }
};

// دریافت Checklist بر اساس نام ترینی
// دریافت Checklist بر اساس نام ترینی (Case-Insensitive)
export const getChecklistByStudentName = async (req: Request, res: Response) => {
  try {
    const { studentName } = req.params;

    const checklist = await Checklist.findOne({
      studentName: { $regex: new RegExp("^" + studentName + "$", "i") }
    });

    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    // Transform sections data to scores format for frontend
    const scores: Record<string, Record<number, number>> = {};
    
    checklist.sections.forEach(section => {
      section.activities.forEach(activity => {
        scores[activity.id] = {};
        activity.months.forEach(monthData => {
          scores[activity.id][monthData.month] = monthData.value;
        });
      });
    });

    const response = {
      studentName: checklist.studentName,
      fatherName: checklist.fatherName,
      year: checklist.year,
      scores: scores
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

