// routes/monographEvaluation.ts
import { Router } from "express";
import {
  createMonographEvaluation,
  getMonographEvaluations,
} from "../controllers/form-K"; // <-- مطمئن شو مسیر صحیح است

const router = Router();

router.post("/", (req, res, next) => {
  console.log("[route] POST /api/monographEvaluation", Object.keys(req.body).length ? "body present" : "no body");
  return createMonographEvaluation(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  console.log("[route] GET /api/monographEvaluation");
  return getMonographEvaluations(req, res).catch(next);
});

export default router;
