import { VitalRecord } from "../models/VitalRecord.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import { generateVitalsAdvice } from "../services/vitalsAdviceEngine.js";

// Ingest new vital record
export const createVitalRecord = catchAsyncError(async (req, res, next) => {
  const {
    vitalType,
    valueNumeric,
    valueText,
    unit,
    systolic,
    diastolic,
    deviceId,
    deviceType,
    source,
  } = req.body;

  if (!vitalType) return next(new ErrorHandle("Vital type is required", 400));

  const advice = generateVitalsAdvice(
    vitalType,
    valueNumeric,
    systolic,
    diastolic
  );

  const vital = await VitalRecord.create({
    patient: req.user._id,
    vitalType,
    valueNumeric,
    valueText,
    unit,
    systolic,
    diastolic,
    deviceId,
    deviceType,
    source,
    advice,
  });

  res.status(201).json({ success: true, vital });
});

// Get my vitals (time-series)
export const getMyVitals = catchAsyncError(async (req, res, next) => {
  const { vitalType } = req.query;
  const filter = { patient: req.user._id };
  if (vitalType) filter.vitalType = vitalType;

  const vitals = await VitalRecord.find(filter)
    .sort({ timestamp: -1 })
    .limit(1000);
  res.status(200).json({ success: true, count: vitals.length, vitals });
});

// Admin: get all patients vitals
export const getAllVitals = catchAsyncError(async (req, res, next) => {
  const results = await VitalRecord.find().populate(
    "patient",
    "FirstName LastName Email"
  );
  res.status(200).json({ success: true, results });
});
