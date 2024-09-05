import dotenv from "dotenv";
import { Response } from "express";
import { redis } from "../lib/redis";

dotenv.config({
  path: ".env",
});

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const saveTokensAndSignIn = (user: any, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  redis.set(user._id, JSON.stringify(user));

  const accessTokenExpiry = parseInt(
    process.env.ACCESS_TOKEN_EXPIRY! || "300",
    10
  );
  const refreshTokenExpiry = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY! || "1200",
    10
  );

  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpiry * 10000),
    maxAge: accessTokenExpiry * 10000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpiry * 10000),
    maxAge: refreshTokenExpiry * 10000,
    httpOnly: true,
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({ success: true, user, accessToken });
};

export { saveTokensAndSignIn };
