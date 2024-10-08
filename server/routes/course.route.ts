import { Router } from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  fetchAllCourses,
  getAllCourses,
  getCourseByBuyer,
  getParticularCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/get-course/:id", getParticularCourse);
router.get("/get-courses", getAllCourses);
router.get("/get-course-content/:id", isAuthenticated, getCourseByBuyer);
router.get(
  "/admin/get-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchAllCourses
);

router.post(
  "/upload-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

router.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
router.put("/add-question", isAuthenticated, addQuestion);
router.put("/add-answer", isAuthenticated, addAnswer);
router.put("/add-review/:id", isAuthenticated, addReview);
router.put(
  "/add-review-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

router.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default router;
