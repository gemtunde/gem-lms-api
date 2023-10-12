require("dotenv").config();
import User, { IUSER } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { IOrder } from "../models/orderModel";
import Course from "../models/courseModel";
import { newOrder } from "../services/orderService";
import Notification from "../models/notificationModel";

//create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { courseId, payment_info } = req.body as IOrder;

      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 500));
      }
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistInUser) {
        return next(
          new ErrorHandler("you have already purchased this course", 500)
        );
      }
      const course = await Course.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 500));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      //send order email
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      //save order course or purchased in user,
      user?.courses.push(course?._id);
      await user?.save();

      //notify admin of order
      await Notification.create({
        userId: user?._id,
        title: "New Order",
        message: `You have a new Order from ${course?.name}`,
      });

      //its not working...check later
      // course.purchased ? (course.purchased += 1) : course.purchased;

      course.purchased += 1;

      await course.save();
      //create order
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
