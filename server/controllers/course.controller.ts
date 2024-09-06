import { NextFunction, Request, Response } from "express";
import {
  editCourseService,
  uploadCourseService,
} from "../services/course.service";
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

export { editCourse, uploadCourse };
