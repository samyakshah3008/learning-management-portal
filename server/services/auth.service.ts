import dotenv from "dotenv";
import ejs from "ejs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";

import { User } from "../models/user.model";

import sendMail from "../lib/nodemailer";
import { redis } from "../lib/redis";
import { ErrorHandler } from "../utils/error-handler";
import {
  accessTokenOptions,
  createActivationToken,
  refreshTokenOptions,
  saveTokensAndSignIn,
} from "../utils/jwt";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants/tokens";
import { IRegistratingBody } from "../types/user.types";

dotenv.config({
  path: ".env",
});

const registratingUserService = async (
  name: string,
  email: string,
  password: string
) => {
  if (!name?.length) {
    throw new ErrorHandler("Name is required. ", 400);
  }
  if (!email?.length) {
    throw new ErrorHandler("Email is required. ", 400);
  }
  if (!password?.length) {
    throw new ErrorHandler("Password is required. ", 400);
  }

  const findUserWithEmail = await User.findOne({ email });
  if (findUserWithEmail) {
    throw new ErrorHandler("User with this email already exists. ", 400);
  }

  const user: IRegistratingBody = {
    name,
    email,
    password,
  };

  const { activationCode, token } = createActivationToken(user);

  const data = { user: { name: user.name }, activationCode };

  const html = await ejs.renderFile(
    path.join(__dirname, "../templates/activation-mail.ejs"),
    data
  );

  await sendMail({
    email: user.email,
    subject: "Activate your account",
    template: "activation-mail.ejs",
    data,
  });

  return {
    success: true,
    message: `Please check your email: ${user.email} to activate your account. `,
    activationToken: token,
  };
};

const verifyAndCreateUserService = async (
  activationToken: string,
  activationCode: string
) => {
  if (!activationToken?.length) {
    throw new ErrorHandler("Activation Token is required. ", 400);
  }

  if (!activationCode?.length) {
    throw new ErrorHandler("Activation code is required. ", 400);
  }

  const newUser: any = jwt.verify(
    activationToken,
    process.env.ACTIVATION_SECRET!
  );

  if (newUser.activationCode !== activationCode) {
    throw new ErrorHandler("Invalid activation code", 400);
  }

  const { name, email, password } = newUser.user;

  const findExistingUser = await User.findOne({ email });

  if (findExistingUser) {
    throw new ErrorHandler("User already exists, please login instead", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return { success: true, user };
};

const signInUserService = async (
  email: string,
  password: string,
  res: Response
) => {
  if (!email || !password) {
    throw new ErrorHandler("Email and password both are required. ", 400);
  }

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new ErrorHandler("User not found, rather signup instead. ", 404);
  }

  const isPasswordCorrect = await existingUser.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ErrorHandler("Incorrect password, please try again. ", 400);
  }

  const response = saveTokensAndSignIn(existingUser, res);
  return response;
};

const generateNewAccessTokenService = async (
  refreshToken: string,
  req: Request | any,
  res: Response
) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN!
  ) as JwtPayload;

  if (!decoded) {
    throw new ErrorHandler("Could not refresh token", 400);
  }

  const session = await redis.get(decoded.id as string);

  if (!session) {
    throw new ErrorHandler("Please login to access this resource.", 400);
  }

  const user = JSON.parse(session);

  const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const newRefreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  req.user = user;

  res.cookie("accessToken", newAccessToken, accessTokenOptions);
  res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

  await redis.set(user?._id, JSON.stringify(user), "EX", 604800); // 7 days

  return { status: "success", newAccessToken };
};

const thirdPartyAuthSignInService = async (
  email: string,
  name: string,
  avatar: string,
  res: Response
) => {
  if (!email?.length) {
    throw new ErrorHandler("Email is required. ", 400);
  }

  if (!name?.length) {
    throw new ErrorHandler("Name is required. ", 400);
  }

  if (!avatar?.length) {
    throw new ErrorHandler("Avatar is required. ", 400);
  }
  const user: any = await User.findOne({ email });

  let response;

  if (!user) {
    const newUser: any = await User.create({
      email,
      name,
      avatar,
      isThirdPartyAccount: true,
    });

    response = saveTokensAndSignIn(newUser, res);
  } else {
    const accessToken = await user.signAccessToken();
    const refreshToken = await user.signRefreshToken();

    await redis.set(user?._id, JSON.stringify(user));

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    response = saveTokensAndSignIn(user, res);
  }

  return response;
};

export {
  generateNewAccessTokenService,
  registratingUserService,
  signInUserService,
  thirdPartyAuthSignInService,
  verifyAndCreateUserService,
};
