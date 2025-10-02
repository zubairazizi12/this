import { Request, Response } from "express";
import { TeacherActivityModel } from "../models/TeacherActivity";

export const TeacherActivityController = {
  create: async (req: Request, res: Response) => {
    try {
      const { teachers, activities } = req.body;
      const newRecord = new TeacherActivityModel({ teachers, activities });
      await newRecord.save();
      res.status(201).json({ message: "Form saved successfully", data: newRecord });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save teacher activity" });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const records = await TeacherActivityModel.find().sort({ createdAt: -1 });
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch teacher activities" });
    }
  },
};
