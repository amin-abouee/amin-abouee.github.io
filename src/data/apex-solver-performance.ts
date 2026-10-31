// apex-solver project content and benchmark data.
// Source: apex-solver README + doc/performance.md (1.5.0, measured 2026-09-29 on Mac mini M4).

export const apexSolver = {
  title: "apex solver",
  tagline:
    "A high-performance Rust library for nonlinear least squares optimization in SLAM & Computer Vision.",
  overview: [
    "Apex Solver is a high-performance nonlinear least-squares optimization library for computer vision and robotics — bundle adjustment, SLAM, pose-graph optimization and sensor fusion. It provides manifold-aware optimization over Lie groups, three optimizers (Levenberg-Marquardt, Gauss-Newton, Dog Leg) behind a unified interface, sparse and matrix-free Schur-complement linear solvers, and industry-standard file format support (G2O, TORO, BAL) for seamless integration with existing workflows.",
    "The problem lives in a slot-map arena: variables and factors are addressed by stable, generational VarKey/FactorKey handles — O(1) access with no hashing or per-key allocation on the hot path. Manifold parameters stay in contiguous storage handed to faer as zero-copy views, a persistent symbolic factorization is built once and reused every iteration, and assembly runs lock-free parallel over disjoint buffers (rayon). The per-iteration hot path is allocation- and copy-free.",
  ],
  links: [
    { label: "Source", href: "https://github.com/amin-abouee/apex-solver" },
    {
      label: "Benchmark cookbook",
      href: "https://amin-abouee.github.io/apex-solver/",
    },
    { label: "crates.io", href: "https://crates.io/crates/apex-solver" },
    { label: "docs.rs", href: "https://docs.rs/apex-solver" },
  ],
  features: [
    {
      title: "Broad factor library (~40 factors)",
      detail:
        "IMU (SE₂(3)/SGal(3) preintegration), visual (projection, stereo, inverse-depth, essential matrix, smart projection), LiDAR (point/point, point-to-plane, GICP, LOAM edge), GNSS & navigation, range & bearing, motion models and marginalization.",
    },
    {
      title: "Noise models",
      detail:
        "Per-residual-block measurement uncertainty (Null / Diagonal / Dense), whitened upstream of the robust-loss corrector.",
    },
    {
      title: "Slot-map problem structure",
      detail:
        "Generational VarKey/FactorKey handles in a slotmap arena — O(1) access with no hashing, cache-friendly iteration, stale keys can never alias reused slots.",
    },
    {
      title: "Manifold-aware Lie groups",
      detail:
        "SE(2), SE(3), SO(2), SO(3), SE₂(3), SGal(3), Sim(3) and Rⁿ from apex-manifolds, all with analytic Jacobians.",
    },
    {
      title: "Bundle adjustment with intrinsics",
      detail:
        "Simultaneous optimization of camera poses, 3D landmarks and camera intrinsics (9 camera models via apex-camera-models).",
    },
    {
      title: "Explicit & implicit Schur solvers",
      detail:
        "Matrix-free PCG (ImplicitSparseSchur, Schur-Jacobi preconditioner, η = 1e-2) for 10,000+ camera problems alongside explicit sparse/dense reduced solves.",
    },
    {
      title: "15 robust loss functions",
      detail:
        "Huber, Cauchy, Tukey, Welsch, Barron, Geman-McClure, Lp-norm and more — with Levenberg-Marquardt, Gauss-Newton and Dog Leg optimizers.",
    },
    {
      title: "Ecosystem & visualization",
      detail:
        "G2O / TORO / BAL I/O via apex-io, covariance estimation for uncertainty quantification, and zero-overhead Rerun visualization observers (feature-gated).",
    },
  ],
  meta: {
    hardware: "Apple Mac mini M4 (10 cores), 32 GB RAM, macOS",
    build: "Rust 1.98 release (opt-level=3, LTO); C++ -O3 -DNDEBUG -march=native, Eigen 5.0.1",
    versions:
      "apex-solver 1.5.0 · Ceres 2.2.0 · GTSAM 4.3.0 · g2o 20241228 · factrs / tiny-solver (Cargo.lock)",
    measured:
      "2026-09-29 (apex rows at 1.5.0) · Ceres/GTSAM/g2o/factrs/tiny-solver rows carried from the 2026-09-27 session",
    method:
      "Mean ± std over independent runs; timing covers the optimize() call only (setup and metric computation excluded). Cost and RMSE are computed by the benchmark harness from the input files for every solver, so values are comparable across implementations. Bundle adjustment uses a 10-minute timeout.",
  },
  observations: [
    "Fastest on 5 of 8 pose-graph datasets — M3500 (1.27× GTSAM), city10000 (1.40× GTSAM, 3.5× Ceres), ring, cubicle and, among solvers that reach a good solution, mit.",
    "GTSAM 4.3 reaches the lowest normalized cost on all 8 datasets; apex lands within 1–4 % of it on M3500, parking-garage, city10000 and torus3D.",
    "Bundle adjustment: apex is the only solver besides g2o to finish 5 M-observation Venice inside the 10-minute limit — 0.745 px RMSE in 19 s — while Ceres and GTSAM time out.",
    "ImplicitSparseSchur (matrix-free PCG) is 3.3–3.5× faster in total than the explicit reduced solve on Ladybug and Venice at equal accuracy.",
    "Several BAL files contain degenerate cameras (focal length ≈ 1e10) that set the parameter-tolerance threshold; Venice therefore stops after 2 iterations. The upstream doc walks through every such caveat.",
  ],
  images: "/apex-solver.jpg",
};

