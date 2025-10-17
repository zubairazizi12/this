import { Router } from "express";
import { TrainerAcademicYearController } from "../controllers/trainer-academic-year";

const router = Router();

router.post("/", TrainerAcademicYearController.create);

router.get("/", TrainerAcademicYearController.getAll);

router.get("/trainer/:trainerId", TrainerAcademicYearController.getByTrainerId);

router.get("/trainer/:trainerId/current", TrainerAcademicYearController.getCurrentAcademicYear);

router.post("/trainer/:trainerId/promote", TrainerAcademicYearController.promoteTrainer);

router.put("/:id", TrainerAcademicYearController.update);

router.delete("/:id", TrainerAcademicYearController.delete);

export { router as trainerAcademicYearRoutes };
