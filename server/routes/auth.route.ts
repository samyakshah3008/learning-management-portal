import { Router } from "express";
import {
  generateNewAccessToken,
  registratingUser,
  signInUser,
  signOutUser,
  thirdPartyAuthSignIn,
  verifyAndCreateUser,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/signup", registratingUser);
router.post("/signup/verify-code", verifyAndCreateUser);
router.post("/signin", signInUser);
router.get("/signout", isAuthenticated, signOutUser);
router.get("/refresh-access-token", generateNewAccessToken);
router.post("/third-party-signin", thirdPartyAuthSignIn);

export default router;
