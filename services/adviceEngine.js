export const generateAdvice = (
  testName,
  valueNumeric,
  valueCoded,
  referenceRange
) => {
  const tn = testName.toLowerCase();

  // Simple numeric rule-based logic
  if (tn.includes("glucose") || tn.includes("blood sugar")) {
    if (valueNumeric > 200)
      return "⚠️ High risk of diabetes. Consult a doctor.";
    if (valueNumeric < 70)
      return "⚠️ Hypoglycemia risk. Immediate attention needed.";
    return "✅ Blood sugar is within normal range.";
  }

  if (tn.includes("cholesterol")) {
    if (valueNumeric > 240)
      return "⚠️ High cholesterol. Consider medication & diet.";
    if (valueNumeric >= 200)
      return "⚠️ Borderline cholesterol. Improve diet/exercise.";
    return "✅ Cholesterol levels are normal.";
  }

  if (tn.includes("hemoglobin")) {
    if (valueNumeric < 12)
      return "⚠️ Possible anemia. Consider iron-rich diet or evaluation.";
    if (valueNumeric > 18)
      return "⚠️ High hemoglobin. Check for dehydration or underlying condition.";
    return "✅ Hemoglobin is within normal range.";
  }

  // Use reference ranges if present
  if (
    referenceRange?.low &&
    referenceRange?.high &&
    valueNumeric !== undefined
  ) {
    if (valueNumeric < referenceRange.low) return "⚠️ Below normal range.";
    if (valueNumeric > referenceRange.high) return "⚠️ Above normal range.";
  }

  // For coded results
  if (valueCoded?.display) {
    if (valueCoded.display.toLowerCase() === "positive")
      return "⚠️ Positive result. Follow-up required.";
    if (valueCoded.display.toLowerCase() === "negative")
      return "✅ Negative result.";
  }

  return "ℹ️ No specific advice available. Please consult your doctor.";
};