// ---------- Benchmark data (doc/performance.md, apex-solver 1.5.0) ----------

export type PoseRow = {
  solver: string;
  cost: string;
  costPer: string;
  time: string;
  timeVal: number | null;
  iters: string;
  bestCost?: boolean;
  bestTime?: boolean;
};

export type PoseDataset = { dataset: string; info: string; rows: PoseRow[] };

export const poseGraphSe2: PoseDataset[] = [
  {
    dataset: "M3500",
    info: "3500 poses · 5453 edges",
    rows: [
      { solver: "apex-solver", cost: "1.5238e+00", costPer: "7.802e-04", time: "34.3 ± 2.8", timeVal: 34.3, iters: "6", bestTime: true },
      { solver: "factrs", cost: "1.5238e+00", costPer: "7.802e-04", time: "57.5 ± 0.6", timeVal: 57.5, iters: "–" },
      { solver: "tiny-solver", cost: "2.8604e+04", costPer: "1.465e+01", time: "210.6 ± 3.2", timeVal: 210.6, iters: "–" },
      { solver: "Ceres", cost: "4.5437e+03", costPer: "2.327e+00", time: "75.3 ± 0.3", timeVal: 75.3, iters: "18" },
      { solver: "GTSAM", cost: "1.5109e+00", costPer: "7.737e-04", time: "43.5 ± 0.4", timeVal: 43.5, iters: "6", bestCost: true },
      { solver: "g2o", cost: "1.5109e+00", costPer: "7.737e-04", time: "107.9 ± 0.5", timeVal: 107.9, iters: "33", bestCost: true },
    ],
  },
  {
    dataset: "mit",
    info: "808 poses · 827 edges",
    rows: [
      { solver: "apex-solver", cost: "4.9970e+01", costPer: "2.630e+00", time: "9.8 ± 0.5", timeVal: 9.8, iters: "15" },
      { solver: "factrs", cost: "1.4831e+04", costPer: "7.806e+02", time: "3.4 ± 0.0", timeVal: 3.4, iters: "–", bestTime: true },
      { solver: "tiny-solver", cost: "1.1933e+04", costPer: "6.280e+02", time: "5.8 ± 0.1", timeVal: 5.8, iters: "–" },
      { solver: "Ceres", cost: "3.4865e+02", costPer: "1.835e+01", time: "11.5 ± 0.1", timeVal: 11.5, iters: "29" },
      { solver: "GTSAM", cost: "4.4154e+00", costPer: "2.324e-01", time: "77.2 ± 1.3", timeVal: 77.2, iters: "25", bestCost: true },
      { solver: "g2o", cost: "1.2571e+03", costPer: "6.616e+01", time: "46.6 ± 0.3", timeVal: 46.6, iters: "100" },
    ],
  },
  {
    dataset: "city10000",
    info: "10000 poses · 20687 edges",
    rows: [
      { solver: "apex-solver", cost: "4.4330e+00", costPer: "4.148e-04", time: "112.2 ± 0.4", timeVal: 112.2, iters: "5", bestTime: true },
      { solver: "factrs", cost: "4.4330e+00", costPer: "4.148e-04", time: "225.8 ± 2.0", timeVal: 225.8, iters: "–" },
      { solver: "tiny-solver", cost: "1.2237e+05", costPer: "1.145e+01", time: "1081.7 ± 5.0", timeVal: 1081.7, iters: "–" },
      { solver: "Ceres", cost: "1.8045e+04", costPer: "1.689e+00", time: "392.2 ± 2.2", timeVal: 392.2, iters: "27" },
      { solver: "GTSAM", cost: "4.3620e+00", costPer: "4.082e-04", time: "156.6 ± 1.3", timeVal: 156.6, iters: "6", bestCost: true },
      { solver: "g2o", cost: "4.4232e+02", costPer: "4.139e-02", time: "4192.6 ± 12.8", timeVal: 4192.6, iters: "100" },
    ],
  },
  {
    dataset: "ring",
    info: "434 poses · 459 edges",
    rows: [
      { solver: "apex-solver", cost: "3.0176e-02", costPer: "1.207e-03", time: "2.6 ± 0.1", timeVal: 2.6, iters: "5", bestTime: true },
      { solver: "factrs", cost: "3.0176e-02", costPer: "1.207e-03", time: "4.3 ± 0.0", timeVal: 4.3, iters: "–" },
      { solver: "tiny-solver", cost: "9.8712e+02", costPer: "3.948e+01", time: "20.6 ± 0.2", timeVal: 20.6, iters: "–" },
      { solver: "Ceres", cost: "2.2188e-02", costPer: "8.875e-04", time: "3.1 ± 0.0", timeVal: 3.1, iters: "14" },
      { solver: "GTSAM", cost: "2.2179e-02", costPer: "8.872e-04", time: "9.6 ± 0.4", timeVal: 9.6, iters: "6", bestCost: true },
      { solver: "g2o", cost: "2.2179e-02", costPer: "8.872e-04", time: "6.4 ± 0.0", timeVal: 6.4, iters: "34", bestCost: true },
    ],
  },
];

