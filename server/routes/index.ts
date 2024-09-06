import { Router } from "express";

const router = Router();

import authRouter from "./auth.route";
import courseRouter from "./course.route";
import userRouter from "./user.route";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);

export default router;
