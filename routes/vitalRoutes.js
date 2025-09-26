import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  createVitalRecord,
  getMyVitals,
  getAllVitals,
} from "../controllers/vitalsController.js";

const router = express.Router();

// Ingest new vital
router.post("/", isAuthenticated, createVitalRecord);

// Get my vitals (optionally filter by type)
router.get("/me", isAuthenticated, getMyVitals);

// Admin only
router.get("/all", isAuthenticated, authorizeRoles("Admin"), getAllVitals);

export default router;
