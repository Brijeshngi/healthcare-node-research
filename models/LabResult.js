import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema(
  {
    // 1️⃣ Identification & Context
    resultId: { type: String, unique: true }, // accession or GUID
    panelId: { type: String }, // links to panel/group if part of multi-analyte
    testCategory: {
      type: String,
      enum: [
        "chemistry",
        "hematology",
        "microbiology",
        "immunology",
        "pathology",
        "molecular",
        "toxicology",
        "endocrinology",
        "oncology",
        "urine",
        "stool",
        "genomics",
        "others",
      ],
    },
    status: {
      type: String,
      enum: ["registered", "preliminary", "final", "amended", "canceled"],
      default: "registered",
    },
    encounterId: { type: String }, // optional link to visit/encounter

    // 2️⃣ Patient & Privacy
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consentForResearch: { type: Boolean, default: false },
    anonymizationLevel: {
      type: String,
      enum: ["identified", "pseudonymized", "anonymized"],
      default: "identified",
    },

    // 3️⃣ Test Identification
    testCode: { type: String }, // LOINC / CPT / local
    testCodeSystem: { type: String, default: "LOINC" },
    testName: { type: String }, // human-readable
    panelCode: { type: String }, // if it's a known panel (e.g. LOINC panel code)
    method: { type: String }, // e.g., PCR, ELISA, HPLC
    device: { type: String }, // analyzer/sequencer details
    laboratory: {
      name: String,
      address: String,
      accreditation: String,
    },

    // 4️⃣ Specimen Information
    specimen: {
      specimenId: String,
      type: String, // SNOMED-coded specimen type
      site: String, // e.g., liver, skin biopsy
      collectionDate: Date,
      collectedBy: String,
      collectionMethod: String,
      condition: String, // hemolyzed, fasting, etc.
    },

    // 5️⃣ Result Values (Polymorphic)
    valueNumeric: Number,
    valueText: String,
    valueCoded: {
      code: String,
      system: String, // SNOMED, local
      display: String,
    },
    valueAttachment: {
      url: String,
      type: String, // MIME type (e.g., application/pdf, text/vcf)
    },
    unit: { type: String }, // UCUM unit
    referenceRange: {
      low: Number,
      high: Number,
      unit: String,
      ageGroup: String,
      gender: String,
      text: String,
    },
    interpretation: {
      code: String, // e.g., H, L, N, POS
      system: String, // HL7/SNOMED
      display: String,
    },
    comments: String,

    // 6️⃣ Special Extensions
    microbiology: {
      organismDetected: String,
      sensitivity: [{ antibiotic: String, result: String }],
    },
    pathology: {
      histopathologyFindings: String,
      stageGrade: String,
    },
    molecular: {
      gene: String,
      mutation: String,
      variantType: String, // benign, pathogenic, VUS
    },
    isPanelContainer: { type: Boolean, default: false },

    // 7️⃣ Reporting & Audit
    observationTime: Date, // clinically relevant time
    reportTime: { type: Date, default: Date.now },
    performer: { name: String, id: String },
    sourceSystem: String,
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const LabResult = mongoose.model("LabResult", labResultSchema);
