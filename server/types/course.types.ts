import { IUser } from "./user.types";

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[] | any;
  suggestion: string;
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

interface IAddReplyToReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export {
  IAddAnswerData,
  IAddQuestionData,
  IAddReplyToReviewData,
  IAddReviewData,
  IComment,
  ICourse,
  ICourseData,
  ILink,
  IReview,
};
