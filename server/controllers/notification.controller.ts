import { NextFunction, Request, Response } from "express";
import cron from "node-cron";
import { Notification } from "../models/notification.model";
import {
  getNotificationsService,
  updateNotificationService,
} from "../services/notification.service";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

const getNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await getNotificationsService();
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const updateNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await Notification.findById(req.params.id);
      const response = await updateNotificationService(notification);

      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 100);
  await Notification.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
});

export { getNotifications, updateNotification };
