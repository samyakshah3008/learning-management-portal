import { Router } from "express";
import {
  registratingUser,
  signInUser,
  signOutUser,
  verifyAndCreateUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/signup", registratingUser);
router.post("/signup/verify-code", verifyAndCreateUser);
router.post("/signin", signInUser);
router.get("/signout", isAuthenticated, signOutUser);

export default router;
