import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import {
  getUserDetails,
  onboardUser,
  saveAuthenticatedUser,
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

export default router;
