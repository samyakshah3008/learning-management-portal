import { NextFunction, Request, Response } from "express";
import {
  createLayoutService,
  editLayoutService,
  getLayoutByTypeService,
} from "../services/layout.service";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

const createLayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const response = await createLayoutService(type, req);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const editLayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const response = await editLayoutService(type, req);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const getLayoutByType = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const response = await getLayoutByTypeService(type);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

export { createLayout, editLayout, getLayoutByType };
