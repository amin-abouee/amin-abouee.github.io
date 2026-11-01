// apex-slam detail page content. Source: private apex-vio workspace —
// doc/performance.md (EuRoC / TUM VI VIO) and doc/hilti.md + doc/evaluation.md
// (Hilti 2023 LIO / LIVO). High-level only: the codebase is private.

import type { CratePage } from "@/data/apex-crates";
import { videoSrc } from "@/data/media";

export const apexSlamPage: CratePage = {
  title: "apex slam",
  tagline:
    "A personal, still-in-development SLAM stack: visual-inertial, LiDAR-inertial and LiDAR-inertial-visual odometry on one factor-graph core.",
  version: "0.1 · in development",
  links: [{ label: "Get in touch", href: "mailto:amin.abouee@gmail.com" }],
  overview: [
    "APEX SLAM is my personal SLAM stack, still in active development. It brings three odometry modes into one codebase and one estimation core: visual-inertial odometry for monocular and stereo camera and IMU setups, LiDAR-inertial odometry, and LiDAR-inertial-visual odometry that fuses cameras with LiDAR.",
    "The camera modes run in real time on laptop-class CPUs and target platforms that carry only cameras and an IMU, while the LiDAR modes add range for handheld and vehicle platforms. All modes share the same initialization, sliding-window estimation and evaluation tooling, so their results are scored identically and stay comparable across sensors and datasets.",
    "Development is ongoing: the numbers below are internal evaluations on public benchmarks (EuRoC, TUM VI and Hilti 2023) and will keep changing as the system matures. The source is private for now, so this page only reports high-level behaviour and benchmark results.",
  ],
  features: [
    {
      title: "Visual-inertial odometry",
      detail:
        "Monocular and stereo camera and IMU odometry at 10 to 40 ms per frame on a laptop CPU, with metric scale recovered from the IMU and stereo baseline.",
    },
    {
      title: "LiDAR-inertial odometry",
      detail:
        "LiDAR and IMU odometry with incremental mapping, 8.3 cm mean control-point RMSE on the Hilti 2023 handheld sequences.",
    },
    {
      title: "LiDAR-inertial-visual odometry",
      detail:
        "Adds camera photometric refinement to the LiDAR-inertial pipeline, leading the compared systems on the Hilti 2023 control-point score.",
    },
    {
      title: "One evaluation pipeline",
      detail:
        "EuRoC, TUM VI and Hilti 2023 are scored by the same tools for every mode, so VIO, LIO and LIVO numbers are directly comparable.",
    },
  ],
  sections: [
    {
      heading: "Visual-inertial odometry, full per-sequence results",
      intro:
        "ATE RMSE per sequence (SE(3)-aligned, scale not fitted), monocular and stereo, on all 11 EuRoC MAV sequences and all 6 TUM VI room sequences, against the published results of DM-VIO, Basalt and OKVIS2-X.",
      video: {
        title: "Stereo visual-inertial odometry",
        description:
          "A full stereo run in rerun: trajectory and landmark map, both camera streams, and live timing, ATE and bias panels.",
        src: videoSrc("apex-slam-vio-stereo"),
      },
      columns: ["Sequence", "Mono", "Stereo", "DM-VIO", "Basalt", "OKVIS2-X", "ms/frame"],
      rows: [
        ["MH_01_easy", "0.149 m", "0.051 m", "0.065 m", "0.070 m", "0.050 m", "13.9 / 18.5"],
        ["MH_02_easy", "0.112 m", "0.057 m", "0.044 m", "0.060 m", "0.048 m", "14.2 / 19.2"],
        ["MH_03_medium", "0.191 m", "0.060 m", "0.097 m", "0.070 m", "0.085 m", "13.9 / 19.7"],
        ["MH_04_difficult", "0.202 m", "0.095 m", "0.102 m", "0.130 m", "0.144 m", "10.9 / 15.2"],
        ["MH_05_difficult", "0.296 m", "0.132 m", "0.096 m", "0.110 m", "0.125 m", "11.2 / 15.0"],
        ["V1_01_easy", "0.078 m", "0.034 m", "0.048 m", "0.040 m", "0.045 m", "12.9 / 17.7"],
        ["V1_02_medium", "0.095 m", "0.043 m", "0.045 m", "0.050 m", "0.046 m", "12.9 / 19.4"],
        ["V1_03_difficult", "0.081 m", "0.043 m", "0.069 m", "0.100 m", "0.046 m", "10.3 / 16.3"],
        ["V2_01_easy", "0.081 m", "0.056 m", "0.029 m", "0.040 m", "0.033 m", "10.1 / 13.0"],
        ["V2_02_medium", "0.102 m", "0.093 m", "0.050 m", "0.050 m", "0.030 m", "10.7 / 15.8"],
        ["V2_03_difficult", "0.174 m", "0.085 m", "0.114 m", "not run", "0.071 m", "9.8 / 13.9"],
        ["EuRoC mean (11)", "0.142 m", "0.068 m", "0.069 m", "0.072 m", "0.066 m", "11.9 / 16.7"],
        ["room1", "0.040 m", "0.031 m", "0.030 m", "0.090 m", "not run", "16.0 / 28.2"],
        ["room2", "0.070 m", "0.042 m", "0.130 m", "0.070 m", "not run", "16.0 / 27.7"],
        ["room3", "0.069 m", "0.036 m", "0.090 m", "0.130 m", "not run", "21.6 / 39.6"],
        ["room4", "0.030 m", "0.019 m", "0.040 m", "0.050 m", "not run", "14.5 / 27.5"],
        ["room5", "0.052 m", "0.036 m", "0.060 m", "0.130 m", "not run", "14.2 / 26.2"],
        ["room6", "0.039 m", "0.017 m", "0.020 m", "0.020 m", "not run", "15.2 / 24.7"],
        ["TUM VI room mean (6)", "0.050 m", "0.030 m", "0.062 m", "0.082 m", "not run", "16.3 / 29.0"],
      ],
      note:
        "Per sequence, the median over three RANSAC seeds. Reference numbers are as published by those projects (DM-VIO reports medians over repeated runs in realtime mode) and were not re-run here, so the comparison is indicative rather than exact. Runtime is the mean per-frame time of the estimator loop on an Apple M4, monocular first and stereo second.",
    },
    {
      heading: "Hilti 2023 handheld: LiDAR and LiDAR-visual",
      intro:
        "Control-point RMSE per sequence over the 12 handheld sequences with published control points, against FAST-LIVO2 and Voxel-SLAM run on the same bags (Hilti 2023 scoring, 1200 points maximum).",
      video: {
        title: "LiDAR-inertial-visual odometry",
        description:
          "LIVO on a Hilti 2023 handheld sequence: the LiDAR map coloured by camera depth, the fisheye stream, and live timing and control-point panels.",
        src: videoSrc("apex-slam-livo-hilti"),
      },
      columns: ["Sequence", "APEX LIO", "APEX LIVO", "FAST-LIVO2", "Voxel-SLAM"],
      rows: [
        ["site1_handheld_1", "8.5 cm", "5.0 cm", "32.1 cm", "27.5 cm"],
        ["site1_handheld_2", "5.2 cm", "5.1 cm", "20.9 cm", "21.6 cm"],
        ["site1_handheld_3", "8.2 cm", "7.6 cm", "24.9 cm", "28.5 cm"],
        ["site1_handheld_4", "4.6 cm", "4.8 cm", "38.6 cm", "17.2 cm"],
        ["site1_handheld_5", "7.6 cm", "6.6 cm", "11.8 cm", "16.3 cm"],
        ["site2_handheld_4", "8.1 cm", "2.2 cm", "8.0 cm", "30.1 cm"],
        ["site2_handheld_5", "1.7 cm", "1.6 cm", "6.5 cm", "6.1 cm"],
        ["site2_handheld_6", "20.4 cm", "27.1 cm", "11.0 cm", "19.8 cm"],
        ["site3_handheld_1", "4.9 cm", "5.0 cm", "8.6 cm", "9.2 cm"],
        ["site3_handheld_2", "11.9 cm", "11.8 cm", "6.9 cm", "7.8 cm"],
        ["site3_handheld_3", "10.5 cm", "12.3 cm", "31.4 cm", "20.1 cm"],
        ["site3_handheld_4", "7.8 cm", "8.7 cm", "8.5 cm", "9.3 cm"],
        ["Mean RMSE", "8.3 cm", "8.2 cm", "17.4 cm", "17.8 cm"],
        ["Hilti score (of 1200)", "212.9", "246.3", "135.9", "125.2"],
      ],
      note:
        "Scored by yaw and translation alignment (gravity kept), as the challenge does; site2_handheld_5 is scored on its 3 consistent control points because the published ground truth repeats a leg. Competitor numbers are our own runs on the same stripped bags, executed in an arm64 VM on the same machine, while APEX runs natively.",
    },
    {
      heading: "Runtime on Hilti 2023",
      intro: "Mean time per LiDAR sweep; the sensor runs at 10 Hz, so a sweep has 100 ms of real-time budget.",
      columns: ["Mode", "Mean time per sweep", "Budget used"],
      rows: [
        ["APEX LIO", "15.0 ms", "15 %"],
        ["APEX LIVO", "22.6 ms", "23 %"],
        ["FAST-LIVO2 (LIO + VIO)", "17.4 ms", "17 %"],
        ["Voxel-SLAM (odometry + local mapping)", "14.8 ms", "15 %"],
      ],
      note:
        "APEX times include image decoding for LIVO and run its window adjustment on all cores; competitor figures are their own instrumentation from the VM runs.",
    },
  ],
};
