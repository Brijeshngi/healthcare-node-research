export const generateGenomicsAdvice = (variants) => {
  let adviceList = [];

  for (const v of variants) {
    if (v.gene === "BRCA1" && v.variantType === "pathogenic") {
      adviceList.push(
        "⚠️ BRCA1 pathogenic mutation detected. Increased breast/ovarian cancer risk. Consider genetic counseling."
      );
      adviceList.push("Eligible for PARP inhibitor trials.");
    }

    if (v.gene === "TP53" && v.variantType === "pathogenic") {
      adviceList.push(
        "⚠️ TP53 mutation detected. Associated with Li-Fraumeni syndrome."
      );
    }

    if (v.variantType === "vus") {
      adviceList.push(
        "ℹ️ Variant of uncertain significance. No clear clinical action yet."
      );
    }
  }

  return adviceList.length > 0
    ? adviceList.join(" | ")
    : "✅ No actionable genetic findings detected.";
};
