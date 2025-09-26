import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createLabResult,
  getAllLabResults,
  getMyLabResults,
  getLabResultById,
  createPanel,
  getPanelWithResults,
} from "../controllers/labController.js";

const router = express.Router();

// Create result
router.post("/", isAuthenticated, createLabResult);

// Get my results
router.get("/me", isAuthenticated, getMyLabResults);

// Admin: get all results
router.get("/all", isAuthenticated, getAllLabResults);

// Get by ID
router.get("/:id", isAuthenticated, getLabResultById);

// Create panel with children
router.post("/panel", isAuthenticated, createPanel);

// Get panel and all results inside
router.get("/panel/:id", isAuthenticated, getPanelWithResults);
export default router;
