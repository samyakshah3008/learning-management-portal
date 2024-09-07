import { NextFunction, Request, Response } from "express";
import { Course } from "../models/course.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { generateLast12MonthsData } from "../services/analytics.service";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

const getUsersAnalytics = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(User);

      res.status(200).json({ success: true, users });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getCourseAnalytics = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(Course);

      res.status(200).json({ success: true, courses });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getOrderAnalytics = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(Order);

      res.status(200).json({ success: true, orders });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

export { getCourseAnalytics, getOrderAnalytics, getUsersAnalytics };
