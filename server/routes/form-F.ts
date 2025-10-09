import express from "express";
import { createChecklist,getChecklistByStudentName   } from "../controllers/form-F";

const router = express.Router();

router.post("/", createChecklist); // ذخیره فرم
// router.get("/", getChecklists);    // مشاهده لیست ذخیره شده
router.get("/student/:studentName", getChecklistByStudentName);

export default router;
