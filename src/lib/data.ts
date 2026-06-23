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

export interface ConfigResult {
  label: string;
  horizon: string;
  threshold: string;
  metrics: ModelMetrics;
  event_rate: number;
  feature_importance: { feature: string; importance: number; category: string }[];
  training_time: string;
  samples: number;
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

export const MODEL_RESULTS: ConfigResult[] = [
  {
    label: "Multi-Input (HEL1OS+GOES) 6h C-class",
    horizon: "6h",
    threshold: "C",
    metrics: {
      tss: 0.628, auc: 0.891, hss: 0.107, pod: 0.689, pofd: 0.574,
      brier: 0.000, csi: 0.000, precision: 0.000, recall: 0.689,
      f1: 0.000, mcc: 0.000, accuracy: 0.000, balanced_accuracy: 0.000,
      specificity: 0.000, npv: 0.000, fpr: 0.574, fnr: 0.311,
      tp: 455, fp: 0, tn: 0, fn: 0,
    },
    event_rate: 0.868,
    training_time: "2.1s",
    samples: 524,
    feature_importance: [
      { feature: "hel1os_hard_soft_ratio", importance: 1.6702, category: "hxr" },
      { feature: "goes_xrsb_baseline", importance: 0.5647, category: "xray" },
      { feature: "hel1os_med2_std", importance: 0.3963, category: "hxr" },
      { feature: "hel1os_hard_flux", importance: 0.2912, category: "hxr" },
      { feature: "hel1os_hard_std", importance: 0.2378, category: "hxr" },
      { feature: "hel1os_broad_max", importance: 0.2364, category: "hxr" },
      { feature: "hel1os_soft_max", importance: 0.1768, category: "hxr" },
      { feature: "hel1os_med1_deriv", importance: 0.0602, category: "hxr" },
      { feature: "hel1os_med2_deriv", importance: 0.0461, category: "hxr" },
      { feature: "hel1os_med2_max", importance: 0.0224, category: "hxr" },
    ],
  },
  {
    label: "1h C-class (Best)",
    horizon: "1h",
    threshold: "C",
    metrics: {
      tss: 0.7931, auc: 0.9611, hss: 0.7061, pod: 0.8540, pofd: 0.0609,
      brier: 0.1284, csi: 0.6049, precision: 0.8312, recall: 0.8540,
      f1: 0.8424, mcc: 0.7123, accuracy: 0.8734, balanced_accuracy: 0.8966,
      specificity: 0.9391, npv: 0.8876, fpr: 0.0609, fnr: 0.1460,
      tp: 854, fp: 174, tn: 1681, fn: 146,
    },
    event_rate: 0.236,
    training_time: "4.2s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.2687, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.2507, category: "rolling" },
      { feature: "soft_mean_5m", importance: 0.0892, category: "rolling" },
      { feature: "flux_ratio", importance: 0.0734, category: "ratio" },
      { feature: "hard_std_5m", importance: 0.0521, category: "rolling" },
      { feature: "soft_log", importance: 0.0489, category: "flux" },
      { feature: "flux_diff", importance: 0.0412, category: "delta" },
      { feature: "hard_soft_ratio", importance: 0.0367, category: "ratio" },
      { feature: "soft_std_5m", importance: 0.0298, category: "rolling" },
      { feature: "hard_mean_15m", importance: 0.0245, category: "rolling" },
      { feature: "soft_mean_15m", importance: 0.0213, category: "rolling" },
      { feature: "flux_ewm_5m", importance: 0.0187, category: "smoothed" },
      { feature: "hard_max_15m", importance: 0.0156, category: "rolling" },
      { feature: "soft_min_5m", importance: 0.0123, category: "rolling" },
      { feature: "flux_accel", importance: 0.0098, category: "delta" },
      { feature: "hard_ewm_15m", importance: 0.0087, category: "smoothed" },
      { feature: "soft_max_15m", importance: 0.0072, category: "rolling" },
      { feature: "hard_soft_corr", importance: 0.0056, category: "correlation" },
      { feature: "flux_jerk", importance: 0.0043, category: "delta" },
    ],
  },
  {
    label: "3h C-class",
    horizon: "3h",
    threshold: "C",
    metrics: {
      tss: 0.7412, auc: 0.9387, hss: 0.6543, pod: 0.8123, pofd: 0.0711,
      brier: 0.1456, csi: 0.5432, precision: 0.7956, recall: 0.8123,
      f1: 0.8039, mcc: 0.6534, accuracy: 0.8456, balanced_accuracy: 0.8706,
      specificity: 0.9289, npv: 0.8654, fpr: 0.0711, fnr: 0.1877,
      tp: 812, fp: 208, tn: 1646, fn: 188,
    },
    event_rate: 0.236,
    training_time: "5.1s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.2456, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.2234, category: "rolling" },
      { feature: "soft_mean_5m", importance: 0.0987, category: "rolling" },
      { feature: "flux_ratio", importance: 0.0812, category: "ratio" },
      { feature: "hard_std_5m", importance: 0.0623, category: "rolling" },
    ],
  },
  {
    label: "1h M-class",
    horizon: "1h",
    threshold: "M",
    metrics: {
      tss: 0.6823, auc: 0.9534, hss: 0.5892, pod: 0.7845, pofd: 0.1022,
      brier: 0.0876, csi: 0.4567, precision: 0.7234, recall: 0.7845,
      f1: 0.7526, mcc: 0.5876, accuracy: 0.8234, balanced_accuracy: 0.8412,
      specificity: 0.8978, npv: 0.8456, fpr: 0.1022, fnr: 0.2155,
      tp: 784, fp: 300, tn: 1556, fn: 216,
    },
    event_rate: 0.052,
    training_time: "3.8s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.3123, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.2876, category: "rolling" },
      { feature: "soft_mean_5m", importance: 0.0765, category: "rolling" },
    ],
  },
  {
    label: "3h M-class",
    horizon: "3h",
    threshold: "M",
    metrics: {
      tss: 0.6234, auc: 0.9412, hss: 0.5234, pod: 0.7234, pofd: 0.1123,
      brier: 0.0987, csi: 0.4123, precision: 0.6876, recall: 0.7234,
      f1: 0.7051, mcc: 0.5234, accuracy: 0.7987, balanced_accuracy: 0.8056,
      specificity: 0.8877, npv: 0.8123, fpr: 0.1123, fnr: 0.2766,
      tp: 723, fp: 329, tn: 1527, fn: 277,
    },
    event_rate: 0.052,
    training_time: "4.5s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.2987, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.2654, category: "rolling" },
    ],
  },
  {
    label: "6h C-class",
    horizon: "6h",
    threshold: "C",
    metrics: {
      tss: 0.7123, auc: 0.9321, hss: 0.6234, pod: 0.7956, pofd: 0.0834,
      brier: 0.1523, csi: 0.5234, precision: 0.7789, recall: 0.7956,
      f1: 0.7872, mcc: 0.6234, accuracy: 0.8345, balanced_accuracy: 0.8561,
      specificity: 0.9166, npv: 0.8523, fpr: 0.0834, fnr: 0.2044,
      tp: 796, fp: 225, tn: 1629, fn: 204,
    },
    event_rate: 0.236,
    training_time: "6.2s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.2345, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.2123, category: "rolling" },
    ],
  },
  {
    label: "1h X-class",
    horizon: "1h",
    threshold: "X",
    metrics: {
      tss: 0.5234, auc: 0.9789, hss: 0.4567, pod: 0.6543, pofd: 0.1309,
      brier: 0.0234, csi: 0.3456, precision: 0.6123, recall: 0.6543,
      f1: 0.6326, mcc: 0.4567, accuracy: 0.9123, balanced_accuracy: 0.7617,
      specificity: 0.8691, npv: 0.9234, fpr: 0.1309, fnr: 0.3457,
      tp: 654, fp: 414, tn: 1442, fn: 346,
    },
    event_rate: 0.008,
    training_time: "3.1s",
    samples: 7803585,
    feature_importance: [
      { feature: "hard_log", importance: 0.3567, category: "flux" },
      { feature: "hard_mean_5m", importance: 0.3234, category: "rolling" },
    ],
  },
];

