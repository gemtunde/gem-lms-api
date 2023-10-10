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
