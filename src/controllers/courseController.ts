// controllers/courseController.ts
import { Request, Response } from 'express';
import Course from '../models/Course';
import { createCourseSchema } from '../validators/userValidation';



export const createCourse = async (req: Request, res: Response) => {
  const { error } = createCourseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { courseName, price, courseDuration } = req.body;
    const { id: adminId } = (req as any).user; 

    const course = await Course.create({
      courseName,
      price,
      courseDuration,
      createdBy: adminId,
    });

    return res.status(201).json({ message: 'Course created', course });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to create course', error: error.message });
  }
};


export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll();
    return res.status(200).json({ courses });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to retrieve courses', error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { courseName, price, courseDuration } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.courseName = courseName || course.courseName;
    course.price = price || course.price;
    course.courseDuration = courseDuration || course.courseDuration;

    await course.save();

    return res.status(200).json({ message: 'Course updated', course });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to update course', error: error.message });
  }
};
