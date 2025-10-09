import express from "express";
import {
  createEvaluationFormE,
  getEvaluationFormsE,
} from "../controllers/form-E";

const router = express.Router();

// POST ایجاد فرم جدید
router.post("/", createEvaluationFormE);

// GET دریافت فرم‌ها بر اساس trainerId
router.get("/", getEvaluationFormsE);

export default router;
