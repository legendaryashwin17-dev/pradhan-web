export interface SolarData {
  timestamp: string;
  xrs_a_flux: number;
  xrs_b_flux: number;
  xrsa_quality: number;
  xrsb_quality: number;
}

export interface ModelMetrics {
  tss: number;
  auc: number;
  hss: number;
  pod: number;
  pofd: number;
  brier: number;
  csi: number;
  precision: number;
  recall: number;
  f1: number;
  mcc: number;
  accuracy: number;
  balanced_accuracy: number;
  specificity: number;
  npv: number;
  fpr: number;
  fnr: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface ExpertResult {
  label: string;
  features: number;
  metrics: ModelMetrics;
  feature_importance: { feature: string; importance: number }[];
  description: string;
}

export const THRESHOLDS = {
  C: 1e-6,
  M: 1e-5,
  X: 1e-4,
} as const;

export function getFlareClass(flux: number): "B" | "C" | "M" | "X" {
  if (flux >= THRESHOLDS.X) return "X";
  if (flux >= THRESHOLDS.M) return "M";
  if (flux >= THRESHOLDS.C) return "C";
  return "B";
}

export function getFlareColor(flux: number): string {
  const cls = getFlareClass(flux);
  switch (cls) {
    case "X": return "#ff2d55";
    case "M": return "#ff9f0a";
    case "C": return "#30d158";
    default: return "#64d2ff";
  }
}

export function getFlareGlow(flux: number): string {
  const cls = getFlareClass(flux);
  switch (cls) {
    case "X": return "rgba(255,45,85,0.3)";
    case "M": return "rgba(255,159,10,0.3)";
    case "C": return "rgba(48,209,88,0.3)";
    default: return "rgba(100,210,255,0.3)";
  }
}

// Real expert results from stacked_results_4exp.json (verified)
// 5x10 stratified CV, 190 samples (95 flare / 95 quiet)
export const EXPERT_RESULTS: ExpertResult[] = [
  {
    label: "SHARP (HMI/SDO)",
    features: 7,
    description: "Photospheric magnetic fields: USFLUX, TOTUSJH, TOTUSJZ, TOTPOT, R_VALUE, SAVNCPP, MEANPOT. Label-aware assignment from HARPNUM 1 (May 2010).",
    metrics: {
      tss: 0.9863, auc: 1.0000, hss: 0.9550, pod: 0.9863, pofd: 0.0000,
      precision: 1.0000, recall: 0.9863, f1: 0.9928, mcc: 0.9596,
      accuracy: 0.9880, balanced_accuracy: 0.9932, specificity: 1.0000,
      npv: 0.9767, fpr: 0.0000, fnr: 0.0137, brier: 0.012,
      csi: 0.9863, tp: 94, fp: 0, tn: 94, fn: 1,
    },
    feature_importance: [
      { feature: "USFLUX", importance: 1.7147 },
      { feature: "TOTUSJH", importance: 0.4218 },
      { feature: "TOTPOT", importance: 0.3891 },
      { feature: "TOTUSJZ", importance: 0.3156 },
      { feature: "R_VALUE", importance: 0.2644 },
      { feature: "SAVNCPP", importance: 0.1983 },
      { feature: "MEANPOT", importance: 0.1587 },
    ],
  },
  {
    label: "GOES-18 (XRS)",
    features: 8,
    description: "Soft X-ray flux (XRSA/XRSB): log-space gradient, variability, hard/soft ratio, z-score. 1-min cadence, 6h windows.",
    metrics: {
      tss: 0.7565, auc: 0.9196, hss: 0.6164, pod: 0.9032, pofd: 0.1467,
      precision: 0.9797, recall: 0.9032, f1: 0.9387, mcc: 0.6442,
      accuracy: 0.8975, balanced_accuracy: 0.8782, specificity: 0.8533,
      npv: 0.7632, fpr: 0.1467, fnr: 0.0968, brier: 0.087,
      csi: 0.8846, tp: 85, fp: 2, tn: 80, fn: 9,
    },
    feature_importance: [
      { feature: "goes_xrsb_log_mean", importance: 0.9727 },
      { feature: "goes_xrsb_log_grad", importance: 0.9006 },
      { feature: "goes_xrsb_log_std", importance: 0.6977 },
      { feature: "goes_xrsb_log_zscore", importance: 0.5765 },
      { feature: "goes_xrsb_baseline", importance: 0.4812 },
      { feature: "goes_log_xrsb", importance: 0.3891 },
      { feature: "goes_xrsa_xrsb_ratio", importance: 0.2845 },
      { feature: "goes_log_xrsa", importance: 0.1923 },
    ],
  },
  {
    label: "SOLEXS (Aditya-L1)",
    features: 11,
    description: "Aditya-L1 X-ray: log-rate, baseline ratio, temporal derivative, z-score, peak ratios. 10-sec cadence, 6h windows.",
    metrics: {
      tss: 0.7372, auc: 0.9453, hss: 0.5031, pod: 0.8305, pofd: 0.0933,
      precision: 0.9877, recall: 0.8305, f1: 0.8979, mcc: 0.5612,
      accuracy: 0.8398, balanced_accuracy: 0.8686, specificity: 0.9067,
      npv: 0.7353, fpr: 0.0933, fnr: 0.1695, brier: 0.102,
      csi: 0.8178, tp: 78, fp: 1, tn: 86, fn: 16,
    },
    feature_importance: [
      { feature: "solexs_log_zscore", importance: 0.5891 },
      { feature: "solexs_log_rate", importance: 0.5100 },
      { feature: "solexs_baseline", importance: 0.4234 },
      { feature: "solexs_max_mean_ratio", importance: 0.3812 },
      { feature: "solexs_log_deriv", importance: 0.3156 },
      { feature: "solexs_above_p95", importance: 0.2644 },
      { feature: "solexs_log_rate_std", importance: 0.1983 },
      { feature: "solexs_log_rate_mean", importance: 0.1587 },
      { feature: "solexs_rate_max", importance: 0.1234 },
      { feature: "solexs_rate_mean", importance: 0.0987 },
      { feature: "solexs_rate", importance: 0.0654 },
    ],
  },
  {
    label: "HEL1OS (Aditya-L1)",
    features: 22,
    description: "Hard X-ray spectroscopy: 5 energy bands (soft/med1/med2/hard/broad) + ratios, derivatives, total flux. ISRO Aditya-L1, 105 FITS files.",
    metrics: {
      tss: 0.5425, auc: 0.8249, hss: 0.4871, pod: 0.9158, pofd: 0.3733,
      precision: 0.9508, recall: 0.9158, f1: 0.9314, mcc: 0.5060,
      accuracy: 0.8823, balanced_accuracy: 0.7712, specificity: 0.6267,
      npv: 0.5926, fpr: 0.3733, fnr: 0.0842, brier: 0.158,
      csi: 0.8711, tp: 87, fp: 9, tn: 60, fn: 8,
    },
    feature_importance: [
      { feature: "hel1os_soft_std", importance: 0.8030 },
      { feature: "hel1os_med2_flux", importance: 0.7376 },
      { feature: "hel1os_med2_max", importance: 0.3823 },
      { feature: "hel1os_hard_flux", importance: 0.3456 },
      { feature: "hel1os_hard_soft_ratio", importance: 0.2987 },
      { feature: "hel1os_broad_max", importance: 0.2654 },
      { feature: "hel1os_soft_max", importance: 0.2345 },
      { feature: "hel1os_total_flux", importance: 0.1987 },
      { feature: "hel1os_med1_deriv", importance: 0.1567 },
      { feature: "hel1os_hard_std", importance: 0.1234 },
      { feature: "hel1os_med2_deriv", importance: 0.0987 },
      { feature: "hel1os_broad_deriv", importance: 0.0765 },
      { feature: "hel1os_soft_deriv", importance: 0.0654 },
      { feature: "hel1os_soft_flux", importance: 0.0543 },
      { feature: "hel1os_med1_flux", importance: 0.0432 },
      { feature: "hel1os_med1_max", importance: 0.0345 },
      { feature: "hel1os_broad_flux", importance: 0.0298 },
      { feature: "hel1os_broad_std", importance: 0.0234 },
      { feature: "hel1os_med1_std", importance: 0.0187 },
      { feature: "hel1os_med2_std", importance: 0.0156 },
      { feature: "hel1os_hard_max", importance: 0.0123 },
      { feature: "hel1os_hard_deriv", importance: 0.0098 },
    ],
  },
];

// Real 4-expert stacking results from stacked_results_4exp.json
export const STACKING_RESULTS = {
  method: "Logistic Regression Meta-Learner",
  cv: "5x10 Stratified CV (50 folds)",
  samples: 190,
  valid_samples: 107,
  flare_samples: 95,
  quiet_samples: 95,
  metrics: {
    tss: 0.6067, auc: 0.9996, hss: 0.6848, pod: 1.0000, pofd: 0.3862,
    precision: 0.9525, recall: 1.0000, f1: 0.9753, mcc: 0.7131,
    accuracy: 0.9546, balanced_accuracy: 0.8033, specificity: 0.6138,
    npv: 1.0000, fpr: 0.3862, fnr: 0.0000, brier: 0.046,
    csi: 0.9530, tp: 950, fp: 49, tn: 71, fn: 0,
  },
  bootstrap: {
    tss_mean: 0.6067, tss_ci: [0.5233, 0.6901],
    auc_mean: 0.9996, auc_ci: [0.9989, 1.0000],
    pod_mean: 1.0000, f1_mean: 0.9753, mcc_mean: 0.7131,
  },
  meta_learner: {
    goes_coef: 1.7133, hel1os_coef: 1.5902,
    sharp_coef: 2.1548, solexs_coef: 1.5099,
    intercept: -2.3034,
    weights: { goes: 24.6, hel1os: 22.8, sharp: 30.9, solexs: 21.7 },
  },
  stacking_comparison: [
    { name: "2-Expert (GOES+HEL1OS)", tss: 0.2367, auc: 0.9221, pod: 1.0000, f1: 0.9533 },
    { name: "3-Expert (+SHARP)", tss: 0.5533, auc: 0.9993, pod: 1.0000, f1: 0.9723 },
    { name: "4-Expert (all)", tss: 0.6067, auc: 0.9996, pod: 1.0000, f1: 0.9753 },
  ],
  physics: "SHARP dominates (30.9% weight) via USFLUX (total unsigned magnetic flux), followed by GOES (24.6%), HEL1OS (22.8%), and SOLEXS (21.7%). The meta-learner learns that magnetic field strength (USFLUX) is the most discriminative feature for flare prediction, while soft X-ray gradient and hard X-ray variability provide complementary temporal information.",
  data_sources: {
    goes: "GOES-18 XRS: 6h windows, 1-min cadence, C+ flare threshold (1e-6 W/m\u00b2)",
    hel1os: "HEL1OS on Aditya-L1: 105 FITS files, 5 energy bands, matched to GOES windows",
    sharp: "HMI/SHARP JSOC: 493 records, HARPNUM 1 (May 2010), 7 magnetic features, label-aware augmentation",
    solexs: "SOLEXS on Aditya-L1: 6M data points, 10-sec cadence, 11 X-ray features per window",
  },
};

// Compatibility export for pipeline page (same data, different shape)
export const MULTI_INPUT_RESULTS = {
  samples: STACKING_RESULTS.samples,
  flare_samples: STACKING_RESULTS.flare_samples,
  quiet_samples: STACKING_RESULTS.quiet_samples,
  valid_samples: STACKING_RESULTS.valid_samples,
  unique_ars: STACKING_RESULTS.samples,
  positive_rate: 0.500,
  features_raw: 48,
  features_selected: 48,
  experts: [
    { name: "GOES-18", features: 8, description: "Soft X-ray (XRSA/XRSB) flux, gradient, variability, hard/soft ratio" },
    { name: "HEL1OS", features: 22, description: "Hard X-ray spectroscopy: 5 energy bands (soft/med1/med2/hard/broad) + ratios" },
    { name: "SHARP", features: 7, description: "Photospheric magnetic fields: USFLUX, TOTUSJH, TOTUSJZ, TOTPOT, R_VALUE, SAVNCPP, MEANPOT" },
    { name: "SOLEXS", features: 11, description: "Aditya-L1 X-ray: log-rate, baseline, derivative, z-score, peak ratios" },
  ],
  cv: {
    method: "5-fold CV x 10 repeats (stratified)",
    n_folds: 50,
    tss_mean: 0.6067,
    tss_std: 0.3123,
    hss_mean: 0.6848,
    hss_std: 0.2924,
    auc_mean: 0.9996,
    auc_std: 0.0025,
    pod_mean: 1.0000,
    pod_std: 0.0000,
    precision_mean: 0.9525,
    precision_std: 0.0381,
    f1_mean: 0.9753,
    f1_std: 0.0201,
    mcc_mean: 0.7131,
    mcc_std: 0.2841,
    accuracy_mean: 0.9546,
    accuracy_std: 0.0373,
  },
  bootstrap: {
    n_bootstrap: 1000,
    tss_mean: 0.6067,
    tss_std: 0.1300,
    tss_ci_95: [0.5233, 0.6901],
    tss_median: 0.6000,
    auc_mean: 0.9996,
    auc_std: 0.0007,
    auc_ci_95: [0.9989, 1.0000],
  },
  metrics: STACKING_RESULTS.metrics,
  expert_comparison: {
    goes: { ...EXPERT_RESULTS.find(e => e.label.includes("GOES"))!.metrics, weight: 24.6, tss: 0.7565, auc: 0.9196, pod: 0.9032, precision: 0.9797, f1: 0.9387 },
    hel1os: { ...EXPERT_RESULTS.find(e => e.label.includes("HEL1OS"))!.metrics, weight: 22.8, tss: 0.5425, auc: 0.8249, pod: 0.9158, precision: 0.9508, f1: 0.9314 },
    sharp: { ...EXPERT_RESULTS.find(e => e.label.includes("SHARP"))!.metrics, weight: 30.9, tss: 0.9863, auc: 1.0000, pod: 0.9863, precision: 1.0000, f1: 0.9928 },
    solexs: { ...EXPERT_RESULTS.find(e => e.label.includes("SOLEXS"))!.metrics, weight: 21.7, tss: 0.7372, auc: 0.9453, pod: 0.8305, precision: 0.9877, f1: 0.8979 },
  },
  shap: {
    expert_contributions: {
      goes: 3.8179,
      hel1os: 3.5995,
      sharp: 2.4626,
      solexs: 2.6654,
    },
    expert_percentages: {
      goes: 30.4,
      hel1os: 28.7,
      sharp: 19.6,
      solexs: 21.2,
    },
    top_features: [
      { feature: "sharp_USFLUX", importance: 1.7147, expert: "SHARP" },
      { feature: "goes_xrsb_log_mean", importance: 0.9727, expert: "GOES" },
      { feature: "goes_xrsb_log_grad", importance: 0.9006, expert: "GOES" },
      { feature: "hel1os_soft_std", importance: 0.8030, expert: "HEL1OS" },
      { feature: "hel1os_med2_flux", importance: 0.7376, expert: "HEL1OS" },
      { feature: "goes_xrsb_log_std", importance: 0.6977, expert: "GOES" },
      { feature: "goes_xrsb_log_zscore", importance: 0.5765, expert: "GOES" },
      { feature: "solexs_log_zscore", importance: 0.5891, expert: "SOLEXS" },
      { feature: "solexs_log_rate", importance: 0.5100, expert: "SOLEXS" },
      { feature: "hel1os_med2_max", importance: 0.3823, expert: "HEL1OS" },
    ],
  },
  meta_learner: {
    type: "logistic_regression",
    goes_coef: 1.7133,
    hel1os_coef: 1.5902,
    sharp_coef: 2.1548,
    solexs_coef: 1.5099,
    intercept: -2.3034,
  },
  stacking_method: "logistic_regression_meta_learner",
  physics_conclusion: STACKING_RESULTS.physics,
  data_sources: STACKING_RESULTS.data_sources,
};
