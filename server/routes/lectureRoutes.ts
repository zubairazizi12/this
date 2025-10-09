import express from 'express';
import { LectureModel } from '../models/Lecture';
import { z } from 'zod';

const router = express.Router();

const createLectureSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  date: z.string().transform((str) => new Date(str)),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  room: z.string().min(1, "Room is required"),
  notes: z.string().optional().default(""),
  files: z.array(z.string()).optional().default([]),
});

router.post('/', async (req, res) => {
  try {
    const validatedData = createLectureSchema.parse(req.body);
    const lecture = new LectureModel(validatedData);
    const savedLecture = await lecture.save();
    res.status(201).json(savedLecture);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error('Error creating lecture:', error);
    res.status(500).json({ message: 'Failed to create lecture' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;
    const query = teacherId ? { teacherId } : {};
    const lectures = await LectureModel.find(query).sort({ date: -1 });
    res.json(lectures);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Failed to fetch lectures' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lecture = await LectureModel.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
  } catch (error) {
    console.error('Error fetching lecture:', error);
    res.status(500).json({ message: 'Failed to fetch lecture' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const validatedData = createLectureSchema.partial().parse(req.body);
    const lecture = await LectureModel.findByIdAndUpdate(
      req.params.id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    
    res.json(lecture);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error('Error updating lecture:', error);
    res.status(500).json({ message: 'Failed to update lecture' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const lecture = await LectureModel.findByIdAndDelete(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({ message: 'Failed to delete lecture' });
  }
});

export { router as lectureRoutes };
