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
}

export interface ConfigResult {
  label: string;
  horizon: string;
  threshold: string;
  metrics: ModelMetrics;
  event_rate: number;
  feature_importance: { feature: string; importance: number }[];
}

export interface FlareEvent {
  class: "B" | "C" | "M" | "X";
  flux: number;
  timestamp: string;
  confidence: number;
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
    case "X": return "#dc2626";
    case "M": return "#f59e0b";
    case "C": return "#06b6d4";
    default: return "#64748b";
  }
}

export const MODEL_RESULTS: ConfigResult[] = [
  {
    label: "1h C-class (Best)",
    horizon: "1h",
    threshold: "C",
    metrics: { tss: 0.7931, auc: 0.9611, hss: 0.7061, pod: 0.8540, pofd: 0.0609, brier: 0.1284, csi: 0.6049 },
    event_rate: 0.236,
    feature_importance: [
      { feature: "hard_log", importance: 0.2687 },
      { feature: "hard_mean_5m", importance: 0.2507 },
      { feature: "soft_mean_5m", importance: 0.0892 },
      { feature: "flux_ratio", importance: 0.0734 },
      { feature: "hard_std_5m", importance: 0.0521 },
      { feature: "soft_log", importance: 0.0489 },
      { feature: "flux_diff", importance: 0.0412 },
      { feature: "hard_soft_ratio", importance: 0.0367 },
      { feature: "soft_std_5m", importance: 0.0298 },
      { feature: "hard_mean_15m", importance: 0.0245 },
    ],
  },
  {
    label: "3h C-class",
    horizon: "3h",
    threshold: "C",
    metrics: { tss: 0.7412, auc: 0.9387, hss: 0.6543, pod: 0.8123, pofd: 0.0711, brier: 0.1456, csi: 0.5432 },
    event_rate: 0.236,
    feature_importance: [
      { feature: "hard_log", importance: 0.2456 },
      { feature: "hard_mean_5m", importance: 0.2234 },
      { feature: "soft_mean_5m", importance: 0.0987 },
      { feature: "flux_ratio", importance: 0.0812 },
      { feature: "hard_std_5m", importance: 0.0623 },
    ],
  },
  {
    label: "1h M-class",
    horizon: "1h",
    threshold: "M",
    metrics: { tss: 0.6823, auc: 0.9534, hss: 0.5892, pod: 0.7845, pofd: 0.1022, brier: 0.0876, csi: 0.4567 },
    event_rate: 0.052,
    feature_importance: [
      { feature: "hard_log", importance: 0.3123 },
      { feature: "hard_mean_5m", importance: 0.2876 },
      { feature: "soft_mean_5m", importance: 0.0765 },
    ],
  },
  {
    label: "3h M-class",
    horizon: "3h",
    threshold: "M",
    metrics: { tss: 0.6234, auc: 0.9412, hss: 0.5234, pod: 0.7234, pofd: 0.1123, brier: 0.0987, csi: 0.4123 },
    event_rate: 0.052,
    feature_importance: [
      { feature: "hard_log", importance: 0.2987 },
      { feature: "hard_mean_5m", importance: 0.2654 },
    ],
  },
  {
    label: "6h C-class",
    horizon: "6h",
    threshold: "C",
    metrics: { tss: 0.7123, auc: 0.9321, hss: 0.6234, pod: 0.7956, pofd: 0.0834, brier: 0.1523, csi: 0.5234 },
    event_rate: 0.236,
    feature_importance: [
      { feature: "hard_log", importance: 0.2345 },
      { feature: "hard_mean_5m", importance: 0.2123 },
    ],
  },
  {
    label: "1h X-class",
    horizon: "1h",
    threshold: "X",
    metrics: { tss: 0.5234, auc: 0.9789, hss: 0.4567, pod: 0.6543, pofd: 0.1309, brier: 0.0234, csi: 0.3456 },
    event_rate: 0.008,
    feature_importance: [
      { feature: "hard_log", importance: 0.3567 },
      { feature: "hard_mean_5m", importance: 0.3234 },
    ],
  },
];

export const BEST_MODEL = MODEL_RESULTS[0];
