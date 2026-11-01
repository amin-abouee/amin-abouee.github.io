import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Amin Abouee",
  initials: "AA",
  url: "https://aabouee.github.io",
  location: "Erfurt, Germany",
  locationLink: "https://www.google.com/maps/place/Erfurt,+Germany",
  description:
    "Senior Robotics & Computer Vision Engineer — SLAM, visual-inertial odometry and state estimation for autonomous systems.",
  summary:
    "I am a robotics and computer vision engineer with 10+ years of experience building real-time autonomy and perception stacks for autonomous vehicles and robotic platforms across aerial, ground, and automotive domains. My work focuses on optimization-based SLAM, visual-inertial odometry (VIO), 3D mapping, re-localization and obstacle avoidance — shipped in production C++ on NVIDIA Jetson with ROS 2, from automotive surround perception to AR tracking and UAV navigation.\n\nAlongside that, I am building APEX, my personal open source project: a growing family of Rust crates for nonlinear least squares estimation, from bundle adjustment and pose graph optimization to camera models, Lie group manifolds and robotics data input and output. It turns my hands on experience with nonlinear least squares, robust losses and manifold aware optimization into libraries others can use. My interests sit between geometry, nonlinear optimization and learning based methods: making state estimation more accurate, efficient, and deployable on resource constrained platforms.",
  avatarUrl: "/me.jpg",
  skills: [
    { name: "C++ (11–20)" },
    { name: "Rust" },
    { name: "Python" },
    { name: "CUDA" },
    { name: "PyTorch" },
    { name: "OpenCV" },
    { name: "Eigen" },
    { name: "PCL" },
    { name: "Ceres Solver" },
    { name: "GTSAM" },
    { name: "ROS 2" },
    { name: "DDS" },
    { name: "Docker" },
    { name: "Linux" },
    { name: "NVIDIA Jetson Orin" },
    { name: "Git & CI/CD" },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "amin.abouee@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/amin-abouee",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/amin-abouee-26aa665b/",
        icon: Icons.linkedin,
        navbar: true,
      },
    },
  },
  work: [
    {
      company: "Quantum Systems (acquired Spleenlab GmbH)",
      badges: [],
      location: "Jena, Germany",
      title: "SLAM / State Estimation Expert — Senior Researcher and Developer",
      logoUrl: "/logos/spleenlab.png",
      start: "Nov 2021",
      end: null,
      videos: [],
      highlights: [
        {
          title: "Visual-IMU-LiDAR SLAM for a UGV",
          description:
            "Engineered a multi-sensor SLAM system for an unmanned ground vehicle, fusing camera, IMU and LiDAR with place recognition to sustain accurate, drift-free localization in visually repetitive, GPS-denied terrain.",
          src: "",
        },
        {
          title: "Production visual-inertial odometry",
          description:
            "Architected a production-grade optimization-based VIO system in modern C++, deployed on NVIDIA Jetson Orin under Docker with ROS 2 and DDS middleware, delivering reliable autonomous navigation in GNSS-denied environments.",
          src: "",
        },
        {
          title: "3D reconstruction and obstacle avoidance (Airbus)",
          description:
            "Contributed to a shared project with Airbus, fusing VIO estimates with depth and mapping data for 3D scene reconstruction and safe perception-driven maneuvering under real-time compute constraints.",
          src: "",
        },
        {
          title: "Semi-supervised visual odometry",
          description:
            "Built a semi-supervised deep visual odometry pipeline in Python and CUDA, combining learning-based feature extraction with differentiable bundle adjustment on embedded hardware. The CVPRW 2024 paper trains it on estimated optical flow — only pose ground truth and raw images, no dense depth — and reports state-of-the-art KITTI results.",
          src: "/videos/02_slam_pointcloud_map.mp4",
        },
      ],
      description:
        "Multi-sensor localization and mapping for an unmanned ground vehicle. Four focus areas below.",
    },
    {
      company: "Denso ADAS",
      badges: [],
      location: "Lindau, Germany",
      title: "Computer Vision Expert — Researcher and Developer",
      logoUrl: "/logos/denso-adas.png",
      start: "Mar 2020",
      end: "Sep 2021",
      videos: [],
      highlights: [],
      description:
        "Designed a multilayer hybrid visual SLAM system combining CNN-based relative pose and depth estimation with photometric bundle adjustment.",
    },
    {
      company: "ART GmbH",
      badges: [],
      location: "Weilheim in Oberbayern, Germany",
      title: "Computer Vision Expert — Researcher and Developer",
      logoUrl: "/logos/art.png",
      start: "Nov 2015",
      end: "Feb 2020",
      videos: [
        {
          title: "Multi-camera feature & featureless tracking",
          description:
            "A multi-camera AR setup: the C++ tracker fuses frames from the calibrated cameras to estimate 6-DoF pose, overlays the CAD model on the live view (video in video) and streams pose updates on the console. Tracking runs on feature correspondences when texture is available and switches to featureless alignment when it is not.",
          src: "/videos/modular-tracking.mp4",
        },
        {
          title: "Modular C++ tracker",
          description:
            "The tracking library is deliberately modular — feature-based, model-based and edge-based tracker components are interchangeable behind a common 6-DoF estimation loop. The clip stitches together the full run and the interim status (German: \"Zwischenstand\"), holding pose on a sheet-metal car part.",
          src: "/videos/inside-out-weak-texture.mp4",
        },
        {
          title: "Textureless, edge-based tracking",
          description:
            "Objects without surface texture — printed plans, uncoated parts — are tracked purely on their edges and contours, inside out: the camera moves freely while CAD modules of an industrial plant stay anchored to the plan. No markers, no fiducials.",
          src: "/videos/multi-camera-video-in-video.mp4",
        },
      ],
      highlights: [],
      description:
        "Developed a real-time C++ tracking library for 6-DoF pose estimation, with multiple alignment strategies and motion models, deployed in commercial AR products. The architecture was deliberately modular: tracker components are interchangeable, so model-based and feature-based tracking could be combined per use case. Three focus areas below.",
    },
  ],
  education: [
    {
      school: "Technical University of Munich",
      href: "https://www.tum.de",
      degree: "M.Sc. Computer Science, Mathematics and Informatics",
      logoUrl: "/logos/tum.png",
      start: "2011",
      end: "2015",
    },
    {
      school: "Islamic Azad University of Mashhad",
      href: "https://mshdiau.ac.ir",
      degree: "B.Sc. Computer Engineering",
      logoUrl: "/logos/iau-mashhad.png",
      start: "2006",
      end: "2010",
    },
  ],
  projects: [
    {
      title: "apex solver",
      href: "/projects/apex-solver",
      dates: "2025 - Present",
      active: true,
      description:
        "High-performance nonlinear least-squares solver in pure Rust for factor-graph optimization — bundle adjustment, pose-graph optimization and sensor fusion. Manifold-aware Lie groups with analytic Jacobians, ~40 factors, explicit & implicit (matrix-free) Schur solvers. Fastest on 5 of 8 pose-graph benchmarks vs Ceres, GTSAM, g2o, factrs and tiny-solver; only solver besides g2o to finish the 5 M-observation Venice BA within the time limit. **Details & benchmarks →**",
      technologies: [
        "Rust",
        "Nonlinear Optimization",
        "Factor Graphs",
        "SLAM",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/amin-abouee/apex-solver",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/apex-solver-icon-light.jpg",
      imageDark: "/apex-solver-icon-dark.jpg",
      video: "",
    },
    {
      title: "apex slam",
      href: "/projects/apex-slam",
      dates: "2025 - Present",
      active: true,
      description:
        "Personal SLAM stack, still in development: visual-inertial odometry (monocular and stereo), LiDAR-inertial odometry and LiDAR-inertial-visual odometry on one factor-graph core. Stereo VIO reaches 0.030 m ATE on the TUM VI rooms; the LiDAR modes lead the compared systems on the Hilti 2023 handheld score. **Details & benchmarks →**",
      technologies: [
        "Rust",
        "Visual-Inertial SLAM",
        "LiDAR-Inertial",
        "Sensor Fusion",
      ],
      links: [],
      image: "/apex-slam-icon-light.jpg",
      imageDark: "/apex-slam-icon-dark.jpg",
      video: "",
    },
    {
      title: "apex camera models",
      href: "/projects/apex-camera-models",
      dates: "2025 - Present",
      active: true,
      description:
        "Nine camera projection models — pinhole, Brown–Conrady/RadTan, double-sphere, EUCM, UCM, FOV, f-theta, Kannala-Brandt and BAL — with analytic projection, unprojection and Jacobians; distortion handled at projection time, no rectification by design. Includes a converter/undistort CLI for fisheye and wide-angle calibrations. [Read more on GitHub →](https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-camera-models)",
      technologies: ["Rust", "Computer Vision", "Camera Models"],
      links: [
        {
          type: "Source",
          href: "https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-camera-models",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/apex-camera-models-icon-light.jpg",
      imageDark: "/apex-camera-models-icon-dark.jpg",
      video: "",
    },
    {
      title: "apex manifolds",
      href: "/projects/apex-manifolds",
      dates: "2025 - Present",
      active: true,
      description:
        "Lie group manifolds — SE(2), SE(3), SO(2), SO(3), SE₂(3), SGal(3), Sim(3) and Rⁿ — with analytic Jacobians, exp/log maps, adjoints and ⊞/⊟ operators, following manif conventions (w-first quaternions, [ρ, θ] twists). 0.4.0 ships a corrected SE(3)/SE₂(3) right-Jacobian calculus and SO3::slerp. [Read more on GitHub →](https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-manifolds)",
      technologies: ["Rust", "Lie Groups", "State Estimation"],
      links: [
        {
          type: "Source",
          href: "https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-manifolds",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/apex-manifolds-icon-light.jpg",
      imageDark: "/apex-manifolds-icon-dark.jpg",
      video: "",
    },
    {
      title: "apex io",
      href: "/projects/apex-io",
      dates: "2025 - Present",
      active: true,
      description:
        "`unsafe`-free I/O for robotics data: pose graphs (G2O, TORO, BAL), ROS 2 bag reading and writing (SQLite3 + MCAP) with ROS 1 ⇄ ROS 2 transcoding, live DDS subscription and a unified TUM/ASL trajectory loader — plus seven CLI binaries. [Read more on GitHub →](https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-io)",
      technologies: ["Rust", "ROS 2", "Data Pipelines"],
      links: [
        {
          type: "Source",
          href: "https://github.com/amin-abouee/apex-solver/tree/main/crates/apex-io",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/apex-io-icon-light.jpg",
      imageDark: "/apex-io-icon-dark.jpg",
      video: "",
    },
  ],
  publications: [
    {
      title: "Weakly Supervised End2End Deep Visual Odometry",
      dates: "CVPR Workshops 2024",
      location: "pp. 858–865",
      description:
        "A. Abouee et al. An end-to-end deep visual odometry approach trained with weak supervision, combining classical geometric constraints with learning-based pose estimation.",
      image: "",
      links: [
        {
          title: "Paper",
          href: "https://openaccess.thecvf.com/content/CVPR2024W/VISOD/html/Abouee_Weakly_Supervised_End2End_Deep_Visual_Odometry_CVPRW_2024_paper.html",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      title:
        "The HAInich: A Multidisciplinary Vision Dataset for Understanding Forest Ecosystems",
      dates: "Zenodo 2022",
      location: "doi:10.5281/zenodo.6891131",
      description:
        "S. Milz, J. Wäldchen, A. Abouee et al. A multidisciplinary vision dataset collected in the HAInich forest to study ecosystems, covering camera, LiDAR and meteorological sensors for ecological monitoring research.",
      image: "",
      links: [
        {
          title: "Dataset",
          href: "https://doi.org/10.5281/zenodo.6891131",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
  ],
} as const;
