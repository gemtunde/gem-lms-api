import { Response } from "express";
import { redis } from "../utils/redis";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import Course from "../models/courseModel";

//create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await Course.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

//get all users by admin
export const getAllCoursesService = async (res: Response) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    courses,
  });
};

//admin delete course by id
export const deleteCourseService = async (res: Response, id: any) => {
  await Course.findByIdAndDelete(id);
  await redis.del(id);

  res.status(200).json({
    success: true,
    message: "course deleted success",
  });
};
