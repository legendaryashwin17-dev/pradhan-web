"use client";

import { motion } from "framer-motion";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { Activity, Download, RefreshCw, Sun, Telescope, Satellite, Zap, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface DataSource {
  id: string;
  name: string;
  instrument: string;
  satellite: string;
  description: string;
  cadence: string;
  format: string;
  url: string;
  icon: typeof Sun;
  color: string;
  features: string[];
}

const DATA_SOURCES: DataSource[] = [
  {
    id: "goes",
    name: "GOES-18 XRS",
    instrument: "X-Ray Sensor",
    satellite: "GOES-18 (Geostationary)",
    description: "Soft X-ray flux in 0.5-4 A and 1-8 A bands. Primary flare classification channel. 1-minute cadence NetCDF files.",
    cadence: "1 min",
    format: "NetCDF (.nc)",
    url: "https://data.ngdc.noaa.gov/platforms/solar-space-observing-satellites/goes/goes18/l2/data/xrs-l2-flx1s/",
    icon: Sun,
    color: "#3b82f6",
    features: ["goes_log_xrsa", "goes_log_xrsb", "goes_xrsb_baseline", "goes_xrsb_log_grad", "goes_xrsb_log_std", "goes_xrsb_log_mean", "goes_xrsa_xrsb_ratio", "goes_xrsb_log_zscore"],
  },
  {
    id: "hel1os",
    name: "HEL1OS",
    instrument: "Hard X-ray Spectrometer",
    satellite: "Aditya-L1 (L1 Orbit)",
    description: "Hard X-ray spectroscopy across 5 energy bands (soft/med1/med2/hard/broad). 105 FITS files, ~12h cadence.",
    cadence: "~12 hr",
    format: "FITS (.fits)",
    url: "https://sdc-pdc.aditya-l1.isro.gov.in/",
    icon: Telescope,
    color: "#a855f7",
    features: ["hel1os_soft_flux", "hel1os_soft_std", "hel1os_soft_max", "hel1os_med2_flux", "hel1os_hard_flux", "hel1os_hard_soft_ratio", "hel1os_total_flux"],
  },
  {
    id: "sharp",
    name: "HMI/SHARP",
    instrument: "Helioseismic and Magnetic Imager",
    satellite: "SDO (Geostationary)",
    description: "Photospheric magnetic field parameters. 7 features: USFLUX, TOTUSJH, TOTUSJZ, TOTPOT, R_VALUE, SAVNCPP, MEANPOT.",
    cadence: "12 min",
    format: "CSV (from JSOC)",
    url: "https://jsoc.stanford.edu/",
    icon: Zap,
    color: "#ef4444",
    features: ["sharp_USFLUX", "sharp_TOTUSJH", "sharp_TOTUSJZ", "sharp_TOTPOT", "sharp_R_VALUE", "sharp_SAVNCPP", "sharp_MEANPOT"],
  },
  {
    id: "solexs",
    name: "SOLEXS",
    instrument: "Solar X-ray Spectrometer",
    satellite: "Aditya-L1 (L1 Orbit)",
    description: "Single-channel X-ray count rates at 10-second cadence. Independent X-ray perspective from L1 vantage point.",
    cadence: "10 sec",
    format: "Parquet / FITS",
    url: "https://aditya-l1.isro.gov.in/",
    icon: Satellite,
    color: "#22c55e",
    features: ["solexs_log_rate", "solexs_rate", "solexs_log_rate_mean", "solexs_log_rate_std", "solexs_baseline", "solexs_log_deriv", "solexs_log_zscore"],
  },
];

const PIPELINE_STEPS = [
  { name: "Download Data", script: "30_auto_update.py", description: "Selenium + urllib fetch fresh data from NOAA, ISRO, JSOC", icon: Download },
  { name: "Build Samples", script: "22_build_balanced_samples.py", description: "Create balanced flare/quiet windows from GOES events", icon: Activity },
  { name: "Extract Features", script: "27_extract_solexs_features.py", description: "Compute 48 features across all 4 instruments", icon: Zap },
  { name: "Train & Stack", script: "25_stacking_pipeline.py", description: "4 XGBoost experts + logistic regression meta-learner", icon: RefreshCw },
];

export default function AutoUpdatePage() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Auto-Update Pipeline
        </h1>
        <p className="text-cyan-400/70 text-lg">
          Automated data download + model retraining across 4 solar observatories
        </p>
      </motion.div>

      {/* Pipeline Flow */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Update Pipeline</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.name} className="flex items-center gap-3">
                  <div className="flex flex-col items-center text-center w-40">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <p className="text-white font-medium text-sm">{step.name}</p>
                    <p className="text-white/40 text-[10px] mt-1">{step.script}</p>
                    <p className="text-white/50 text-xs mt-1">{step.description}</p>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-white/20 hidden md:block flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </GlowingCard>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATA_SOURCES.map((source) => {
            const Icon = source.icon;
            const isExpanded = expandedSource === source.id;
            return (
              <motion.div
                key={source.id}
                variants={fadeIn}
                onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                className="cursor-pointer"
              >
                <GlowingCard className="p-5 h-full" glowColor={source.color}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${source.color}15`, border: `1px solid ${source.color}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: source.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold">{source.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${source.color}20`, color: source.color }}>
                          {source.cadence}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">{source.instrument}</p>
                      <p className="text-white/40 text-xs mt-1">{source.satellite}</p>
                      <p className="text-white/60 text-sm mt-2">{source.description}</p>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 pt-3 border-t border-white/10"
                        >
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Features ({source.features.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {source.features.map((f) => (
                              <span key={f} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono">
                                {f}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-white/40 text-xs">Format: {source.format}</span>
                            <span className="text-white/20">|</span>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:underline"
                              style={{ color: source.color }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Source Portal ↗
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </GlowingCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Architecture: Why 4 Instruments */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Why 4 Instruments?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Multi-Vantage Observations</h3>
              <p className="text-white/60 text-sm">
                GOES-18 (geostationary) and Aditya-L1 (L1 orbit) observe the Sun from different
                angles. SOLEXS and HEL1OS on Aditya-L1 provide independent X-ray measurements
                at L1, while GOES monitors from Earth orbit. This multi-vantage approach reduces
                single-instrument bias.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Full Energy Coverage</h3>
              <p className="text-white/60 text-sm">
                GOES covers soft X-rays (1.5-25 keV), HEL1OS covers hard X-rays (10-150 keV),
                SOLEXS provides high-cadence X-ray monitoring, and SHARP measures the magnetic
                field structure that drives flares. Together they cover the complete flare
                energy chain from magnetic reconnection to particle acceleration.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Temporal Diversity</h3>
              <p className="text-white/60 text-sm">
                SOLEXS (10s) captures rapid flare onset, GOES (1min) tracks flare evolution,
                SHARP (12min) shows magnetic field changes, and HEL1OS (~12h) provides
                spectral context. Each timescale reveals different physics.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Stacking Advantage</h3>
              <p className="text-white/60 text-sm">
                The meta-learner (logistic regression) learns optimal weights: SHARP 30.9%
                (magnetic field is most predictive), GOES 24.6%, HEL1OS 22.8%, SOLEXS 21.7%.
                Each expert contributes independent information that improves the ensemble.
              </p>
            </div>
          </div>
        </GlowingCard>
      </motion.div>

      {/* Retrain Log / Status */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Update Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> GOES-18
              </h3>
              <p className="text-white/60 text-sm">
                Daily automated download from NOAA NCEI. New data available ~24h after observation.
                urllib direct download — no authentication required.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> HEL1OS / SOLEXS
              </h3>
              <p className="text-white/60 text-sm">
                ISRO SDC portal requires Selenium browser automation. Data release schedule varies.
                Currently 105 FITS files (Apr-Jun 2026). Future: automated periodic fetch.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> SHARP
              </h3>
              <p className="text-white/60 text-sm">
                JSOC drms Python API — query by date range and HARPNUM. Email registration required.
                New HMI data available ~48h after observation.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-cyan-500/5 rounded-lg p-4 border border-cyan-500/10">
            <p className="text-white/60 text-sm">
              <span className="text-cyan-400 font-medium">CLI Usage:</span>{" "}
              <code className="text-cyan-300 text-xs bg-black/30 px-2 py-0.5 rounded">
                python scripts/30_auto_update.py --source all
              </code>{" "}
              downloads fresh data, then{" "}
              <code className="text-cyan-300 text-xs bg-black/30 px-2 py-0.5 rounded">
                python scripts/31_auto_retrain.py
              </code>{" "}
              retrains the 4-expert stacking model.
            </p>
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  );
}
