import ejs from "ejs";
import { Request } from "express";
import path from "path";
import sendMail from "../lib/nodemailer";
import { Course } from "../models/course.model";
import { Notification } from "../models/notification.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { ErrorHandler } from "../utils/error-handler";

const createOrderService = async (
  courseId: string,
  payment_info: object,
  req: Request | any
) => {
  const user = await User.findById(req?.user?._id);
  const courseExistsInUser = user?.courses?.some(
    (course: any) => course?._id?.toString() === courseId
  );

  if (courseExistsInUser) {
    throw new ErrorHandler("You have already purchased this course.", 400);
  }

  const course: any = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler("Course not found", 404);
  }

  const data: any = {
    courseId: course?._id,
    userId: user?._id,
    payment_info,
  };

  const order = await Order.create(data);

  const mailData = {
    order: {
      _id: course._id.toString()?.slice(0, 6),
      name: course?.name,
      price: course?.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };

  const html = await ejs.renderFile(
    path.join(__dirname, "../templates/order-confirmation.ejs"),
    { order: mailData }
  );

  if (user) {
    await sendMail({
      email: user.email,
      subject: "Order Confirmation",
      template: "order-confirmation.ejs",
      data: mailData,
    });
  }

  user?.courses.push(course?._id);
  await user?.save();

  await Notification.create({
    user: user?._id,
    title: "New Order",
    message: `You have a new order from ${course?.name}`,
  });

  course.purchased ? (course.purchased += 1) : course.purchased;

  await course.save();

  return { success: true, order: course };
};

const fetchAllOrdersService = async () => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return { success: true, orders };
};

export { createOrderService, fetchAllOrdersService };
