import express from "express";
import {
  UpdatePassword,
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateProfilePicture,
  updateUserInfo,
} from "../controllers/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registrationUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser);
router.get("/refresh", updateAccessToken);

router.get("/me", isAuthenticated, getUserInfo);
router.put("/update-user-info", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, UpdatePassword);
router.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

router.post("/social-auth", socialAuth);
export default router;
