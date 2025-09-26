import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { runResearchQuery } from "../controllers/researchQueryController.js";

const router = express.Router();

// Research queries (Admin/Researcher only)
router.post(
  "/query",
  isAuthenticated,
  authorizeRoles("Admin", "Researcher"),
  runResearchQuery
);

export default router;
