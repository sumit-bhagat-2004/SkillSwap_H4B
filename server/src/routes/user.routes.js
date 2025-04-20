import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import {
  getMatchingUsers,
  getUserDetails,
  onboardUser,
  saveAuthenticatedUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/save", clerkAuthMiddleware, requireAuth(), saveAuthenticatedUser);
router.put(
  "/onboard-user",
  clerkAuthMiddleware,
  requireAuth(),
  upload.array("certificates"),
  onboardUser
);
router.get("/profile", clerkAuthMiddleware, requireAuth(), getUserDetails);
router.get(
  "/profile/:clerkId",
  clerkAuthMiddleware,
  requireAuth(),
  getUserDetails
);
router.get(
  "/match-users",
  clerkAuthMiddleware,
  requireAuth(),
  getMatchingUsers
);
router.put(
  "/update-profile",
  clerkAuthMiddleware,
  requireAuth(),
  upload.any(),
  updateUserProfile
);

export default router;
