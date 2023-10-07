import { Request } from "express";
import { IUSER } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUSER;
    }
  }
}
