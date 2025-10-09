import express from "express";
import { createEvaluationFormG, getEvaluationFormsByTrainer } from "../controllers/form-G";

const router = express.Router();

// POST: ذخیره فرم جدید
router.post("/", createEvaluationFormG);

// GET: دریافت فرم‌ها بر اساس trainerId
router.get("/trainer/:trainerId", getEvaluationFormsByTrainer);

export default router;
