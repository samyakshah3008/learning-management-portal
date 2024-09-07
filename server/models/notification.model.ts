import { model, Model, Schema } from "mongoose";
import { INotification } from "../types/notification.types";

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

const Notification: Model<INotification> = model(
  "Notification",
  notificationSchema
);

export { Notification };
