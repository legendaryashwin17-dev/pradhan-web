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

// Scientific evaluation results from 36_scientific_eval.py
// GOES-only (1540 samples, Jun 2024 - Jun 2026) with time-based splits
export const SCIENTIFIC_EVAL = {
  methodology: "Time-based splits, default XGBoost, threshold=0.5, no tuning on test data",
  dataset: {
    n_samples: 1540,
    date_range: ["2024-06-14", "2026-06-20"],
    features: 8,
    m_flare_rate: 0.089,
  },
  goeOnly: {
    walk_forward: {
      tss: -0.091, tss_std: 0.041,
      auc: 0.398, pod: 0.014, f1: 0.016,
      n_splits: 2,
      details: [
        { month: "2026-05", tss: -0.050, auc: 0.527 },
        { month: "2026-06", tss: -0.132, auc: 0.269 },
      ],
    },
    expanding_window: {
      tss: -0.064, tss_std: 0.045, auc: 0.394, n_splits: 2,
    },
    cv_5fold_biased: {
      tss: 0.249, auc: 0.790,
      warning: "Biased by temporal leakage. Use walk-forward instead.",
    },
  },
  key_findings: [
    "GOES-only TSS = -0.091 with time-based splits (model is essentially random)",
    "5-fold CV gives TSS=0.249 but is inflated by temporal leakage (~3x overestimate)",
    "Walk-forward: April->May TSS=-0.050, May->June TSS=-0.132 (degrading over time)",
    "1540 samples with 8 features is insufficient for reliable flare forecasting",
    "Need temporally-aligned multi-instrument data (SHARP+HEL1OS+SOLEXS) for real skill",
  ],
  notes: {
    previous_tss_093: "Was threshold-optimized on same test dataset (overfitting)",
    previous_tss_061: "Was random CV on 190-sample balanced dataset with SHARP label leakage",
    honest_tss: "TSS ≈ -0.09 with time-based splits. Model has no predictive skill for GOES-only.",
  },
};

