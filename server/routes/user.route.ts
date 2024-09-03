import { Router } from "express";
import {
  registratingUser,
  verifyAndCreateUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/signup", registratingUser);
router.post("/signup/verify-code", verifyAndCreateUser);

export default router;
