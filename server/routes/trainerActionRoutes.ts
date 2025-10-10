import express, { Request, Response } from "express";
import { TrainerAction } from "../models/trainerAction";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { trainerId, description, selectedForms } = req.body;

    if (!trainerId || !description) {
      return res.status(400).json({ message: "شناسه ترینر و توضیحات الزامی است" });
    }

    const newAction = new TrainerAction({
      trainer: trainerId,
      description,
      selectedForms: selectedForms || [],
    });

    const savedAction = await newAction.save();
    res.status(201).json(savedAction);
  } catch (error) {
    console.error("Error creating trainer action:", error);
    res.status(500).json({ message: "خطا در ثبت اکشن" });
  }
});

router.get("/:trainerId", async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.params;
    
    const actions = await TrainerAction.find({ trainer: trainerId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(actions);
  } catch (error) {
    console.error("Error fetching trainer actions:", error);
    res.status(500).json({ message: "خطا در دریافت اکشن‌ها" });
  }
});

router.delete("/:actionId", async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;
    
    const deletedAction = await TrainerAction.findByIdAndDelete(actionId);
    
    if (!deletedAction) {
      return res.status(404).json({ message: "اکشن یافت نشد" });
    }

    res.status(200).json({ message: "اکشن حذف شد" });
  } catch (error) {
    console.error("Error deleting trainer action:", error);
    res.status(500).json({ message: "خطا در حذف اکشن" });
  }
});

export { router as trainerActionRoutes };
