import express from "express";
import { registrationUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registrationUser);

export default router;
