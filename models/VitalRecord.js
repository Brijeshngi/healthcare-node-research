import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Device info
    source: {
      type: String,
      enum: ["ICU", "Smartwatch", "BP Cuff", "Glucometer", "Wearable", "Other"],
      default: "Other",
    },
    deviceId: { type: String },
    deviceType: { type: String }, // Apple Watch, Fitbit, Philips ICU Monitor, etc.

    // Vital type
    vitalType: {
      type: String,
      enum: [
        "ECG",
        "HeartRate",
        "BloodPressure",
        "SpO2",
        "RespiratoryRate",
        "Temperature",
        "Steps",
        "Sleep",
        "Calories",
        "Glucose",
      ],
      required: true,
    },

    // Data values
    valueNumeric: Number,
    valueText: String,
    unit: String,

    // For BloodPressure specifically
    systolic: Number,
    diastolic: Number,

    // Context
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["normal", "abnormal", "critical"],
      default: "normal",
    },

    // Alerts/Advice
    advice: String,
  },
  { timestamps: true }
);

// Create Time-Series Index
vitalSchema.index({ patient: 1, vitalType: 1, timestamp: 1 });

export const VitalRecord = mongoose.model("VitalRecord", vitalSchema);
