import cloudinary from "cloudinary";
import { Request } from "express";
import { Layout } from "../models/layout.model";
import { ErrorHandler } from "../utils/error-handler";

const createLayoutService = async (type: string, req: Request | any) => {
  const isTypeExists = await Layout.findOne({ type });
  if (isTypeExists) {
    throw new ErrorHandler(`${type} already exits`, 400);
  }

  if (type === "Banner") {
    const { image, title, subTitle } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "layout",
    });
    const banner = {
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      title,
      subTitle,
    };
    await Layout.create(banner);
  }
  if (type === "FAQ") {
    const { faq } = req.body;
    const faqItems = await Promise.all(
      faq.map(async (item: any) => ({
        question: item?.question,
        answer: item?.answer,
      }))
    );
    await Layout.create({ type: "FAQ", faq: faqItems });
  }

  if (type === "Categories") {
    const { categories } = req.body;
    const categoryItems = await Promise.all(
      categories.map(async (item: any) => ({
        title: item?.title,
      }))
    );
    await Layout.create({ type: "Categories", categories: categoryItems });
  }

  return { success: true, message: "Layout created successfully" };
};

const editLayoutService = async (type: string, req: Request | any) => {
  if (type === "Banner") {
    const { image, title, subTitle } = req.body;
    const bannerData: any = await Layout.findOne({ type: "Banner" });
    if (bannerData) {
      await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
    }
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "layout",
    });
    const banner = {
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      title,
      subTitle,
    };
    await Layout.findByIdAndUpdate(bannerData.id, { banner });
  }
  if (type === "FAQ") {
    const { faq } = req.body;
    const faqItem = await Layout.findOne({ type: "FAQ" });
    const faqItems = await Promise.all(
      faq.map(async (item: any) => ({
        question: item?.question,
        answer: item?.answer,
      }))
    );
    await Layout.findByIdAndUpdate(faqItem?._id, {
      type: "FAQ",
      faq: faqItems,
    });
  }

  if (type === "Categories") {
    const { categories } = req.body;
    const categoriesData = await Layout.findOne({ type: "Categories" });
    const categoryItems = await Promise.all(
      categories.map(async (item: any) => ({
        title: item?.title,
      }))
    );
    await Layout.findByIdAndUpdate(categoriesData?._id, {
      type: "Categories",
      categories: categoryItems,
    });
  }

  return { success: true, message: "Layout updated successfully" };
};

const getLayoutByTypeService = async (type: string) => {
  const layout = await Layout.findOne({ type });
  return { success: true, layout };
};

export { createLayoutService, editLayoutService, getLayoutByTypeService };
