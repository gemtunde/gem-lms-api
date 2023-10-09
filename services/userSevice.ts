import { Response } from "express";
import User from "../models/userModel";
import { redis } from "../utils/redis";

//get user by id using mongoose db
// export const getUserById = async (id: string, res: Response) => {
//   const user = await User.findById(id);
//   res.status(200).json({
//     success: true,
//     user,
//   });
// };

//another method to get user data --using redis
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({
      success: true,
      user,
    });
  }
};
