import { Notification } from "../models/notification.model";
import { ErrorHandler } from "../utils/error-handler";

const getNotificationsService = async () => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  return { success: true, notifications };
};

const updateNotificationService = async (notification: any) => {
  if (!notification) {
    throw new ErrorHandler("Notification not found!", 404);
  }
  notification?.status ? (notification.status = "read") : notification?.status;
  await notification.save();
  const notifications = await Notification.find().sort({ createdAt: -1 });
  return { success: true, notifications };
};

export { getNotificationsService, updateNotificationService };
