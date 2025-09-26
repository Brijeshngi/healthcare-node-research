import express from "express";
import { isAuthenticated } from "../middlewares/authMiddlewares.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  getMyProfile,
  userDashboard,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  updateProfilePicture,
} from "../controllers/userControllers.js";

const router = express.Router();

// Profile APIs
router.get("/me", isAuthenticated, getMyProfile);
router.get("/dashboard", isAuthenticated, userDashboard);
router.put("/update", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

// Profile picture upload
router.post(
  "/profile-picture",
  isAuthenticated,
  upload.single("file"), // file field in Postman must be "file"
  uploadProfilePicture
);

router.put(
  "/update-picture",
  isAuthenticated,
  upload.single("file"),
  updateProfilePicture
);

export default router;
