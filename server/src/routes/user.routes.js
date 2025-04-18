import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import {
  onboardUser,
  saveAuthenticatedUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/save", clerkAuthMiddleware, saveAuthenticatedUser);
router.put(
  "/onboard-user",
  clerkAuthMiddleware,
  requireAuth(),
  upload.array("certificates"),
  onboardUser
);

export default router;
