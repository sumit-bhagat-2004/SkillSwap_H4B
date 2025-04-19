import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import { requireAuth } from "@clerk/express";
import { getMyExchanges } from "../controllers/exchange.controller.js";

const router = express.Router();

router.get("/my-exchanges", clerkAuthMiddleware, requireAuth(), getMyExchanges);

export default router;
