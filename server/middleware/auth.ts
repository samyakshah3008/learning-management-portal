import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";

import dotenv from "dotenv";
import { redis } from "../lib/redis";

dotenv.config({
  path: ".env",
});

const isAuthenticated = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken as string;

    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "Please login to continue", success: false });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN!
    ) as JwtPayload;

    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Access token is invalid", success: false });
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({
          message: "PLease login to access this resource.",
          success: false,
        });
    }

    req.user = JSON.parse(user);

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return res.status(403).json({
        message: `Role: ${req.user?.role} is not allowed to access this resource`,
        success: false,
      });
    }
    next();
  };
};

export { isAuthenticated };
