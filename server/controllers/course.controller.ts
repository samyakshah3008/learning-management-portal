import { NextFunction, Request, Response } from "express";
import {
  addAnswerService,
  addQuestionService,
  addReplyToReviewService,
  addReviewService,
  editCourseService,
  getAllCoursesService,
  getCourseByBuyerService,
  getParticularCourseService,
  uploadCourseService,
} from "../services/course.service";
import {
  IAddAnswerData,
  IAddQuestionData,
  IAddReplyToReviewData,
  IAddReviewData,
} from "../types/course.types";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

const uploadCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const response = await uploadCourseService(data);
      return res.status(201).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const editCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const response = await editCourseService(data, req);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getParticularCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params?.id;
      const response = await getParticularCourseService(courseId);
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getAllCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await getAllCoursesService();
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getCourseByBuyer = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params?.id;
      const response = await getCourseByBuyerService(userCourseList, courseId);
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const addQuestion = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const response = await addQuestionService(
        question,
        courseId,
        contentId,
        req
      );
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const addAnswer = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const response = await addAnswerService(
        answer,
        courseId,
        contentId,
        questionId,
        req
      );
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const addReview = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params?.id;
      const { review, rating } = req.body as IAddReviewData;

      const response = await addReviewService(
        userCourseList,
        courseId,
        review,
        rating,
        req
      );
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const addReplyToReview = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReplyToReviewData;

      const response = await addReplyToReviewService(
        comment,
        courseId,
        reviewId,
        req
      );
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

export {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  editCourse,
  getAllCourses,
  getCourseByBuyer,
  getParticularCourse,
  uploadCourse,
};
