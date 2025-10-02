import { Router } from "express";
import { TeacherActivityController } from "../controllers/TeacherActivityController";
import { isDemoAuthenticated } from "../demoAuth";

export const teacherActivityRoutes = Router();

teacherActivityRoutes.post("/", isDemoAuthenticated, TeacherActivityController.create);
teacherActivityRoutes.get("/", isDemoAuthenticated, TeacherActivityController.getAll);
