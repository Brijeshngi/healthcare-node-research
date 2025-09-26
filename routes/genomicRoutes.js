import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  createGenomicsResult,
  getMyGenomicsResults,
  getAllGenomicsResults,
  getGenomicsById,
} from "../controllers/genomicsController.js";

const router = express.Router();

// Upload new genomic result
router.post("/", isAuthenticated, createGenomicsResult);

// Patient
router.get("/me", isAuthenticated, getMyGenomicsResults);

// Admin
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles("Admin"),
  getAllGenomicsResults
);

// Single result
router.get("/:id", isAuthenticated, getGenomicsById);

export default router;
