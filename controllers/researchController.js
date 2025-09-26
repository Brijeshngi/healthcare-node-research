import { LabResult } from "../models/LabResult.js";
import { RadiologyResult } from "../models/RadiologyResult.js";
import { VitalRecord } from "../models/VitalRecord.js";
import { GenomicsResult } from "../models/GenomicsResult.js";
import { anonymizeRecord, uploadToS3 } from "../services/researchService.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

// 🔹 Export all modalities for research
export const exportResearchData = catchAsyncError(async (req, res, next) => {
  const { modality } = req.query; // labs, radiology, vitals, genomics, all

  const bucket = process.env.S3_RESEARCH_BUCKET;
  const results = {};

  if (modality === "labs" || modality === "all") {
    const labs = await LabResult.find({ consentForResearch: true });
    results.labs = labs.map(anonymizeRecord);
    await uploadToS3(bucket, `labs/${Date.now()}.json`, results.labs);
  }

  if (modality === "radiology" || modality === "all") {
    const rads = await RadiologyResult.find({ consentForResearch: true });
    results.radiology = rads.map(anonymizeRecord);
    await uploadToS3(bucket, `radiology/${Date.now()}.json`, results.radiology);
  }

  if (modality === "vitals" || modality === "all") {
    const vitals = await VitalRecord.find({ consentForResearch: true });
    results.vitals = vitals.map(anonymizeRecord);
    await uploadToS3(bucket, `vitals/${Date.now()}.json`, results.vitals);
  }

  if (modality === "genomics" || modality === "all") {
    const genomics = await GenomicsResult.find({ consentForResearch: true });
    results.genomics = genomics.map(anonymizeRecord);
    await uploadToS3(bucket, `genomics/${Date.now()}.json`, results.genomics);
  }

  res.status(200).json({
    success: true,
    message: "Research data exported successfully",
    exported: Object.keys(results),
  });
});
