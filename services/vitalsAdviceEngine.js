export const generateVitalsAdvice = (
  vitalType,
  valueNumeric,
  systolic,
  diastolic
) => {
  switch (vitalType) {
    case "HeartRate":
      if (valueNumeric > 120)
        return "⚠️ Tachycardia detected. Possible arrhythmia.";
      if (valueNumeric < 50)
        return "⚠️ Bradycardia detected. Check cardiac function.";
      return "✅ Heart rate is normal.";

    case "BloodPressure":
      if (systolic > 140 || diastolic > 90) return "⚠️ Hypertension detected.";
      if (systolic < 90 || diastolic < 60) return "⚠️ Hypotension detected.";
      return "✅ Blood pressure is normal.";

    case "SpO2":
      if (valueNumeric < 90)
        return "⚠️ Hypoxemia risk. Immediate oxygen therapy required.";
      return "✅ Oxygen saturation is normal.";

    case "Temperature":
      if (valueNumeric > 38) return "⚠️ Fever detected. Possible infection.";
      if (valueNumeric < 35) return "⚠️ Hypothermia detected.";
      return "✅ Body temperature is normal.";

    case "Glucose":
      if (valueNumeric > 200)
        return "⚠️ Hyperglycemia risk. Monitor for diabetes.";
      if (valueNumeric < 70) return "⚠️ Hypoglycemia detected.";
      return "✅ Glucose level is normal.";

    case "Steps":
      return valueNumeric < 5000
        ? "⚠️ Low activity today. Try to walk more."
        : "✅ Good activity level.";

    default:
      return "ℹ️ No advice available.";
  }
};
