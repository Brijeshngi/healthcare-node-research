import { LabResult } from "../models/LabResult.js";
import { generateAdvice } from "../services/adviceEngine.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";

// Create a lab result (single or panel member)
export const createLabResult = catchAsyncError(async (req, res, next) => {
  const {
    testName,
    testCode,
    testCodeSystem,
    valueNumeric,
    valueText,
    valueCoded,
    unit,
    referenceRange,
    specimen,
    method,
    device,
    laboratory,
    microbiology,
    pathology,
    molecular,
    panelId,
  } = req.body;

  if (!testName) return next(new ErrorHandle("Test name is required", 400));

  // Auto-generate advice
  const advice = generateAdvice(
    testName,
    valueNumeric,
    valueCoded,
    referenceRange
  );

  const labResult = await LabResult.create({
    patient: req.user._id,
    testName,
    testCode,
    testCodeSystem,
    valueNumeric,
    valueText,
    valueCoded,
    unit,
    referenceRange,
    specimen,
    method,
    device,
    laboratory,
    microbiology,
    pathology,
    molecular,
    panelId,
    advice,
    status: "final",
  });

  res.status(201).json({
    success: true,
    message: "Lab result created successfully",
    labResult,
  });
});

// Get all lab results (Admin only)
export const getAllLabResults = catchAsyncError(async (req, res, next) => {
  const results = await LabResult.find().populate(
    "patient",
    "FirstName LastName Email"
  );
  res.status(200).json({ success: true, count: results.length, results });
});

// Get my lab results (Patient)
export const getMyLabResults = catchAsyncError(async (req, res, next) => {
  const results = await LabResult.find({ patient: req.user._id });
  res.status(200).json({ success: true, count: results.length, results });
});

// Get single lab result by ID
export const getLabResultById = catchAsyncError(async (req, res, next) => {
  const result = await LabResult.findById(req.params.id).populate(
    "patient",
    "FirstName LastName Email"
  );
  if (!result) return next(new ErrorHandle("Lab result not found", 404));

  res.status(200).json({ success: true, result });
});

// Create a Panel (with optional child tests in one request)
export const createPanel = catchAsyncError(async (req, res, next) => {
  const { panelName, panelCode, tests } = req.body;

  if (!panelName) return next(new ErrorHandle("Panel name is required", 400));

  // 1. Create Panel Container
  const panel = await LabResult.create({
    patient: req.user._id,
    testName: panelName,
    testCode: panelCode,
    isPanelContainer: true,
    status: "final",
  });

  let children = [];

  // 2. If child tests provided → create them
  if (tests && tests.length > 0) {
    for (const t of tests) {
      const advice = generateAdvice(
        t.testName,
        t.valueNumeric,
        t.valueCoded,
        t.referenceRange
      );

      const child = await LabResult.create({
        patient: req.user._id,
        panelId: panel._id,
        testName: t.testName,
        testCode: t.testCode,
        testCodeSystem: t.testCodeSystem,
        valueNumeric: t.valueNumeric,
        valueText: t.valueText,
        valueCoded: t.valueCoded,
        unit: t.unit,
        referenceRange: t.referenceRange,
        specimen: t.specimen,
        method: t.method,
        device: t.device,
        laboratory: t.laboratory,
        microbiology: t.microbiology,
        pathology: t.pathology,
        molecular: t.molecular,
        advice,
        status: "final",
      });

      children.push(child);
    }
  }

  res.status(201).json({
    success: true,
    message: "Panel created successfully",
    panel,
    children,
  });
});

// Fetch a panel and its child tests
export const getPanelWithResults = catchAsyncError(async (req, res, next) => {
  const panel = await LabResult.findById(req.params.id);
  if (!panel || !panel.isPanelContainer) {
    return next(new ErrorHandle("Panel not found", 404));
  }

  const children = await LabResult.find({ panelId: panel._id });
  res.status(200).json({ success: true, panel, children });
});
