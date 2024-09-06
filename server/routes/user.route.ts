import { Router } from "express";
import {
  getUserInfo,
  updateAvatar,
  updatePassword,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/get-user-details", isAuthenticated, getUserInfo);
router.put("/update-info", isAuthenticated, updateUserInfo);
router.put("/update-password", isAuthenticated, updatePassword);
router.put("/update-avatar", isAuthenticated, updateAvatar);

export default router;
