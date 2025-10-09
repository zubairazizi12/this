import { Router } from "express";
import { TeacherActivityController } from "../controllers/form-J";

export const teacherActivityRoutes = Router();

// ایجاد فرم
teacherActivityRoutes.post("/", TeacherActivityController.create);

// گرفتن تمام فرم‌ها برای یک ترینر
teacherActivityRoutes.get("/trainer/:trainerId", TeacherActivityController.getAll);

// (اختیاری) بروزرسانی فرم
teacherActivityRoutes.put("/:id", TeacherActivityController.update);

