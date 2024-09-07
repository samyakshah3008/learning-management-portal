import { Router } from "express";
import { createOrder, fetchAllOrders } from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/create-order", isAuthenticated, createOrder);
router.get(
  "/admin/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchAllOrders
);

export default router;
