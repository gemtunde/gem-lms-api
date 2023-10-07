import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
} from "../controllers/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registrationUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser);

export default router;
