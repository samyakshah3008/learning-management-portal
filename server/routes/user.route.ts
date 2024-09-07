import { Router } from "express";
import {
  deleteUser,
  fetchAllUsers,
  getUserInfo,
  updateAvatar,
  updatePassword,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/get-user-details", isAuthenticated, getUserInfo);
router.get(
  "/admin/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchAllUsers
);
router.put("/update-info", isAuthenticated, updateUserInfo);
router.put("/update-password", isAuthenticated, updatePassword);
router.put("/update-avatar", isAuthenticated, updateAvatar);
router.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
