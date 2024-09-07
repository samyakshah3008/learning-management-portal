import cloudinary from "cloudinary";
import ejs from "ejs";
import { Request } from "express";
import mongoose from "mongoose";
import path from "path";
import sendMail from "../lib/nodemailer";
import { redis } from "../lib/redis";
import { Course } from "../models/course.model";
import { Notification } from "../models/notification.model";
import { ErrorHandler } from "../utils/error-handler";

const uploadCourseService = async (data: any) => {
  const thumbnail = data?.thumbnail;
  if (thumbnail) {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    data.thumbnail = {
      public_id: myCloud?.public_id,
      url: myCloud.secure_url,
    };
  } else {
    // throw new ErrorHandler("Thumbnail is required", 400);
  }
  const course = await Course.create(data);
  return { success: true, course };
};

const createCourseService = async (data: any) => {
  const course = await Course.create(data);
  return { success: true, course };
};

const editCourseService = async (data: any, req: Request) => {
  const thumbnail = data?.thumbnail;

  if (thumbnail) {
    await cloudinary.v2.uploader.destroy(thumbnail?.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    data.thumbnail = {
      public_id: myCloud?.public_id,
      url: myCloud.secure_url,
    };
  }

  const courseId = req.params?.id;
  const course = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: data,
    },
    { new: true }
  );

  return course;
};

const getParticularCourseService = async (courseId: string) => {
  if (!courseId) {
    throw new ErrorHandler("Course id is required.", 400);
  }
  const findCourseDataFromRedis = await redis.get(courseId);

  if (findCourseDataFromRedis) {
    const course = JSON.parse(findCourseDataFromRedis);
    return { success: true, course };
  } else {
    const course = await Course.findById(courseId).select(
      "-courseData.videoUrl -courseData.suggestion --courseData.questions --courseData.links"
    );
    await redis.set(courseId, JSON.stringify(course));

    return { success: true, course };
  }
};

const getAllCoursesService = async () => {
  const findCoursesDataFromRedis = await redis.get("allCourses");
  if (findCoursesDataFromRedis) {
    const courses = JSON.parse(findCoursesDataFromRedis);
    return { success: true, courses };
  } else {
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestion --courseData.questions --courseData.links"
    );

    await redis.set("allCourses", JSON.stringify(courses));
    return { success: true, courses };
  }
};

const getCourseByBuyerService = async (
  userCourseList: any,
  courseId: string
) => {
  if (!userCourseList?.length) {
    throw new ErrorHandler("User course list is required.", 400);
  }
  if (!courseId) {
    throw new ErrorHandler("Course id is required.", 400);
  }
  const findExistingCourse = userCourseList?.find(
    (course: any) => course?._id?.toString() === courseId
  );

  if (!findExistingCourse) {
    throw new ErrorHandler("You are not eligible to access this course", 400);
  }

  const course = await Course.findById(courseId);
  const content = course?.courseData;
  return { success: true, content };
};

