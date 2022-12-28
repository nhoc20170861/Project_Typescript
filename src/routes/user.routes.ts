import { Router, Request, Response, NextFunction } from 'express';
import { allAccess, userBoard } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/authJwt';
import CourseController from '../controllers/course.controller';

const router = Router();

router.get('/home', (req: Request, res: Response) => {
    return res.json({ message: 'Welcome to bezkoder application.' });
});

router.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});

router.get('/all', allAccess);

router.get('/user', [verifyToken], userBoard);

router.post('/create-course', [verifyToken], CourseController.createCourse);

// [GET] list course stored in database
router.get('/courses', [verifyToken], CourseController.getAllCourse);

// [GET] single course
router.get('/courses/:courseId', [verifyToken], CourseController.getSingleCourse);

// [PATCH] update one course
router.patch('/update-course/:courseId', [verifyToken], CourseController.updateCourse);

// [DELETE] delete one course
router.delete('/delete-course/:courseId', [verifyToken], CourseController.deleteCourse);

export default router;
