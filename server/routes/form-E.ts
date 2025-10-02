import express from "express";
import {
  createEvaluationFormE,
  getAllEvaluationFormsE,
  getEvaluationFormsByResident,
  getEvaluationFormEById,
  updateEvaluationFormE,
  deleteEvaluationFormE,
} from "../controllers/form-E";

const router = express.Router();



// ایجاد فرم جدید
router.post("/", createEvaluationFormE);
// گرفتن تمام فرم‌ها بدون فیلتر
router.get("/", getAllEvaluationFormsE);
// تمام فرم‌های یک Resident خاص
router.get("/resident/:residentId", getEvaluationFormsByResident);

// یک فرم خاص با ID خودش
router.get("/:id", getEvaluationFormEById);

// آپدیت فرم
router.put("/:id", updateEvaluationFormE);

// حذف فرم
router.delete("/:id", deleteEvaluationFormE);

export default router;