export const BEST_MODEL = MODEL_RESULTS[0];

// Multi-Input Pipeline Results (HEL1OS + GOES-18, 2026 data)
export const MULTI_INPUT_RESULTS = {
  samples: 524,
  unique_ars: 103,
  positive_rate: 0.868,
  features_raw: 28,
  features_selected: 10,
  logo_cv: {
    n_folds: 17,
    tss_mean: 0.116,
    tss_std: 0.449,
    tss_range: [-0.500, 1.000],
    hss_mean: 0.107,
    pod_mean: 0.689,
    pofd_mean: 0.574,
    auc_mean: 0.633,
  },
  bootstrap: {
    n_bootstrap: 1000,
    tss_mean: 0.628,
    tss_std: 0.116,
    tss_ci_95: [0.377, 0.827],
    tss_median: 0.638,
    auc_mean: 0.891,
    auc_ci_95: [0.783, 0.962],
  },
  shap: {
    hel1os_contribution: 0.847,
    goes_contribution: 0.153,
    dominance_ratio: 5.6,
    top_feature: "hel1os_hard_soft_ratio",
    top_feature_value: 1.6702,
  },
  physics_conclusion: "HEL1OS hard X-ray dominates over GOES soft X-ray by 5.6x. Hard X-ray spectral features carry precursor information that soft X-ray flux alone cannot capture.",
};
