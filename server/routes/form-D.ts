import express from "express";
import { createEvaluation, getEvaluations } from "../controllers/form-D";

const router = express.Router();

// ذخیره فرم
router.post("/", createEvaluation);

// گرفتن فرم‌ها با امکان فیلتر بر اساس trainerId
router.get("/", getEvaluations);

export default router;
