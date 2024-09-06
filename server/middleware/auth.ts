import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

import dotenv from "dotenv";
import { redis } from "../lib/redis";

dotenv.config({
  path: ".env",
});

const isAuthenticated = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken as string;

    if (!accessToken) {
      return next(new ErrorHandler("Please login to continue.", 400));
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN!
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is invalid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found!", 400));
    }

    req.user = JSON.parse(user);

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
  };
};

export { isAuthenticated };
