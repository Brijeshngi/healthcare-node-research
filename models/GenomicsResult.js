import mongoose from "mongoose";

const genomicsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encounterId: { type: String },

    // Test Metadata
    testName: { type: String, required: true }, // e.g., BRCA1 Panel, Whole Exome Sequencing
    testCode: { type: String }, // LOINC/OMOP code if available
    laboratory: { name: String, accreditation: String },

    // File Storage (VCF/FASTQ/CSV)
    files: [
      {
        url: String, // S3 URL
        type: String, // e.g., text/vcf, application/fastq
      },
    ],

    // Variant Information (structured)
    variants: [
      {
        gene: String, // e.g., BRCA1
        mutation: String, // c.68_69delAG
        proteinImpact: String, // p.Glu23Valfs
        variantType: {
          type: String,
          enum: [
            "benign",
            "likely_benign",
            "pathogenic",
            "likely_pathogenic",
            "vus",
          ],
        },
        zygosity: { type: String, enum: ["homozygous", "heterozygous"] },
        referenceGenome: String, // GRCh37 / GRCh38
        clinicalSignificance: String, // e.g., associated cancer risk
      },
    ],

    // Trial & Research Info
    trialEligibility: [String], // e.g., ["BRCA1 targeted therapy trial", "PARP inhibitor study"]
    advice: String, // Precision medicine suggestion
    consentForResearch: { type: Boolean, default: false },
    anonymizationLevel: {
      type: String,
      enum: ["identified", "pseudonymized", "anonymized"],
      default: "identified",
    },

    // Audit
    status: { type: String, enum: ["pending", "final"], default: "final" },
    createdBy: { type: String, default: "system" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const GenomicsResult = mongoose.model("GenomicsResult", genomicsSchema);
