import mongoose from "mongoose";

const radiologySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encounterId: { type: String },

    // Study Metadata
    studyType: { type: String, required: true }, // X-Ray, CT, MRI, Ultrasound
    modality: { type: String }, // e.g., DICOM tag Modality = "CT"
    bodyPart: { type: String }, // e.g., Chest, Brain, Abdomen
    studyDate: { type: Date, default: Date.now },

    // File storage
    dicomFiles: [
      {
        url: String, // S3 URL
        type: String, // e.g., "application/dicom" or "image/jpeg"
      },
    ],
    reportFile: {
      url: String, // radiology report as PDF or text
      type: String,
    },

    // AI anomaly detection (optional)
    aiFindings: [
      {
        label: String, // e.g., "Pneumonia", "Fracture"
        confidence: Number,
      },
    ],

    // Doctor Interpretation
    impression: { type: String }, // e.g., "Left lower lobe pneumonia"
    notes: { type: String },

    // Status & Audit
    status: {
      type: String,
      enum: ["pending", "final", "amended"],
      default: "pending",
    },
    createdBy: { type: String, default: "system" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const RadiologyResult = mongoose.model(
  "RadiologyResult",
  radiologySchema
);
