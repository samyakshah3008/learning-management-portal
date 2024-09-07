import { model, Model, Schema } from "mongoose";
import { IOrder } from "../types/order.types";

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = model("Order", orderSchema);

export { Order };
