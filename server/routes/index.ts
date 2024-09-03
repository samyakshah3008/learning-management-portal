import { Router } from "express";

const router = Router();

import userRouter from "./user.route";

router.use("/", userRouter);

export default router;