export const poseGraphSe3: PoseDataset[] = [
  {
    dataset: "sphere2500",
    info: "2500 poses · 4949 edges",
    rows: [
      { solver: "apex-solver", cost: "3.4912e+01", costPer: "1.426e-02", time: "141.3 ± 3.0", timeVal: 141.3, iters: "5" },
      { solver: "factrs", cost: "–", costPer: "–", time: "–", timeVal: null, iters: "✗" },
      { solver: "tiny-solver", cost: "4.0584e+04", costPer: "1.657e+01", time: "2048.9 ± 7.0", timeVal: 2048.9, iters: "–" },
      { solver: "Ceres", cost: "1.1654e+05", costPer: "4.759e+01", time: "1112.2 ± 6.9", timeVal: 1112.2, iters: "90" },
      { solver: "GTSAM", cost: "2.1291e+01", costPer: "8.694e-03", time: "88.8 ± 1.8", timeVal: 88.8, iters: "6", bestCost: true, bestTime: true },
      { solver: "g2o", cost: "6.4554e+01", costPer: "2.636e-02", time: "10893.4 ± 52.9", timeVal: 10893.4, iters: "84" },
    ],
  },
  {
    dataset: "parking-garage",
    info: "1661 poses · 6275 edges",
    rows: [
      { solver: "apex-solver", cost: "6.2809e-01", costPer: "1.361e-04", time: "41.2 ± 0.2", timeVal: 41.2, iters: "2" },
      { solver: "factrs", cost: "6.2777e-01", costPer: "1.361e-04", time: "440.9 ± 1.4", timeVal: 440.9, iters: "–" },
      { solver: "tiny-solver", cost: "1.2116e+05", costPer: "2.626e+01", time: "852.6 ± 7.9", timeVal: 852.6, iters: "–" },
      { solver: "Ceres", cost: "2.0103e+05", costPer: "4.357e+01", time: "267.8 ± 1.1", timeVal: 267.8, iters: "34" },
      { solver: "GTSAM", cost: "6.2456e-01", costPer: "1.354e-04", time: "28.3 ± 0.9", timeVal: 28.3, iters: "4", bestCost: true, bestTime: true },
      { solver: "g2o", cost: "6.2869e-01", costPer: "1.363e-04", time: "634.5 ± 2.3", timeVal: 634.5, iters: "56" },
    ],
  },
  {
    dataset: "torus3D",
    info: "5000 poses · 9048 edges",
    rows: [
      { solver: "apex-solver", cost: "1.2488e+02", costPer: "3.085e-02", time: "1941.5 ± 11.2", timeVal: 1941.5, iters: "38" },
      { solver: "factrs", cost: "–", costPer: "–", time: "–", timeVal: null, iters: "✗" },
      { solver: "tiny-solver", cost: "–", costPer: "–", time: "–", timeVal: null, iters: "✗" },
      { solver: "Ceres", cost: "2.3940e+04", costPer: "5.914e+00", time: "1006.1 ± 6.3", timeVal: 1006.1, iters: "38" },
      { solver: "GTSAM", cost: "1.2035e+02", costPer: "2.973e-02", time: "402.9 ± 2.0", timeVal: 402.9, iters: "10", bestCost: true, bestTime: true },
      { solver: "g2o", cost: "1.4131e+02", costPer: "3.491e-02", time: "31136.3 ± 67.6", timeVal: 31136.3, iters: "96" },
    ],
  },
  {
    dataset: "cubicle",
    info: "5750 poses · 16869 edges",
    rows: [
      { solver: "apex-solver", cost: "9.3491e+00", costPer: "8.408e-04", time: "347.2 ± 0.9", timeVal: 347.2, iters: "5", bestTime: true },
      { solver: "factrs", cost: "–", costPer: "–", time: "–", timeVal: null, iters: "✗" },
      { solver: "tiny-solver", cost: "9.9185e+03", costPer: "8.920e-01", time: "1982.1 ± 23.9", timeVal: 1982.1, iters: "–" },
      { solver: "Ceres", cost: "1.7144e+04", costPer: "1.542e+00", time: "955.3 ± 3.3", timeVal: 955.3, iters: "29" },
      { solver: "GTSAM", cost: "5.3761e+00", costPer: "4.835e-04", time: "369.8 ± 2.9", timeVal: 369.8, iters: "5", bestCost: true },
      { solver: "g2o", cost: "1.2771e+01", costPer: "1.149e-03", time: "8497.3 ± 5.7", timeVal: 8497.3, iters: "47" },
    ],
  },
];

