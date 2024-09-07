import { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  fetchAllOrdersService,
} from "../services/order.service";
import { IOrder } from "../types/order.types";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const response = await createOrderService(courseId, payment_info, req);
      return res.status(201).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const fetchAllOrders = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const response = await fetchAllOrdersService();

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

export { createOrder, fetchAllOrders };
