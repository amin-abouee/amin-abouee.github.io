// Detail-page content for the three workspace crates, transcribed from their
// READMEs and source trees (checked against Cargo.toml + src/ exports):
//   apex-camera-models 0.4.0 · apex-manifolds 0.4.0 · apex-io 0.5.0.
// NOTE: apex-io's README still says 0.4.0; the crate is at 0.5.0 (CHANGELOG
// "Unreleased" section documents the VRS / ROS 1–2 overhaul and bag_merge).

export type CrateSection = {
  heading: string;
  intro?: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type CratePage = {
  title: string;
  tagline: string;
  version: string;
  links: { label: string; href: string }[];
  overview: string[];
  features: { title: string; detail: string }[];
  sections: CrateSection[];
};

const repo = "https://github.com/amin-abouee/apex-solver/tree/main/crates";

export const apexCrates: Record<string, CratePage> = {
  "apex-camera-models": {
    title: "apex camera models",
    tagline:
      "Comprehensive camera projection models for bundle adjustment, SLAM and structure-from-motion — every model with analytic Jacobians.",
    version: "0.4.0",
    links: [
      { label: "Source", href: `${repo}/apex-camera-models` },
      { label: "Cookbook", href: `${repo}/apex-camera-models/doc/cookbook` },
      { label: "crates.io", href: "https://crates.io/crates/apex-camera-models" },
      { label: "docs.rs", href: "https://docs.rs/apex-camera-models" },
    ],
    overview: [
      "A collection of camera projection models used in bundle adjustment, visual SLAM, visual odometry and structure-from-motion. Every model implements the same CameraModel trait — projection, unprojection, analytic point / pose / intrinsic Jacobians and parameter validation — so geometries can be swapped without touching the optimizer.",
      "Models follow the standard computer-vision RDF frame (+Z forward) except the BAL Pinhole family, which uses the Bundler convention (-Z forward). Each model's source file links to the matching cookbook chapter, which is the canonical source for projection equations, inverse-projection strategies, parameter layouts and validity conditions.",
    ],
    features: [
      {
        title: "Analytic Jacobians",
        detail:
          "Every model provides exact derivatives: point ∂(u,v)/∂(x,y,z), pose ∂(u,v)/∂(pose) for SE(3) optimization, and intrinsic ∂(u,v)/∂(camera_params).",
      },
      {
        title: "Compile-time optimization presets",
        detail:
          "Const-generic presets pick what is optimized: BundleAdjustment, SelfCalibration, OnlyPose, OnlyLandmarks, OnlyIntrinsics — no runtime branching in the hot path.",
      },
      {
        title: "Conversion between models",
        detail:
          "Exact From impls for Kannala-Brandt → Fisheye62/624 and Fisheye62 → Fisheye624; for any other pair, convert_camera fits the target parameters to the source rays and reports RMS reprojection error in pixels.",
      },
      {
        title: "Structured, typed errors",
        detail:
          "One CameraModelError enum whose variants carry the actual values — FocalLengthNotPositive { fx, fy }, PointBehindCamera { z, min_z }, DenominatorTooSmall { denom, threshold }.",
      },
      {
        title: "Projection-domain geometry (0.4.0)",
        detail:
          "projection_deficit returns the signed depth deficit of a camera-frame point outside a model's domain, with its gradient. Domain geometry is explicit per model (z-forward default, BAL z-backward, double-sphere cone); Kannala-Brandt unprojection now rejects out-of-domain and non-converged rays.",
      },
      {
        title: "Comprehensive validation",
        detail:
          "Runtime checks for focal length finiteness and positivity, principal-point validity and model-specific ranges (UCM α ∈ [0,1], Double Sphere α ∈ [0,1], EUCM β > 0).",
      },
    ],
    sections: [
      {
        heading: "Supported camera models",
        intro:
          "Twelve models across pinhole, distortion, fisheye and omnidirectional families — parameter counts are the packed intrinsic vectors consumed by the intrinsic Jacobian.",
        columns: ["Model", "Params", "FOV", "Distortion", "Typical use"],
        rows: [
          ["Pinhole", "4", "~60°", "none (fx, fy, cx, cy)", "standard perspective cameras, initial estimates"],
          ["BAL Pinhole", "6", "~60°", "radial k1, k2; camera looks down −Z", "BAL datasets"],
          ["BAL Pinhole Strict", "3", "~60°", "radial; fx = fy = f, cx = cy = 0", "Bundler-compatible bundle adjustment"],
          ["RadTan", "9", "~100°", "radial k1‑k3 + tangential p1, p2", "OpenCV / Brown–Conrady, most standard cameras"],
          ["Kannala-Brandt", "8", "~180°", "polynomial θ + k1θ³ + k2θ⁵ + k3θ⁷ + k4θ⁹", "GoPro / action cameras, OpenCV fisheye"],
          ["Fisheye62", "12", "~180°", "radial k0‑k5 + tangential p0, p1", "Project Aria fisheye cameras"],
          ["Fisheye624", "16", "~180°", "Fisheye62 + thin-prism s0‑s3 (Aria: one focal, 15 entries)", "Project Aria SLAM/RGB, LaMAria dataset"],
          ["FOV", "5", "variable (ω)", "atan-based, ω controls the field of view", "wide-angle SLAM"],
          ["UCM", "5", "> 90°", "unified sphere (α)", "catadioptric and wide-FOV cameras"],
          ["EUCM", "6", "> 180°", "extended unified (α, β)", "high-distortion fisheye, more accurate than UCM"],
          ["Double Sphere", "6", "> 180°", "two-sphere (ξ, α)", "omnidirectional — best accuracy at extreme FOV"],
          ["F-Theta", "6", "up to 220°", "f(θ) = k1θ + k2θ² + k3θ³ + k4θ⁴; k1 is pixels/radian", "automotive surround-view, NVIDIA DriveWorks"],
        ],
        note:
          "Simpler models (Pinhole, RadTan) have faster Jacobians; omnidirectional models need the most careful numerical handling — Double Sphere trades cost for accuracy at extreme FOV.",
      },
      {
        heading: "Optimization presets",
        intro: "Compile-time const-generic presets decide which parameter blocks the solver differentiates.",
        columns: ["Preset", "Optimizes", "Use"],
        rows: [
          ["BundleAdjustment", "pose + landmarks (fixed intrinsics)", "standard SfM / BA"],
          ["SelfCalibration", "pose + landmarks + intrinsics", "calibration-aware bundle adjustment"],
          ["OnlyPose", "pose only (fixed landmarks, fixed intrinsics)", "visual odometry"],
          ["OnlyLandmarks", "landmarks only (known poses)", "triangulation"],
          ["OnlyIntrinsics", "intrinsics only (known structure)", "camera calibration"],
        ],
      },
    ],
  },

  "apex-manifolds": {
    title: "apex manifolds",
    tagline:
      "Lie group manifolds — SE(2), SE(3), SO(2), SO(3), SE₂(3), SGal(3), Sim(3) and Rⁿ — with analytic Jacobians for nonlinear optimization.",
    version: "0.4.0",
    links: [
      { label: "Source", href: `${repo}/apex-manifolds` },
      { label: "Cookbook", href: `${repo}/apex-manifolds/doc/cookbook` },
      { label: "crates.io", href: "https://crates.io/crates/apex-manifolds" },
      { label: "docs.rs", href: "https://docs.rs/apex-manifolds" },
    ],
    overview: [
      "Efficient implementations of the Lie groups used across robotics and computer vision, following the conventions of the manif C++ library: rigid-body transforms for poses, rotations for orientation tracking, velocity-augmented groups for IMU preintegration, similarity transforms for monocular SLAM with unknown scale, and Euclidean vectors for landmarks and calibration parameters.",
      "Every operation — exp/log, compose, inverse, act, ⊞/⊟, adjoint — returns analytic Jacobians on request, with both right and left perturbation models. Storage is fixed and documented: w-first (Hamilton) quaternions, [ρ, θ] twists, and contiguous tangent vectors for the optimizer.",
    ],
    features: [
      {
        title: "Analytic Jacobians everywhere",
        detail:
          "plus / minus / compose / act / inverse / log accept optional mutable Jacobian outputs — exact derivatives, no numerical differentiation on the hot path.",
      },
      {
        title: "Right & left perturbation models",
        detail:
          "Right: g ⊞ δ = g ∘ exp(δ), g₁ ⊟ g₂ = log(g₂⁻¹ ∘ g₁). Left: δ ⊞ g = exp(δ) ∘ g, g₁ ⊟ g₂ = log(g₁ ∘ g₂⁻¹).",
      },
      {
        title: "manif-compatible conventions",
        detail:
          "w-first quaternions, [ρ, θ] twist layout and the shared conventions page keep the storage format identical across all groups and documented in one place.",
      },
      {
        title: "Numerical stability",
        detail:
          "A small-angle threshold (1e-10) guards every Taylor expansion, avoiding catastrophic cancellation in sin(θ)/θ and (1−cos θ)/θ² near zero — consistent with Sophus and GTSAM.",
      },
      {
        title: "0.4.0 correctness round",
        detail:
          "SE(3)/SE₂(3) right Jacobians corrected to the right convention, SGal(3) exponential (time–velocity coupling) and adjoint fixed, Sim(3) action/adjoint/Jacobian differentials fixed, SO3::log small-angle sign fixed, Rn between-Jacobian dimension fixed; SO3::slerp and a checked quaternion constructor added.",
      },
      {
        title: "Compile-time group capabilities",
        detail:
          "Factors state what the mathematics requires (G: ActsOnPoints3) instead of checking group names at runtime — a group that cannot do the job fails to compile.",
      },
    ],
    sections: [
      {
        heading: "Supported manifolds",
        intro: "Eight groups cover 2D/3D pose estimation, inertial state estimation and Euclidean parameter blocks.",
        columns: ["Manifold", "Description", "DOF", "Rep (scalars)", "Use case"],
        rows: [
          ["SE(3)", "3D rigid transformations", "6", "7 (quat + translation)", "3D SLAM, visual odometry, bundle adjustment"],
          ["SO(3)", "3D rotations (unit quaternion, w-first)", "3", "4", "orientation tracking, IMU integration"],
          ["SE(2)", "2D rigid transformations", "3", "4 (angle + translation)", "2D SLAM, mobile robotics"],
          ["SO(2)", "2D rotations (unit complex number)", "1", "2 (cos, sin)", "2D orientation, bearing-only SLAM"],
          ["SE₂(3)", "3D pose + velocity", "9", "10 (quat + translation + velocity)", "visual-inertial odometry, IMU preintegration"],
          ["SGal(3)", "Galilean group — pose + velocity + time", "10", "11", "inertial navigation, time-coupled kinematics"],
          ["Sim(3)", "similarity transforms — pose + scale", "7", "8 (quat + translation + scale)", "monocular SLAM, SfM with unknown scale"],
          ["Rⁿ", "Euclidean vector space", "n", "n", "landmarks, camera intrinsics, calibration"],
        ],
        note:
          "Group action: SE(2)/SE(3) x → Rx + t; Sim(3) x → λRx + t; SO(2)/SO(3) x → Rx; SGal(3) x → Rx + t + sv.",
      },
      {
        heading: "Lie-group operations",
        intro: "Uniform API across all eight groups; every operation that can produce Jacobians takes optional outputs.",
        columns: ["Method", "Description", "Jacobians"],
        rows: [
          ["identity()", "identity element", "—"],
          ["random()", "random group element", "—"],
          ["inverse(jac)", "group inverse g⁻¹", "∂g⁻¹/∂g"],
          ["compose(other, jl, jr)", "composition g₁ ∘ g₂", "∂/∂g₁, ∂/∂g₂"],
          ["log(jac)", "logarithmic map (group → algebra)", "∂log(g)/∂g"],
          ["act(v, jg, jv)", "group action g ⊙ v", "∂/∂g, ∂/∂v"],
          ["plus(δ, jg, jδ)", "right plus g ⊞ δ", "∂/∂g, ∂/∂δ"],
          ["minus(other, j1, j2)", "right minus g₁ ⊟ g₂", "∂/∂g₁, ∂/∂g₂"],
          ["between(other, j1, j2)", "relative transform g₁⁻¹ ∘ g₂", "∂/∂g₁, ∂/∂g₂"],
          ["adjoint()", "adjoint Ad(g)", "—"],
          ["normalize()", "project back onto the manifold", "—"],
          ["is_valid(tol)", "check group constraints", "—"],
        ],
      },
      {
        heading: "Tangent-space operations",
        columns: ["Method", "Description"],
        rows: [
          ["exp(jac)", "exponential map (algebra → group)"],
          ["right_jacobian() / left_jacobian()", "right / left Jacobian Jr, Jl"],
          ["right_jacobian_inv() / left_jacobian_inv()", "inverse Jacobians Jr⁻¹, Jl⁻¹"],
          ["hat()", "hat operator (tangent vector → matrix)"],
          ["zero()", "zero tangent vector"],
          ["random()", "random tangent vector"],
        ],
      },
    ],
  },

  "apex-io": {
    title: "apex io",
    tagline:
      "High-performance, unsafe-free I/O for robotics data — pose graphs, ROS 1/2 bags, VRS recordings and trajectories behind one streaming API.",
    version: "0.5.0",
    links: [
      { label: "Source", href: `${repo}/apex-io` },
      { label: "Cookbook", href: `${repo}/apex-io/doc/cookbook` },
      { label: "crates.io", href: "https://crates.io/crates/apex-io" },
      { label: "docs.rs", href: "https://docs.rs/apex-io" },
    ],
    overview: [
      "File I/O for the data robotics actually produces: pose graphs (G2O, TORO, BAL), ROS 1 .bag files, ROS 2 bags (SQLite3 and MCAP storage), Meta VRS / Project Aria recordings, and TUM / ASL-EuRoC trajectories — with topic and time-range filtering, raw and deserialized APIs, and a schema-driven ROS 1 ⇄ ROS 2 transcoder that needs no typed message structs.",
      "The crate has been unsafe-free since 0.2.0: the four memmap2 sites became buffered whole-file reads (one allocation, no page-fault overhead, no soundness footgun), and large files are parsed in parallel with rayon. Since 0.5.0 a format-agnostic BagReader / BagIterator gives one pull API over every container, so a VIO front end can keep state between samples, and a bag_merge tool joins recordings.",
    ],
    features: [
      {
        title: "One streaming API over every container",
        detail:
          "BagReader / BagWriter / for_each / iter span ROS 1 .bag, ROS 2 sqlite3, ROS 2 MCAP directories, bare .mcap (ROS 1 or ROS 2 profile) and VRS — time-ordered with bounded memory.",
      },
      {
        title: "Every standard message, ROS 1 ⇄ ROS 2",
        detail:
          "A schema-driven transcoder re-encodes payloads for any type with a definition (embedded in the bag, or from a built-in catalog of 168 standard types), without typed structs; byte arrays such as images are block-copied.",
      },
      {
        title: "Safe, fast I/O",
        detail:
          "No unsafe, no memory mapping: single-syscall buffered reads for every loader, rayon parallel parsing above 1,000 lines, raw message APIs that skip CDR deserialization, and metadata-only bag opening.",
      },
      {
        title: "VRS / Project Aria (vrs feature)",
        detail:
          "A from-scratch safe-Rust reader and writer for Meta's VRS container, cross-checked against projectaria-tools; opening a 20 GB file reads only header, tags and index. Typed AriaRecording for IMU, baro, GPS and JPEG camera frames, plus LaMAria calibration and ground-truth readers.",
      },
      {
        title: "Trajectories",
        detail:
          "Unified timestamped-pose container with format detection: TUM read/write, TUM-with-nanosecond-timestamps (LaMAria pGT) and ASL/EuRoC ground truth via load_trajectory, TumLoader, TumNanosLoader and AslTrajectoryLoader.",
      },
      {
        title: "Live DDS subscription (dds feature)",
        detail:
          "Async topic listener for running ROS 2 systems with configurable QoS; ROS 2 topic names are converted to DDS names automatically (rt/...).",
      },
      {
        title: "Twelve CLI binaries",
        detail:
          "Inspect, filter, convert, merge and verify bags; export topics to CSV/PNG; generate demo bags; download benchmark datasets; dump VRS — all interoperable with the ros2 bag CLI.",
      },
    ],
    sections: [
      {
        heading: "Supported formats and files",
        columns: ["Format", "Read", "Write", "Notes"],
        rows: [
          ["G2O", "✓", "✓", "SE(2) and SE(3) pose graphs"],
          ["TORO", "✓", "✓", "SE(2) only — writing SE(3) is an error"],
          ["BAL", "✓", "—", "Bundle Adjustment in the Large (Bundler)"],
          ["ROS 1 .bag", "✓", "✓", "ROS 1 profile, arbitrary messages"],
          ["ROS 2 bag / SQLite3", "✓", "✓", ".db3 storage, 32 KiB pages"],
          ["ROS 2 bag / MCAP", "✓", "✓", "directory or bare .mcap; zstd, lz4, bz2"],
          ["VRS (Project Aria)", "✓", "✓", "vrs feature — safe-Rust reader + writer"],
          ["TUM trajectory", "✓", "✓", "timestamp tx ty tz qx qy qz qw"],
          ["TUM-nanos (LaMAria pGT)", "✓", "—", "integer-nanosecond timestamps"],
          ["ASL / EuRoC", "✓", "—", "dataset and ground-truth CSV loaders"],
        ],
        note:
          "Auto-detection: load_graph picks G2oLoader or ToroLoader from the extension; BagReader::open picks the container from file or directory layout.",
      },
      {
        heading: "Feature flags",
        columns: ["Feature", "Default", "Enables", "Extra dependencies"],
        rows: [
          ["download", "✓", "dataset auto-download (download_file, ensure_*_dataset, download_datasets)", "ureq, bzip2, flate2, tar"],
          ["cli", "✓", "CLI parsing for the clap-based binaries", "clap"],
          ["rosbag", "✗", "ROS 1/2 bag read/write, every bag_* tool", "rusqlite, mcap, zstd, lz4_flex, serde_norway, byteorder, hex, bzip2, md5, crc32fast"],
          ["vrs", "✗", "VRS reader/writer, vrs_* tools, VRS in the bag_* tools", "zstd, lz4_flex"],
          ["dds", "✗", "live DDS subscription, dds_multi_listener", "rustdds, tokio, futures"],
          ["visualization", "✗", "to_rerun_* conversions for SE2/SE3 vertices", "rerun"],
          ["asl-async", "✗", "async ASL/EuRoC streaming", "tokio"],
        ],
      },
      {
        heading: "CLI binaries",
        columns: ["Binary", "What it does", "Requires"],
        rows: [
          ["bag_info", "container, size, duration and per-topic table — index/summary only, never decodes messages", "rosbag"],
          ["bag_filter", "stream-copy any container with topic/time filtering and compression; memory independent of bag size", "rosbag, cli"],
          ["bag_convert", "ROS 1 ⇄ ROS 2 (or bare MCAP), re-encoding each topic from its message definition", "rosbag, cli"],
          ["bag_merge", "merge several bags into one", "rosbag, cli"],
          ["bag_verify", "digest per (timestamp, canonical CDR), so container/encoding/seq differences are ignored", "rosbag, cli"],
          ["extract_topic_data", "export any topic to CSV, image topics to PNG frames", "rosbag"],
          ["write_dummy_bag", "generate a demo bag with 29+ message types", "rosbag"],
          ["download_datasets", "fetch the G2O, TORO and BAL benchmark datasets", "download, cli"],
          ["dds_multi_listener", "live multi-topic DDS listener for a running ROS 2 system", "dds"],
          ["vrs_info", "VRS streams, rates, tags; --verify-index checks the record chain", "vrs, cli"],
          ["vrs_copy", "trim a VRS recording by stream/time and re-compress", "vrs, cli"],
          ["vrs_dump", "IMU/baro/GPS to CSV, JPEG extraction for cameras", "vrs, cli"],
        ],
      },
      {
        heading: "Crate modules",
        columns: ["Module", "Contents"],
        rows: [
          ["graph", "Graph, VertexSE2/SE3, EdgeSE2/SE3, GraphLoader trait, G2oLoader, ToroLoader, auto-detect load_graph, IoError"],
          ["bal", "BalLoader, BalDataset, BalCamera, BalPoint, BalObservation"],
          ["rosbag", "Reader / Writer, StoragePlugin (Sqlite3 | Mcap), CDR, QoS, message types, ROS 1 and ROS 2 backends"],
          ["rosbag::transcode", "schema-driven ROS 1 ⇄ ROS 2 transcoder and built-in message catalog"],
          ["vrs", "VrsReader, VrsWriter, LayoutWriter, Cursor; aria::AriaRecording with IMU/baro/GPS/JPEG access"],
          ["trajectory", "Trajectory, TrajectoryFormat (Tum | TumNanos | Asl), TumLoader, load_trajectory"],
          ["asl", "AslDataset, CameraFrame, ImuMeasurement, GroundTruthPose, AslTrajectoryLoader"],
          ["lamaria", "Calibration for LaMAria aria_calibrations JSON (cameras, IMU, T_body_sensor)"],
          ["utils", "download_file, decompress_bzip2, extract_tar_gz, ensure_*_dataset, embedded datasets.toml"],
        ],
      },
      {
        heading: "Performance",
        columns: ["Technique", "Applied to"],
        rows: [
          ["single-syscall buffered read", "all loaders — replaced memmap2 in 0.2.0, safe and page-fault-free"],
          ["parallel parsing (rayon)", "files above 1,000 lines"],
          ["raw message API", "bag reading without CDR deserialization"],
          ["batch read", "read_raw_messages_batch — single allocation, no iterator overhead"],
          ["metadata-only path", "read_bag_metadata_fast — zero storage-file I/O"],
          ["tail-first lazy index (ROS 1)", "open 2.8 ms → 0.05 ms; 2 s window read −92%"],
          ["order-preserving parallel chunk compression", "MCAP zstd writes ~2.5× faster; peak memory 335 → 68 MiB"],
        ],
      },
    ],
  },
};