export type BaRow = {
  solver: string;
  rmse: string;
  rmseVal: number | null;
  time: string;
  timeVal: number | null;
  iters: string;
  bestRmse?: boolean;
  bestTime?: boolean;
};

export type BaDataset = { dataset: string; info: string; rows: BaRow[] };

export const bundleAdjustment: BaDataset[] = [
  {
    dataset: "Ladybug",
    info: "1,723 cameras · 156,502 landmarks · 678,718 observations",
    rows: [
      { solver: "apex-solver", rmse: "0.8747", rmseVal: 0.8747, time: "21.0 ± 1.4", timeVal: 21.0, iters: "21" },
      { solver: "Ceres (iterative_schur)", rmse: "1.1676", rmseVal: 1.1676, time: "19.0 ± 1.8", timeVal: 19.0, iters: "101", bestTime: true },
      { solver: "GTSAM", rmse: "0.6372", rmseVal: 0.6372, time: "97.3 ± 0.4", timeVal: 97.3, iters: "16", bestRmse: true },
      { solver: "g2o", rmse: "13.5074", rmseVal: 13.5074, time: "150.8 ± 0.2", timeVal: 150.8, iters: "20" },
    ],
  },
  {
    dataset: "Trafalgar",
    info: "257 cameras · 65,132 landmarks · 225,911 observations",
    rows: [
      { solver: "apex-solver", rmse: "0.7728", rmseVal: 0.7728, time: "14.8 ± 1.0", timeVal: 14.8, iters: "21" },
      { solver: "Ceres (iterative_schur)", rmse: "1.3082", rmseVal: 1.3082, time: "45.6 ± 7.1", timeVal: 45.6, iters: "101" },
      { solver: "GTSAM", rmse: "0.6242", rmseVal: 0.6242, time: "14.1 ± 0.1", timeVal: 14.1, iters: "26", bestRmse: true, bestTime: true },
      { solver: "g2o", rmse: "8.1506", rmseVal: 8.1506, time: "16.2 ± 0.1", timeVal: 16.2, iters: "20" },
    ],
  },
  {
    dataset: "Dubrovnik",
    info: "356 cameras · 226,730 landmarks · 1,255,268 observations",
    rows: [
      { solver: "apex-solver", rmse: "0.7432", rmseVal: 0.7432, time: "94.7 ± 5.9", timeVal: 94.7, iters: "21" },
      { solver: "Ceres (iterative_schur)", rmse: "1.0036", rmseVal: 1.0036, time: "78.4 ± 6.7", timeVal: 78.4, iters: "101" },
      { solver: "GTSAM", rmse: "0.5476", rmseVal: 0.5476, time: "74.4 ± 0.3", timeVal: 74.4, iters: "29", bestRmse: true },
      { solver: "g2o", rmse: "12.1678", rmseVal: 12.1678, time: "34.7 ± 0.1", timeVal: 34.7, iters: "20", bestTime: true },
    ],
  },
  {
    dataset: "Venice",
    info: "1,778 cameras · 993,923 landmarks · 5,001,946 observations",
    rows: [
      { solver: "apex-solver", rmse: "0.7451", rmseVal: 0.7451, time: "19.2 ± 1.5", timeVal: 19.2, iters: "2", bestRmse: true, bestTime: true },
      { solver: "Ceres (iterative_schur)", rmse: "TIMEOUT", rmseVal: null, time: "TIMEOUT", timeVal: null, iters: "–" },
      { solver: "GTSAM", rmse: "TIMEOUT", rmseVal: null, time: "TIMEOUT", timeVal: null, iters: "–" },
      { solver: "g2o", rmse: "10.1261", rmseVal: 10.1261, time: "245.7 ± 0.6", timeVal: 245.7, iters: "20" },
    ],
  },
];

