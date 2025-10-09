import { Router } from "express";
import {
  createEvaluationFormH,
  getEvaluationFormsH,
} from "../controllers/form-H";

const router = Router();

router.post("/", createEvaluationFormH);

// گرفتن فرم‌ها (همه یا بر اساس trainerId)
router.get("/", getEvaluationFormsH);

export default router;
