import express from "express";
import { clerkAuthMiddleware } from "../middlewares/clerkAuth.js";
import { saveAuthenticatedUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/save", clerkAuthMiddleware, saveAuthenticatedUser);

export default router;