export type SchurRow = {
  config: string;
  rmse: string;
  time: string;
  timeVal: number | null;
  iters: string;
  rel: string;
  fastest?: boolean;
};

export type SchurDataset = { dataset: string; rows: SchurRow[] };

export const schurComparison: SchurDataset[] = [
  {
    dataset: "Ladybug",
    rows: [
      { config: "ExplicitSparseSchur / Sparse", rmse: "0.874205", time: "64.56 ± 0.19", timeVal: 64.56, iters: "21", rel: "1.00×" },
      { config: "ExplicitSparseSchur / Chunked", rmse: "0.874205", time: "91.35 ± 0.72", timeVal: 91.35, iters: "21", rel: "1.42×" },
      { config: "ExplicitSparseSchur / Iterative", rmse: "0.874795", time: "32.31 ± 1.07", timeVal: 32.31, iters: "21", rel: "0.50×" },
      { config: "ImplicitSparseSchur", rmse: "0.874681", time: "19.59 ± 0.74", timeVal: 19.59, iters: "21", rel: "0.30×", fastest: true },
    ],
  },
  {
    dataset: "Trafalgar",
    rows: [
      { config: "ExplicitSparseSchur / Sparse", rmse: "0.779496", time: "3.28 ± 0.07", timeVal: 3.28, iters: "11", rel: "1.00×", fastest: true },
      { config: "ExplicitSparseSchur / Chunked", rmse: "0.779496", time: "6.07 ± 0.04", timeVal: 6.07, iters: "11", rel: "1.85×" },
      { config: "ExplicitSparseSchur / Iterative", rmse: "0.770103", time: "7.04 ± 0.14", timeVal: 7.04, iters: "21", rel: "2.15×" },
      { config: "ImplicitSparseSchur", rmse: "0.772831", time: "13.36 ± 0.18", timeVal: 13.36, iters: "21", rel: "4.07×" },
    ],
  },
  {
    dataset: "Dubrovnik",
    rows: [
      { config: "ExplicitSparseSchur / Sparse", rmse: "0.743998", time: "25.36 ± 0.44", timeVal: 25.36, iters: "10", rel: "1.00×", fastest: true },
      { config: "ExplicitSparseSchur / Chunked", rmse: "0.743998", time: "52.20 ± 0.92", timeVal: 52.2, iters: "10", rel: "2.06×" },
      { config: "ExplicitSparseSchur / Iterative", rmse: "0.743206", time: "54.32 ± 1.58", timeVal: 54.32, iters: "21", rel: "2.14×" },
      { config: "ImplicitSparseSchur", rmse: "0.743193", time: "87.37 ± 1.91", timeVal: 87.37, iters: "21", rel: "3.44×" },
    ],
  },
  {
    dataset: "Venice",
    rows: [
      { config: "ExplicitSparseSchur / Sparse", rmse: "0.736946", time: "54.89 ± 3.37", timeVal: 54.89, iters: "2", rel: "1.00×" },
      { config: "ExplicitSparseSchur / Chunked", rmse: "0.736946", time: "64.06 ± 1.30", timeVal: 64.06, iters: "2", rel: "1.17×" },
      { config: "ExplicitSparseSchur / Iterative", rmse: "0.745048", time: "43.91 ± 1.32", timeVal: 43.91, iters: "2", rel: "0.80×" },
      { config: "ImplicitSparseSchur", rmse: "0.745052", time: "15.90 ± 0.07", timeVal: 15.9, iters: "2", rel: "0.29×", fastest: true },
    ],
  },
];
