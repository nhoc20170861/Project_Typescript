"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const course_model_1 = __importDefault(require("../models/course.model"));
// create new cause
class CourseController {
}
_a = CourseController;
CourseController.createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const course = new course_model_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description
    });
    try {
        const newCourse = yield course.save();
        return res.status(201).json({
            success: true,
            message: 'New cause created successfully',
            Course: newCourse
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message
        });
    }
});
CourseController.getAllCourse = (req, res) => {
    course_model_1.default.find()
        .select('_id title description')
        .then((allCourse) => {
        return res.status(200).json({
            success: true,
            message: 'A list of all course',
            Course: allCourse
        });
    })
        .catch((err) => {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message
        });
    });
};
CourseController.getSingleCourse = (req, res) => {
    const id = req.params.courseId;
    course_model_1.default.findById(id)
        .then((singleCourse) => {
        if (singleCourse != null)
            res.status(200).json({
                success: true,
                message: `More on ${singleCourse.title}`,
                Course: singleCourse
            });
    })
        .catch((err) => {
        res.status(500).json({
            success: false,
            message: 'This course does not exist',
            error: err.message
        });
    });
};
CourseController.updateCourse = (req, res) => {
    const id = req.params.courseId;
    const updateObject = req.body;
    course_model_1.default.updateOne({ _id: id }, { $set: updateObject })
        .exec()
        .then(() => {
        res.status(200).json({
            success: true,
            message: 'Course is updated',
            updateCourse: updateObject
        });
    })
        .catch((err) => {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    });
};
CourseController.deleteCourse = (req, res) => {
    const id = req.params.courseId;
    course_model_1.default.findByIdAndRemove(id)
        .exec()
        .then(() => res.status(204).json({
        success: true
    }))
        .catch((err) => res.status(500).json({
        success: false
    }));
};
exports.default = CourseController;
