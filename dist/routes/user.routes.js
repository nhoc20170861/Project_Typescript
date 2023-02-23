"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const course_controller_1 = __importDefault(require("../controllers/course.controller"));
const router = (0, express_1.Router)();
router.get('/home', (req, res) => {
    return res.json({ message: 'Welcome to bezkoder application.' });
});
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});
router.get('/all', user_controller_1.allAccess);
// [GET] /api/test/user for loggedin users (user/moderator/admin)
router.get('/user', [authJwt_1.default.verifyToken], user_controller_1.userBoard);
// [GET] /api/test/mod for moderator
router.get('/mod', [authJwt_1.default.verifyToken, authJwt_1.default.isModerator], user_controller_1.moderatorBoard);
// [GET] /api/test/admin for admin users
router.get('/admin', [authJwt_1.default.verifyToken, authJwt_1.default.isAdmin], user_controller_1.adminBoard);
router.post('/create-course', [authJwt_1.default.verifyToken], course_controller_1.default.createCourse);
// [GET] list course stored in database
router.get('/courses', [authJwt_1.default.verifyToken], course_controller_1.default.getAllCourse);
// [GET] single course
router.get('/courses/:courseId', [authJwt_1.default.verifyToken], course_controller_1.default.getSingleCourse);
// [PATCH] update one course
router.patch('/update-course/:courseId', [authJwt_1.default.verifyToken], course_controller_1.default.updateCourse);
// [DELETE] delete one course
router.delete('/delete-course/:courseId', [authJwt_1.default.verifyToken], course_controller_1.default.deleteCourse);
exports.default = router;
