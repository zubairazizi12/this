// routes/form-H.ts
import { Router } from "express";
import {
  createEvaluationFormH,
  getEvaluationFormsH,
} from "../controllers/form-H";

const router = Router();

// ایجاد فرم جدید
router.post("/", createEvaluationFormH);

// گرفتن همه فرم‌ها
router.get("/", getEvaluationFormsH);

export default router;