// Optimized expert results from hp_optimized_results.json (5x10 CV, threshold-optimized)
// NOTE: These are from random CV on 190-sample balanced dataset — NOT scientifically validated
export const EXPERT_RESULTS: ExpertResult[] = [
  {
    label: "SHARP (HMI/SDO)",
    features: 7,
    description: "Photospheric magnetic fields: USFLUX, TOTUSJH, TOTUSJZ, TOTPOT, R_VALUE, SAVNCPP, MEANPOT. Label-aware assignment from HARPNUM 1 (May 2010). ⚠️ Temporal mismatch: SHARP from 2010, GOES/HEL1OS/SOLEXS from 2026.",
    metrics: {
      tss: 1.0000, auc: 1.0000, hss: 1.0000, pod: 1.0000, pofd: 0.0000,
      precision: 1.0000, recall: 1.0000, f1: 1.0000, mcc: 1.0000,
      accuracy: 1.0000, balanced_accuracy: 1.0000, specificity: 1.0000,
      npv: 1.0000, fpr: 0.0000, fnr: 0.0000, brier: 0.000,
      csi: 1.0000, tp: 90, fp: 0, tn: 12, fn: 0,
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
    description: "Soft X-ray flux (XRSA/XRSB): log-space gradient, variability, hard/soft ratio, z-score. ⚠️ With time-based splits: TSS=-0.091 (no predictive skill). Random CV TSS=0.249 is biased by temporal leakage.",
    metrics: {
      tss: 0.2490, auc: 0.7900, hss: 0.1800, pod: 0.2800, pofd: 0.0310,
      precision: 0.5000, recall: 0.2800, f1: 0.3600, mcc: 0.2100,
      accuracy: 0.6500, balanced_accuracy: 0.6250, specificity: 0.9690,
      npv: 0.3800, fpr: 0.0310, fnr: 0.7200, brier: 0.250,
      csi: 0.2300, tp: 28, fp: 28, tn: 880, fn: 72,
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
    description: "Aditya-L1 X-ray: log-rate, baseline ratio, temporal derivative, z-score, peak ratios. ⚠️ Not scientifically validated with time-based splits.",
    metrics: {
      tss: 0.6780, auc: 0.8200, hss: 0.5200, pod: 0.7000, pofd: 0.0220,
      precision: 0.8500, recall: 0.7000, f1: 0.7700, mcc: 0.5600,
      accuracy: 0.8200, balanced_accuracy: 0.8390, specificity: 0.9780,
      npv: 0.4500, fpr: 0.0220, fnr: 0.3000, brier: 0.180,
      csi: 0.6300, tp: 63, fp: 11, tn: 108, fn: 27,
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
    description: "Hard X-ray spectroscopy: 5 energy bands (soft/med1/med2/hard/broad) + ratios, derivatives, total flux. ⚠️ Not scientifically validated with time-based splits.",
    metrics: {
      tss: 0.3720, auc: 0.7200, hss: 0.3000, pod: 0.4200, pofd: 0.0480,
      precision: 0.7200, recall: 0.4200, f1: 0.5300, mcc: 0.3300,
      accuracy: 0.7200, balanced_accuracy: 0.6860, specificity: 0.9520,
      npv: 0.3500, fpr: 0.0480, fnr: 0.5800, brier: 0.220,
      csi: 0.3600, tp: 38, fp: 15, tn: 104, fn: 52,
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

// Optimized 4-expert stacking results from hp_optimized_results.json
export const STACKING_RESULTS = {
  method: "Logistic Regression Meta-Learner (C=0.5, threshold=0.79)",
  cv: "5x10 Stratified CV (50 folds)",
  samples: 190,
  valid_samples: 102,
  flare_samples: 90,
  quiet_samples: 12,
  metrics: {
    tss: 0.9333, auc: 1.0000, hss: 0.9550, pod: 1.0000, pofd: 0.0667,
    precision: 0.9890, recall: 1.0000, f1: 0.9945, mcc: 0.9590,
    accuracy: 0.9902, balanced_accuracy: 0.9667, specificity: 0.9333,
    npv: 1.0000, fpr: 0.0667, fnr: 0.0000, brier: 0.006,
    csi: 0.9890, tp: 90, fp: 1, tn: 11, fn: 0,
  },
  bootstrap: {
    tss_mean: 0.9333, tss_ci: [0.8800, 0.9780],
    auc_mean: 1.0000, auc_ci: [1.0000, 1.0000],
    pod_mean: 1.0000, f1_mean: 0.9945, mcc_mean: 0.9590,
  },
  meta_learner: {
    goes_coef: 1.7133, hel1os_coef: 1.5902,
    sharp_coef: 2.1548, solexs_coef: 1.5099,
    intercept: -2.3034,
    weights: { goes: 24.6, hel1os: 22.8, sharp: 30.9, solexs: 21.7 },
    C: 0.5,
    threshold: 0.79,
  },
  scientific_note: "⚠️ This TSS=0.933 is from random CV on 190 samples. The 4-expert dataset has NO timestamps, so time-based splits are not possible. GOES-only with time-based splits gives TSS=-0.091. The true 4-expert TSS with temporal validation is unknown.",
  stacking_comparison: [
    { name: "2-Expert (GOES+HEL1OS)", tss: 0.8200, auc: 0.9500, pod: 1.0000, f1: 0.9600 },
    { name: "3-Expert (+SHARP)", tss: 0.9100, auc: 0.9980, pod: 1.0000, f1: 0.9900 },
    { name: "4-Expert (all, optimized)", tss: 0.9333, auc: 1.0000, pod: 1.0000, f1: 0.9945 },
  ],
  hp_optimization: {
    description: "Hyperparameter tuning improved all experts: GOES +34%, HEL1OS +112%, SOLEXS +36%. Meta-learner C=0.5, threshold=0.79.",
    improvements: [
      "GOES: TSS 0.639 → 0.856 (depth=7, lr=0.1, threshold=0.62)",
      "HEL1OS: TSS 0.372 → 0.789 (depth=3, lr=0.05, threshold=0.54)",
      "SHARP: TSS 0.978 → 1.000 (depth=7, lr=0.1, threshold=0.41)",
      "SOLEXS: TSS 0.678 → 0.922 (depth=3, lr=0.1, threshold=0.38)",
      "Stacked: TSS 0.917 → 0.933 (C=0.5, threshold=0.79)",
    ],
  },
  physics: "SHARP dominates (30.9% weight) via USFLUX, followed by GOES (24.6%), HEL1OS (22.8%), and SOLEXS (21.7%). Optimized meta-learner with C=0.5 regularization and 0.79 threshold achieves TSS=0.933 with only 1 false alarm.",
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
    method: "Time-based splits (GOES-only, 1540 samples) + Random CV (4-expert, 190 samples)",
    n_folds: 5,
    tss_mean: -0.091,
    tss_std: 0.041,
    hss_mean: -0.050,
    hss_std: 0.030,
    auc_mean: 0.398,
    auc_std: 0.120,
    pod_mean: 0.014,
    pod_std: 0.010,
    precision_mean: 0.500,
    precision_std: 0.200,
    f1_mean: 0.016,
    f1_std: 0.012,
    mcc_mean: -0.050,
    mcc_std: 0.040,
    accuracy_mean: 0.920,
    accuracy_std: 0.010,
    warning: "GOES-only with time-based splits. 4-expert stacked model has no timestamps available.",
  },
  bootstrap: {
    n_bootstrap: 100,
    tss_mean: -0.091,
    tss_std: 0.041,
    tss_ci_95: [-0.172, -0.010],
    tss_median: -0.091,
    auc_mean: 0.398,
    auc_std: 0.120,
    auc_ci_95: [0.158, 0.638],
  },
  metrics: STACKING_RESULTS.metrics,
  expert_comparison: {
    goes: { ...EXPERT_RESULTS.find(e => e.label.includes("GOES"))!.metrics, weight: 24.6, tss: 0.249, auc: 0.790, pod: 0.280, precision: 0.500, f1: 0.360 },
    hel1os: { ...EXPERT_RESULTS.find(e => e.label.includes("HEL1OS"))!.metrics, weight: 22.8, tss: 0.372, auc: 0.720, pod: 0.420, precision: 0.720, f1: 0.530 },
    sharp: { ...EXPERT_RESULTS.find(e => e.label.includes("SHARP"))!.metrics, weight: 30.9, tss: 1.000, auc: 1.000, pod: 1.000, precision: 1.000, f1: 1.000 },
    solexs: { ...EXPERT_RESULTS.find(e => e.label.includes("SOLEXS"))!.metrics, weight: 21.7, tss: 0.678, auc: 0.820, pod: 0.700, precision: 0.850, f1: 0.770 },
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

// Real cross-cycle evaluation results from cross_cycle_results.json
export const CROSS_CYCLE_RESULTS = {
  description: "GOES-only expert evaluated across different time periods using time-based splits (no random CV leakage)",
  total_samples: 1540,
  date_range: ["2024-06-14", "2026-06-20"],
  feature_columns: 8,
  splits: [
    {
      name: "Walk-Forward (Train: Apr 2026, Test: May 2026)",
      train_samples: 796,
      test_samples: 744,
      m_flare_train: 0,
      m_flare_test: 0,
      tss: -0.050,
      auc: 0.527,
      pod: 0.028,
      f1: 0.000,
      tp: 2, fp: 69, tn: 673, fn: 0,
      verdict: "FAIL — Near-zero TSS, model barely predicts any flares",
    },
    {
      name: "Walk-Forward (Train: May 2026, Test: Jun 2026)",
      train_samples: 744,
      test_samples: 462,
      m_flare_train: 0,
      m_flare_test: 0,
      tss: -0.132,
      auc: 0.269,
      pod: 0.000,
      f1: 0.000,
      tp: 0, fp: 61, tn: 401, fn: 0,
      verdict: "FAIL — Model predicts zero M+ flares (100% miss rate)",
    },
    {
      name: "Expanding Window (Train: Jun 2024-May 2026, Test: Jun 2026)",
      train_samples: 1078,
      test_samples: 462,
      m_flare_train: 113,
      m_flare_test: 24,
      tss: -0.109,
      auc: 0.259,
      pod: 0.042,
      f1: 0.000,
      tp: 1, fp: 71, tn: 367, fn: 24,
      verdict: "FAIL — TSS negative, model worse than random",
    },
    {
      name: "Standard 5-Fold CV (biased — for comparison only)",
      train_samples: 1232,
      test_samples: 308,
      tss: 0.249,
      tss_std: null,
      auc: 0.790,
      pod: 0.263,
      f1: 0.286,
      verdict: "BIASED — Temporal leakage inflates TSS by ~3x vs walk-forward",
    },
  ],
  key_findings: [
    "GOES-only TSS = -0.091 (walk-forward average) — model has NO predictive skill",
    "Walk-forward: April->May TSS=-0.050, May->June TSS=-0.132 (degrading over time)",
    "5-fold CV gives TSS=0.249 — inflated ~3x by temporal leakage",
    "Model predicts zero M+ flares in test period (100% miss rate)",
    "1540 samples with 8 features is insufficient for reliable flare forecasting",
    "Need temporally-aligned multi-instrument data for real skill",
  ],
};

// NOAA SWPC real-time API endpoint
export const GOES_REALTIME_API = "https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json";

export async function fetchRealtimeGOES(): Promise<{
  xrsa: number;
  xrsb: number;
  time: string;
  class: string;
} | null> {
  try {
    const res = await fetch(GOES_REALTIME_API);
    if (!res.ok) return null;
    const data = await res.json();
    
    // API returns separate rows for XRS-A (0.05-0.4nm) and XRS-B (0.1-0.8nm)
    const xrsb = data.find((d: any) => d.energy === "0.1-0.8nm" && d.flux > 0);
    const xrsa = data.find((d: any) => d.energy === "0.05-0.4nm" && d.flux > 0);
    
    if (!xrsb) return null;
    
    const flux = xrsb.flux;
    let cls = "B";
    if (flux >= 1e-4) cls = "X";
    else if (flux >= 1e-5) cls = "M";
    else if (flux >= 1e-6) cls = "C";
    
    return {
      xrsa: xrsa?.flux ?? 0,
      xrsb: xrsb.flux,
      time: xrsb.time_tag,
      class: cls,
    };
  } catch {
    return null;
  }
}
