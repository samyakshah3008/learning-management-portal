import { Router } from "express";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.get(
  "/get-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

router.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);

export default router;
