import { Router } from "express";

const router = Router();

import authRouter from "./auth.route";
import userRouter from "./user.route";

router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
