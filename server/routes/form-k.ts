import { Router } from "express";
import {
  createMonographEvaluation,
  getMonographEvaluations,
} from "../controllers/form-K";

const router = Router();

// ایجاد فرم جدید
router.post("/", createMonographEvaluation);

// گرفتن فرم‌ها (اختیاری بر اساس trainerId)
router.get("/", getMonographEvaluations);

export default router;
