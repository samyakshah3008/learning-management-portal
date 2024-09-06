import dotenv from "dotenv";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";
import { ITokenOptions } from "../types/jwt.types";
import { IActivationToken } from "../types/user.types";

dotenv.config({
  path: ".env",
});

export const accessTokenExpiry = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY! || "300",
  10
);
export const refreshTokenExpiry = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY! || "1200",
  10
);

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpiry * 1000 * 60 * 60 * 24),
  maxAge: accessTokenExpiry * 1000 * 60 * 60 * 24,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpiry * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpiry * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const saveTokensAndSignIn = (user: any, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  redis.set(user._id, JSON.stringify(user));

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return { success: true, user, accessToken };
};

const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET!,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

export { createActivationToken, saveTokensAndSignIn };
