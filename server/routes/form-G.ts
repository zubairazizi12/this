import { Router } from "express";
import {
  createEvaluationFormG,
  getEvaluationFormsG,
  getEvaluationFormGById,
  updateEvaluationFormG,
  deleteEvaluationFormG,
} from "../controllers/form-G";

const router = Router();

// ایجاد فرم جدید
router.post("/", createEvaluationFormG);

// گرفتن همه فرم‌ها
router.get("/", getEvaluationFormsG);

// گرفتن فرم با ID
router.get("/:id", getEvaluationFormGById);

// آپدیت فرم
router.put("/:id", updateEvaluationFormG);

// حذف فرم
router.delete("/:id", deleteEvaluationFormG);

export default router;
