import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import Order from "../models/orderModel";

//create new order
export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await Order.create(data);

    res.status(201).json({
      success: true,
      order,
    });
  }
);

//get all orders by admin
export const getAllOrdersService = async (res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
};
