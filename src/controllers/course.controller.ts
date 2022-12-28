import mongoose from 'mongoose';
import Course from '../models/course.model';
import { Request, Response } from 'express';

// create new cause

class CourseController {
    static createCourse = async (req: Request, res: Response) => {
        // console.log(req.body);
        const course = new Course({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description
        });

        try {
            const newCourse = await course.save();
            return res.status(201).json({
                success: true,
                message: 'New cause created successfully',
                Course: newCourse
            });
        } catch (err: any) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message
            });
        }
    };

    static getAllCourse = (req: Request, res: Response) => {
        Course.find()
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

    static getSingleCourse = (req: Request, res: Response) => {
        const id = req.params.courseId;
        Course.findById(id)
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

    static updateCourse = (req: Request, res: Response) => {
        const id = req.params.courseId;
        const updateObject = req.body;
        Course.updateOne({ _id: id }, { $set: updateObject })
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
    static deleteCourse = (req: Request, res: Response) => {
        const id = req.params.courseId;
        Course.findByIdAndRemove(id)
            .exec()
            .then(() =>
                res.status(204).json({
                    success: true
                })
            )
            .catch((err) =>
                res.status(500).json({
                    success: false
                })
            );
    };
}
export default CourseController;
