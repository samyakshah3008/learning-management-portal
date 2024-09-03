import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import sendMail from "../lib/nodemailer";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/async-handler";
import { ErrorHandler } from "../utils/error-handler";

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET!,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

interface IRegistratingBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const registratingUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const findUserWithEmail = await User.findOne({ email });
      if (findUserWithEmail) {
        return next(
          new ErrorHandler("User with this email already exists. ", 400)
        );
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

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account. `,
          activationToken: token,
        });
      } catch (error: any) {
        console.log(error.message, "over here");
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

const verifyAndCreateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activationToken, activationCode } =
        req.body as IActivationRequest;

      const newUser: any = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET!
      );

      if (newUser.activationCode !== activationCode) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const findExistingUser = await User.findOne({ email });

      if (findExistingUser) {
        return next(
          new ErrorHandler("User already exists, please login instead", 400)
        );
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ILoginRequest {
  email: string;
  password: string;
}

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Email and password both are required. ", 400)
        );
      }

      const existingUser = await User.findOne({ email }).select("+password");

      if (!existingUser) {
        return next(
          new ErrorHandler("User not found, rather signup instead. ", 404)
        );
      }

      const isPasswordCorrect = await existingUser.comparePassword(password);
      if (!isPasswordCorrect) {
        return next(
          new ErrorHandler("Incorrect password, please try again. ", 400)
        );
      }
    } catch (error: any) {}
  }
);

export { loginUser, registratingUser, verifyAndCreateUser };
