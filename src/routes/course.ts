// routes/course.ts
import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  updateCourse,
} from '../controllers/courseController';
import { isAdmin } from '../middlewares/adminAuth';

const router = Router();
//@ts-ignore
router.post('/create-course', isAdmin, createCourse);
//@ts-ignore
router.get('/courses', isAdmin,getAllCourses); 
//@ts-ignore
router.put('/courses/:courseId', isAdmin,updateCourse); 

export default router;
