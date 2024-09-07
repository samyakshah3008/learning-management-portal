import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { Request, Response } from "express";

import { User } from "../models/user.model";

import { redis } from "../lib/redis";
import { ErrorHandler } from "../utils/error-handler";

dotenv.config({
  path: ".env",
});

const getUserByIdService = async (id: string, res: Response) => {
  const userJSON = await redis.get(id);
  if (userJSON) {
    const user = JSON.parse(userJSON);
    return { success: true, user };
  }

  throw new ErrorHandler(
    {
      success: false,
      message: "Failed to get user informations. Please try again later.",
    },
    500
  );
};

const updateUserInfoService = async (userId: string, name: any, email: any) => {
  const user = await User.findById(userId);

  if (email && user) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new ErrorHandler(
        "This email already exists, please try a different email.",
        400
      );
    }
    user.email = email;
  }

  if (name && user) {
    user.name = name;
  }

  await user?.save();

  await redis.set(userId, JSON.stringify(user));

  return { success: true, user };
};

const updatePasswordService = async (
  oldPassword: string,
  newPassword: string,
  user: any,
  req: Request | any
) => {
  if (!oldPassword?.length || !newPassword?.length) {
    throw new ErrorHandler("Both new and old password are required. ", 400);
  }

  if (user?.isThirdPartyAccount) {
    throw new ErrorHandler(
      "You cannot update this third party account password.",
      400
    );
  }

  if (user?.password === undefined) {
    throw new ErrorHandler("Invalid user", 400);
  }

  const isPasswordMatch = await user?.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    throw new ErrorHandler("Incorrect old password", 400);
  }

  user.password = newPassword;

  await user.save();
  await redis.set(req.user?._id, JSON.stringify(user));

  return {
    success: true,
    user,
  };
};

const updateAvatarService = async (
  userId: string,
  avatar: string,
  req: Request | any
) => {
  const user = await User.findById(userId);
  if (avatar && user) {
    if (user?.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
  }

  await user?.save();
  await redis.set(req.user?._id, JSON.stringify(user));

  return { success: true, user };
};

const fetchAllUsersService = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return { success: true, users };
};

const updateUserRoleService = async (id: string, role: string) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  return { success: true, user };
};

const deleteUserService = async (id: string) => {
  if (!id) {
    throw new ErrorHandler("User Id is required", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  await user.deleteOne({ id });
  await redis.del(id);
  return { success: true, message: "User deleted successfully. " };
};

export {
  deleteUserService,
  fetchAllUsersService,
  getUserByIdService,
  updateAvatarService,
  updatePasswordService,
  updateUserInfoService,
  updateUserRoleService,
};
