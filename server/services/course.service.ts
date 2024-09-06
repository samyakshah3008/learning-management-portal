import cloudinary from "cloudinary";
import { Request } from "express";
import { Course } from "../models/course.model";

const uploadCourseService = async (data: any) => {
  const thumbnail = data?.thumbnail;
  if (thumbnail) {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    data.thumbnail = {
      public_id: myCloud?.public_id,
      url: myCloud.secure_url,
    };
  } else {
    // throw new ErrorHandler("Thumbnail is required", 400);
  }
  const course = await Course.create(data);
  return { success: true, course };
};

const createCourseService = async (data: any) => {
  const course = await Course.create(data);
  return { success: true, course };
};

const editCourseService = async (data: any, req: Request) => {
  const thumbnail = data?.thumbnail;

  if (thumbnail) {
    await cloudinary.v2.uploader.destroy(thumbnail?.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    data.thumbnail = {
      public_id: myCloud?.public_id,
      url: myCloud.secure_url,
    };
  }

  const courseId = req.params?.id;
  const course = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: data,
    },
    { new: true }
  );

  return course;
};

export { createCourseService, editCourseService, uploadCourseService };
