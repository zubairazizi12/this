// controllers/monographController.ts
import { Request, Response } from 'express';
import { MonographEvaluationForm } from '../models/form-C';

export class MonographController {
  // ایجاد فرم جدید
  static async createForm(req: Request, res: Response) {
    try {
      const formData = req.body;
      const newForm = new MonographEvaluationForm(formData);
      const savedForm = await newForm.save();
      
      res.status(201).json({
        success: true,
        message: 'فرم با موفقیت ذخیره شد',
        data: savedForm
      });
    } catch (error: any) {
      console.error('Error saving form:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ذخیره فرم'
      });
    }
  }

  // دریافت تمام فرم‌ها
// controllers/monographController.ts
static async getAllForms(req: Request, res: Response) {
  try {
    // فعلاً همه‌ی فرم‌ها را می‌گیریم
    const forms = await MonographEvaluationForm.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error: any) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت داده‌ها'
    });
  }
}

}