require("dotenv").config();
import User, { IUSER } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

//register interface
interface IRegistration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      //validation
      if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields", 400));
      }

      if (password.length < 6) {
        return next(
          new ErrorHandler("Password must be greater than 6 characters", 400)
        );
      }

      const isEmailExist = await User.findOne({ email });

      //check if email/user exists
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const userData: IRegistration = {
        name,
        email,
        password,
      };

      //create activation token
      const activationToken = createActivationToken(userData);

      //activation code
      const activationCode = activationToken.activationCode;

      //send mail
      const data = { user: { name: userData.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: userData.email,
          subject: "Activate yout Account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${userData.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

//take to utils folder
const createActivationToken = (userData: IRegistration): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { userData, activationCode },
    process.env.TOKEN_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
