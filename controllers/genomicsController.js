import { GenomicsResult } from "../models/GenomicsResult.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import { generateGenomicsAdvice } from "../services/genomicsAdviceEngine.js";

// Create Genomics Result
export const createGenomicsResult = catchAsyncError(async (req, res, next) => {
  const { testName, testCode, variants, laboratory } = req.body;
  if (!testName) return next(new ErrorHandle("Test name is required", 400));

  // AI/Rule-based advice
  const advice = generateGenomicsAdvice(variants || []);

  const genomics = await GenomicsResult.create({
    patient: req.user._id,
    testName,
    testCode,
    laboratory,
    variants,
    files: req.files?.map((f) => ({ url: f.location, type: f.mimetype })) || [],
    advice,
    consentForResearch: req.body.consentForResearch,
    anonymizationLevel: req.body.anonymizationLevel || "pseudonymized",
  });

  res.status(201).json({
    success: true,
    message: "Genomics result created successfully",
    genomics,
  });
});

// Get my genomics results
export const getMyGenomicsResults = catchAsyncError(async (req, res, next) => {
  const results = await GenomicsResult.find({ patient: req.user._id });
  res.status(200).json({ success: true, count: results.length, results });
});

// Admin: get all genomics results
export const getAllGenomicsResults = catchAsyncError(async (req, res, next) => {
  const results = await GenomicsResult.find().populate(
    "patient",
    "FirstName LastName Email"
  );
  res.status(200).json({ success: true, results });
});

// Get single genomics result
export const getGenomicsById = catchAsyncError(async (req, res, next) => {
  const result = await GenomicsResult.findById(req.params.id).populate(
    "patient",
    "FirstName LastName Email"
  );
  if (!result) return next(new ErrorHandle("Genomics result not found", 404));

  res.status(200).json({ success: true, result });
});
