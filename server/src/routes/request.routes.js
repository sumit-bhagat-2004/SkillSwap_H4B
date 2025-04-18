import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import { requireAuth } from "@clerk/express";
import {
  getPendingRequests,
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
router.get(
  "/get-requests",
  clerkAuthMiddleware,
  requireAuth(),
  getPendingRequests
);

export default router;
