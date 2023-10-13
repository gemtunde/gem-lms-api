import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/orderController";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

export default router;
