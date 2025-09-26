import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { exportResearchData } from "../controllers/researchController.js";

const router = express.Router();

// Admin/Research role only
router.get(
  "/export",
  isAuthenticated,
  authorizeRoles("Admin", "Researcher"),
  exportResearchData
);

export default router;
