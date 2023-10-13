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
//get all users by admin
export const getAllUsersService = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
};
//update user role by admin
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });

  res.status(200).json({
    success: true,
    user,
  });
};

//admin delete user by id
export const deleteUserService = async (res: Response, id: any) => {
  await User.findByIdAndDelete(id);
  await redis.del(id);

  res.status(200).json({
    success: true,
    message: "user deleted success",
  });
};
