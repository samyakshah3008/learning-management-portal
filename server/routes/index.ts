import { Router } from "express";

const router = Router();

import analyticsRouter from "./analytics.route";
import authRouter from "./auth.route";
import courseRouter from "./course.route";
import layoutRouter from "./layout.route";
import notificationRouter from "./notification.route";
import orderRouter from "./order.route";
import userRouter from "./user.route";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
router.use("/order", orderRouter);
router.use("/notification", notificationRouter);
router.use("/analytics", analyticsRouter);
router.use("/layout", layoutRouter);

export default router;
