import { LabResult } from "../models/LabResult.js";
import { RadiologyResult } from "../models/RadiologyResult.js";
import { VitalRecord } from "../models/VitalRecord.js";
import { GenomicsResult } from "../models/GenomicsResult.js";
import { anonymizeRecord } from "../services/researchService.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

// 🔹 Unified Research Query API
export const runResearchQuery = catchAsyncError(async (req, res, next) => {
  const { labs, radiology, vitals, genomics } = req.body; // JSON filter criteria

  let results = {};

  // Labs
  if (labs) {
    const labResults = await LabResult.find({
      consentForResearch: true,
      ...labs, // e.g., { "testName": "Hemoglobin", "status": "abnormal" }
    });
    results.labs = labResults.map(anonymizeRecord);
  }

  // Radiology
  if (radiology) {
    const radResults = await RadiologyResult.find({
      consentForResearch: true,
      ...radiology, // e.g., { "impression": /pneumonia/i }
    });
    results.radiology = radResults.map(anonymizeRecord);
  }

  // Vitals
  if (vitals) {
    const vitalResults = await VitalRecord.find({
      consentForResearch: true,
      ...vitals, // e.g., { "vitalType": "BloodPressure", "systolic": { $gt: 140 } }
    });
    results.vitals = vitalResults.map(anonymizeRecord);
  }

  // Genomics
  if (genomics) {
    const genoResults = await GenomicsResult.find({
      consentForResearch: true,
      ...genomics, // e.g., { "variants.gene": "BRCA1", "variants.variantType": "pathogenic" }
    });
    results.genomics = genoResults.map(anonymizeRecord);
  }

  res.status(200).json({
    success: true,
    message: "Research query executed",
    results,
  });
});
