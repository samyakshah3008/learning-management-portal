import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

import { redis } from "../lib/redis";

import {
  generateNewAccessTokenService,
  registratingUserService,
  signInUserService,
  thirdPartyAuthSignInService,
  verifyAndCreateUserService,
} from "../services/auth.service";

import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

import {
  IActivationRequest,
  ILoginRequest,
  ISocialAuthBody,
} from "../types/user.types";

dotenv.config({
  path: ".env",
});

const registratingUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const response = await registratingUserService(name, email, password);

      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        res.status(error.statusCode).json(error.message);
      }
      res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const verifyAndCreateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activationToken, activationCode } =
        req.body as IActivationRequest;

      const response = await verifyAndCreateUserService(
        activationToken,
        activationCode
      );

      return res.status(201).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const signInUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      const response = await signInUserService(email, password, res);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json(error.message);
      }
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const signOutUser = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      res.cookie("accessToken", "", { maxAge: 1 });
      res.cookie("refreshToken", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "User signed out successfully. ",
      });
    } catch (error: any) {
      return res.status(400).json(new ErrorHandler(error.message, 400));
    }
  }
);

const generateNewAccessToken = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken as string;
      const response = await generateNewAccessTokenService(
        refreshToken,
        req,
        res
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

const thirdPartyAuthSignIn = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const response = await thirdPartyAuthSignInService(
        email,
        name,
        avatar,
        res
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
  generateNewAccessToken,
  registratingUser,
  signInUser,
  signOutUser,
  thirdPartyAuthSignIn,
  verifyAndCreateUser,
};
