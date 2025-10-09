import { TeacherActivityModel } from "../models/form-J"; // مدل اصلاح شده

export class TeacherActivityController {
  static async create(req, res) {
    try {
      const { trainerId, teachers, activities } = req.body;
  
      if (!trainerId) {
        return res.status(400).json({ message: "TrainerId الزامی است" });
      }
  
      const newForm = new TeacherActivityModel({ trainerId, teachers, activities });
      await newForm.save();
      res.status(201).json(newForm);
    } catch (err) {
      res.status(500).json({ message: "خطا در ذخیره فرم", error: err });
    }
  }
  

  static async getAll(req, res) {
    try {
      const { trainerId } = req.query; // 🔹 از query بگیر
      if (!trainerId) {
        return res.status(400).json({ message: "TrainerId الزامی است" });
      }
  
      const forms = await TeacherActivityModel.find({ trainerId }).sort({ createdAt: -1 });
      res.json(forms);
    } catch (err) {
      res.status(500).json({ message: "خطا در دریافت داده‌ها", error: err });
    }
  }
  
  
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await TeacherActivityModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "فرم یافت نشد" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "خطا در بروزرسانی فرم", error: err });
    }
  }
}
