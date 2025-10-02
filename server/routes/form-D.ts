import express from "express";
import { createEvaluation, getEvaluations } from "../controllers/form-D";

const router = express.Router();

router.post("/", createEvaluation); // ذخیره فرم
router.get("/", getEvaluations);    // گرفتن تمام فرم‌ها (اختیاری)

export default router;
