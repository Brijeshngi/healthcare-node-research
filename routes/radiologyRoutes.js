import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  createRadiologyResult,
  getAllRadiologyResults,
  getMyRadiologyResults,
  getRadiologyById,
} from "../controllers/radiologyController.js";

const router = express.Router();

// Upload new study
router.post("/", isAuthenticated, createRadiologyResult);

// Patient
router.get("/me", isAuthenticated, getMyRadiologyResults);

// Admin
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles("Admin"),
  getAllRadiologyResults
);

// Single study
router.get("/:id", isAuthenticated, getRadiologyById);

export default router;
