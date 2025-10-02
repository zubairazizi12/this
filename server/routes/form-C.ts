// routes/monographRoutes.ts
import express from 'express';
import { MonographController } from '../controllers/form-C';

const router = express.Router();

// ذخیره فرم جدید
router.post('/', MonographController.createForm);

// دریافت تمام فرم‌ها
router.get('/', MonographController.getAllForms);

export default router;