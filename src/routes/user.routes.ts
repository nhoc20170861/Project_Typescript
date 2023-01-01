import { Router, Request, Response, NextFunction } from 'express';
import { allAccess, userBoard, moderatorBoard, adminBoard } from '../controllers/user.controller';
import authJwt from '../middlewares/authJwt';
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

// [GET] /api/test/user for loggedin users (user/moderator/admin)
router.get('/user', [authJwt.verifyToken], userBoard);

// [GET] /api/test/mod for moderator
router.get('/mod', [authJwt.verifyToken, authJwt.isModerator], moderatorBoard);

// [GET] /api/test/admin for admin users
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

router.post('/create-course', [authJwt.verifyToken], CourseController.createCourse);

// [GET] list course stored in database
router.get('/courses', [authJwt.verifyToken], CourseController.getAllCourse);

// [GET] single course
router.get('/courses/:courseId', [authJwt.verifyToken], CourseController.getSingleCourse);

// [PATCH] update one course
router.patch('/update-course/:courseId', [authJwt.verifyToken], CourseController.updateCourse);

// [DELETE] delete one course
router.delete('/delete-course/:courseId', [authJwt.verifyToken], CourseController.deleteCourse);

export default router;
