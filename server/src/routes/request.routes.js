import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import { requireAuth } from "@clerk/express";
import {
  respondRequest,
  sendRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/send", clerkAuthMiddleware, requireAuth(), sendRequest);
router.put(
  "/respond/:requestId",
  clerkAuthMiddleware,
  requireAuth(),
  respondRequest
);

export default router;
