import express, { Request, Response } from "express";
import Trainer, { ITrainer } from "../models/trainerModel";

const router = express.Router();

// Create Trainer
router.post("/", async (req: Request, res: Response) => {
  try {
    const newTrainer = new Trainer(req.body);
    const savedTrainer = await newTrainer.save();
    res.status(201).json(savedTrainer);
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ message: "خطا در ثبت ترینر" });
  }
});

// Get all Trainers
router.get("/", async (_req: Request, res: Response) => {
  try {
    const trainers = await Trainer.find().lean();
    res.status(200).json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "خطا در دریافت ترینرها" });
  }
});

// Get Trainer by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const trainer = await Trainer.findById(req.params.id).lean();
    if (!trainer) return res.status(404).json({ message: "ترینر یافت نشد" });
    res.status(200).json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);
    res.status(500).json({ message: "خطا در دریافت ترینر" });
  }
});

// Update Trainer by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrainer) return res.status(404).json({ message: "ترینر یافت نشد" });
    res.status(200).json(updatedTrainer);
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: "خطا در بروزرسانی ترینر" });
  }
});

// Delete Trainer by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) return res.status(404).json({ message: "ترینر یافت نشد" });
    res.status(200).json({ message: "ترینر حذف شد" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ message: "خطا در حذف ترینر" });
  }
});

export { router as trainerRoutes };