const addQuestionService = async (
  question: any,
  courseId: any,
  contentId: any,
  req: Request | any
) => {
  if (!question?.length) {
    throw new ErrorHandler("Question is required.", 400);
  }
  if (!courseId) {
    throw new ErrorHandler("Course id is required.", 400);
  }
  if (!contentId) {
    throw new ErrorHandler("Content id is required.", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ErrorHandler("No course found", 404);
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ErrorHandler("Invalid content id", 400);
  }

  const courseContent = course?.courseData?.find((item: any) =>
    item?._id?.equals(contentId)
  );

  if (!courseContent) {
    throw new ErrorHandler(
      "No content with provided id found of the course",
      400
    );
  }

  const newQuestion: any = {
    user: req?.user,
    question,
    questionReplies: [],
  };

  courseContent?.questions?.push(newQuestion);

  await Notification.create({
    user: req?.user?._id,
    title: "New Question Received",
    message: `You have new question in ${courseContent?.title}`,
  });

  await course?.save();

  return { success: true, course };
};

const addAnswerService = async (
  answer: string,
  courseId: string,
  contentId: string,
  questionId: string,
  req: Request | any
) => {
  if (!answer?.length) {
    throw new ErrorHandler("Question is required.", 400);
  }
  if (!courseId) {
    throw new ErrorHandler("Course id is required.", 400);
  }
  if (!contentId) {
    throw new ErrorHandler("Content id is required.", 400);
  }
  if (!questionId) {
    throw new ErrorHandler("Question id is required.", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ErrorHandler("No course found", 404);
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ErrorHandler("Invalid content id", 400);
  }

  const courseContent = course?.courseData?.find((item: any) =>
    item?._id?.equals(contentId)
  );

  if (!courseContent) {
    throw new ErrorHandler(
      "No content with provided id found of the course",
      400
    );
  }

  const question: any = courseContent?.questions?.find((item: any) =>
    item?._id?.equals(questionId)
  );

  if (!question) {
    throw new ErrorHandler("Question not found", 404);
  }

  const newAnswer: any = {
    user: req?.user,
    answer,
  };

  question.questionReplies.push(newAnswer);
  await course?.save();

  if (req?.user?._id === question?.user?._id) {
    await Notification.create({
      user: req?.user?._id,
      title: "New Question Reply Received",
      message: `You have new question reply in ${courseContent?.title}`,
    });
  } else {
    const data = {
      name: question.user.name,
      title: courseContent.title,
    };

    await ejs.renderFile(
      path.join(__dirname, "../templates/question-reply.ejs"),
      data
    );

    await sendMail({
      email: question.user.email,
      subject: "Question Reply",
      template: "question-reply.ejs",
      data,
    });
  }

  return { success: true, course };
};

const addReviewService = async (
  userCourseList: any,
  courseId: string,
  review: string,
  rating: number,
  req: Request | any
) => {
  const courseExists = userCourseList?.some(
    (course: any) => course?._id?.toString() === courseId.toString()
  );

  if (!courseExists) {
    throw new ErrorHandler("You are not eligible to access this course", 400);
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler("Course not found", 404);
  }

  const reviewData: any = {
    user: req?.user,
    rating,
    comment: review,
  };

  course?.reviews.push(reviewData);

  let avg = 0;
  course?.reviews.forEach((rev: any) => {
    avg += rev?.rating;
  });

  if (course) {
    course.ratings = avg / course?.reviews?.length;
  }

  await course?.save();

  await Notification.create({
    user: req?.user?._id,
    title: "New Review Received",
    message: `${req?.user?.name} has given a review in ${course?.name}`,
  });

  return { success: true, course };
};

const addReplyToReviewService = async (
  comment: string,
  courseId: string,
  reviewId: string,
  req: Request | any
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler("Course not found!", 404);
  }

  const review = course?.reviews?.find(
    (review: any) => review?._id?.toString() === reviewId
  );

  if (!review) {
    throw new ErrorHandler("Review not found!", 404);
  }

  const replyData: any = {
    user: req?.user,
    comment,
  };

  if (!review?.commentReplies) {
    review.commentReplies = [];
  }

  review?.commentReplies?.push(replyData);

  await course?.save();

  return { success: true, course };
};

const fetchAllCoursesService = async () => {
  const courses = await Course.find().sort({ createdAt: -1 });
  return { success: true, courses };
};

const deleteCourseService = async (id: string) => {
  if (!id) {
    throw new ErrorHandler("User Id is required", 400);
  }

  const course = await Course.findById(id);

  if (!course) {
    throw new ErrorHandler("Course not found", 404);
  }

  await course.deleteOne({ id });
  await redis.del(id);
  return { success: true, message: "Course deleted successfully. " };
};

export {
  addAnswerService,
  addQuestionService,
  addReplyToReviewService,
  addReviewService,
  createCourseService,
  deleteCourseService,
  editCourseService,
  fetchAllCoursesService,
  getAllCoursesService,
  getCourseByBuyerService,
  getParticularCourseService,
  uploadCourseService,
};
