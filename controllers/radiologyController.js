import { RadiologyResult } from "../models/RadiologyResult.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import { analyzeRadiologyImage } from "../services/aiRadiologyService.js";
// Upload a new radiology study with AI detection
export const createRadiologyResult = catchAsyncError(async (req, res, next) => {
  const { studyType, modality, bodyPart, impression, notes } = req.body;

  if (!studyType) return next(new ErrorHandle("Study type is required", 400));

  const files = [];
  if (req.files) {
    for (const file of req.files) {
      files.push({ url: file.location, type: file.mimetype });
    }
  }

  // 🔹 Run AI anomaly detection (stub/mock for now)
  const aiFindings = await analyzeRadiologyImage(files, studyType, bodyPart);

  const radiology = await RadiologyResult.create({
    patient: req.user._id,
    studyType,
    modality,
    bodyPart,
    dicomFiles: files,
    impression,
    notes,
    aiFindings,
    status: "final",
  });

  res.status(201).json({
    success: true,
    message: "Radiology study uploaded successfully (AI analyzed)",
    radiology,
  });
});

// Get all radiology results (Admin)
export const getAllRadiologyResults = catchAsyncError(
  async (req, res, next) => {
    const results = await RadiologyResult.find().populate(
      "patient",
      "FirstName LastName Email"
    );
    res.status(200).json({ success: true, results });
  }
);

// Get my radiology results
export const getMyRadiologyResults = catchAsyncError(async (req, res, next) => {
  const results = await RadiologyResult.find({ patient: req.user._id });
  res.status(200).json({ success: true, results });
});

// Get single study
export const getRadiologyById = catchAsyncError(async (req, res, next) => {
  const study = await RadiologyResult.findById(req.params.id).populate(
    "patient",
    "FirstName LastName Email"
  );
  if (!study) return next(new ErrorHandle("Radiology study not found", 404));

  res.status(200).json({ success: true, study });
});
