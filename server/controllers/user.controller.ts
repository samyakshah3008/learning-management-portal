import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.model";

import {
  deleteUserService,
  fetchAllUsersService,
  getUserByIdService,
  updateAvatarService,
  updatePasswordService,
  updateUserInfoService,
  updateUserRoleService,
} from "../services/user.service";

import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

import {
  IUpdateAvatar,
  IUpdatePassword,
  IUpdateUserInfo,
} from "../types/user.types";

dotenv.config({
  path: ".env",
});

const getUserInfo = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const response = await getUserByIdService(userId, res);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const updateUserInfo = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;

      const response = await updateUserInfoService(userId, name, email);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const updatePassword = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const user = await User.findById(req.user?._id).select("+password");

      const response = await updatePasswordService(
        oldPassword,
        newPassword,
        user,
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

const updateAvatar = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatar;

      const userId = req?.user._id;
      const response = await updateAvatarService(userId, avatar, req);

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const fetchAllUsers = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const response = await fetchAllUsersService();

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const updateUserRole = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      const response = await updateUserRoleService(id, role);

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const deleteUser = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await deleteUserService(id);

      res.status(200).json(response);
    } catch (error: any) {
      console.log(error, "error");
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

export {
  deleteUser,
  fetchAllUsers,
  getUserInfo,
  updateAvatar,
  updatePassword,
  updateUserInfo,
  updateUserRole,
};
