/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  apexSolver,
  poseGraphSe2,
  poseGraphSe3,
  bundleAdjustment,
  schurComparison,
  type PoseDataset,
  type BaDataset,
  type SchurDataset,
} from "@/data/apex-solver-performance";
import { apexCrates, type CratePage } from "@/data/apex-crates";
import { apexSlamPage } from "@/data/apex-slam";
import InlineVideo from "@/components/inline-video";

const cratePages: Record<string, CratePage> = {
  ...apexCrates,
  "apex-slam": apexSlamPage,
};

const ACCENT = "bg-amber-500"; // highlight = apex-solver rows
const DIM = "bg-muted-foreground/50";

function barWidth(v: number, min: number, max: number) {
  if (max <= min) return 50;
  const w = ((Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100;
  return Math.max(2, w);
}

function BarChart({
  heading,
  groups,
  unit,
  caption,
}: {
  heading: string;
  unit: string;
  groups: {
    label: string;
    bars: { label: string; value: number | null; disp: string }[];
  }[];
  caption?: string;
}) {
  const vals = groups
    .flatMap((g) => g.bars.map((b) => b.value))
    .filter((v): v is number => v != null && v > 0);
  const min = Math.min(...vals);
  const max = Math.max(...vals);

  return (
    <figure className="rounded-xl border border-border p-4">
      <figcaption className="mb-3 flex flex-col">
        <span className="text-sm font-semibold">{heading}</span>
        <span className="text-[11px] text-muted-foreground">
          {unit} · bar length on a log scale · value = mean ± stdev
        </span>
      </figcaption>
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-muted-foreground">{group.label}</span>
            {group.bars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span
                  className={`w-28 shrink-0 truncate text-[11px] sm:w-44 sm:text-xs ${
                    bar.label.includes("apex") ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {bar.label}
                </span>
                <div className="h-3.5 flex-1 overflow-hidden rounded-sm bg-muted/40">
                  {bar.value != null && bar.value > 0 ? (
                    <div
                      className={`h-full rounded-sm ${bar.label.includes("apex") ? ACCENT : DIM}`}
                      style={{ width: `${barWidth(bar.value, min, max)}%` }}
                    />
                  ) : null}
                </div>
                <span className="w-24 shrink-0 text-right font-mono text-[10px] tabular-nums sm:w-32 sm:text-[11px]">
                  {bar.disp}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {caption && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{caption}</p>
      )}
    </figure>
  );
}

function th(children: React.ReactNode, className = "") {
  return (
    <th className={`px-2 py-2 text-left text-[11px] font-medium text-muted-foreground ${className}`}>
      {children}
    </th>
  );
}

function td(children: React.ReactNode, className = "") {
  return <td className={`px-2 py-1.5 align-top ${className}`}>{children}</td>;
}

const mono = "font-mono text-[11px] tabular-nums sm:text-xs";
const best = "font-semibold text-foreground";

function PoseGraphTable({ datasets }: { datasets: PoseDataset[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-foreground">
        <thead>
          <tr className="bg-muted/40">
            {th("Dataset")}
            {th("Solver")}
            {th("Final Cost")}
            {th("cost/(m−n)")}
            {th("Time (ms)")}
            {th("Iters")}
          </tr>
        </thead>
        <tbody>
          {datasets.map((d) =>
            d.rows.map((r, i) => (
              <tr
                key={`${d.dataset}-${r.solver}`}
                className={`border-t border-border/60 ${r.solver.includes("apex") ? "bg-amber-500/5" : ""}`}
              >
                {i === 0 ? (
                  <td className="px-2 py-1.5 align-top" rowSpan={d.rows.length}>
                    <span className="text-xs font-medium">{d.dataset}</span>
                    <span className="block whitespace-nowrap text-[10px] text-muted-foreground">
                      {d.info}
                    </span>
                  </td>
                ) : null}
                {td(r.solver, `text-xs ${r.solver.includes("apex") ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`)}
                {td(r.cost, mono)}
                {td(r.costPer, `${mono} ${r.bestCost ? best : ""}`)}
                {td(r.time, `${mono} ${r.bestTime ? best : ""}`)}
                {td(r.iters, mono)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function BaTable({ datasets }: { datasets: BaDataset[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-foreground">
        <thead>
          <tr className="bg-muted/40">
            {th("Dataset")}
            {th("Solver")}
            {th("Final RMSE (px)")}
            {th("Time (s)")}
            {th("Iters")}
          </tr>
        </thead>
        <tbody>
          {datasets.map((d) =>
            d.rows.map((r, i) => (
              <tr
                key={`${d.dataset}-${r.solver}`}
                className={`border-t border-border/60 ${r.solver.includes("apex") ? "bg-amber-500/5" : ""}`}
              >
                {i === 0 ? (
                  <td className="px-2 py-1.5 align-top" rowSpan={d.rows.length}>
                    <span className="text-xs font-medium">{d.dataset}</span>
                    <span className="block whitespace-nowrap text-[10px] text-muted-foreground">
                      {d.info}
                    </span>
                  </td>
                ) : null}
                {td(r.solver, `text-xs ${r.solver.includes("apex") ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`)}
                {td(r.rmse, `${mono} ${r.bestRmse ? best : ""}`)}
                {td(r.time, `${mono} ${r.bestTime ? best : ""}`)}
                {td(r.iters, mono)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SchurTable({ datasets }: { datasets: SchurDataset[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[540px] text-foreground">
        <thead>
          <tr className="bg-muted/40">
            {th("Dataset")}
            {th("Solver")}
            {th("Final RMSE")}
            {th("Time (s)")}
            {th("Iters")}
            {th("× Sparse")}
          </tr>
        </thead>
        <tbody>
          {datasets.map((d) =>
            d.rows.map((r, i) => (
              <tr
                key={`${d.dataset}-${r.config}`}
                className={`border-t border-border/60 ${r.fastest ? "bg-amber-500/5" : ""}`}
              >
                {i === 0 ? (
                  <td className="px-2 py-1.5 align-top text-xs font-medium" rowSpan={d.rows.length}>
                    {d.dataset}
                  </td>
                ) : null}
                {td(r.config, `text-xs ${r.fastest ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`)}
                {td(r.rmse, mono)}
                {td(r.time, `${mono} ${r.fastest ? best : ""}`)}
                {td(r.iters, mono)}
                {td(r.rel, mono)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: "apex-solver" },
    ...Object.keys(cratePages).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "apex-solver") {
    return { title: "apex solver", description: apexSolver.tagline };
  }
  const crate = cratePages[slug];
  if (!crate) return {};
  return { title: crate.title, description: crate.tagline };
}

function ProjectIcon({ slug, title }: { slug: string; title: string }) {
  return (
    <span className="inline-flex shrink-0 overflow-hidden rounded-xl">
      <img
        src={`/${slug}-icon-light.jpg`}
        alt={`${title} icon`}
        className="size-11 object-contain dark:hidden sm:size-12"
      />
      <img
        src={`/${slug}-icon-dark.jpg`}
        alt={`${title} icon`}
        className="hidden size-11 object-contain dark:block sm:size-12"
      />
    </span>
  );
}

function CrateDetail({ page, slug }: { page: CratePage; slug: string }) {
  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to projects
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <ProjectIcon slug={slug} title={page.title} />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{page.title}</h1>
          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            v{page.version}
          </span>
        </div>
        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          {page.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          {page.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
            >
              {link.label}
              <ArrowUpRight className="size-3" />
            </a>
          ))}
        </div>
      </header>

      <section className="flex flex-col gap-4">
        {page.overview.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {p}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Key features</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {page.features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {feature.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {page.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
          {section.intro && (
            <p className="text-xs text-muted-foreground sm:text-sm">{section.intro}</p>
          )}
          {section.video && <InlineVideo src={section.video.src} title={section.video.title} />}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-foreground">
              <thead>
                <tr className="bg-muted/40">{section.columns.map((c) => th(c))}</tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => {
                  const bestCols =
                    section.bestRows?.[rowIndex] ??
                    (section.best === "min"
                      ? (() => {
                          const nums = row
                            .map((cell, j) => ({ j, v: parseFloat(cell) }))
                            .filter((x) => Number.isFinite(x.v));
                          if (!nums.length) return [];
                          const min = Math.min(...nums.map((x) => x.v));
                          return nums.filter((x) => x.v === min).map((x) => x.j);
                        })()
                      : []);
                  return (
                    <tr key={row.join("|")} className="border-t border-border/60">
                      {row.map((cell, j) => {
                        const isApex = section.apexColumns?.includes(j);
                        const isBest = bestCols.includes(j);
                        const accent =
                          j === 0
                            ? "whitespace-nowrap font-medium text-foreground"
                            : isBest
                              ? "font-semibold text-emerald-600 dark:text-emerald-400"
                              : isApex
                                ? "font-medium text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground";
                        return (
                          <td
                            key={j}
                            className={`px-2 py-1.5 align-top text-xs ${isApex ? "bg-amber-500/5" : ""} ${accent}`}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {section.note && (
            <p className="text-[11px] leading-relaxed text-muted-foreground">{section.note}</p>
          )}
        </section>
      ))}

      {page.links[0]?.href.startsWith("http") ? (
        <p className="text-xs text-muted-foreground">
          Full API reference, cookbook and changelog:{" "}
          <a
            href={page.links[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {page.title} in the repository
          </a>
          .
        </p>
      ) : null}
    </article>
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const crate = cratePages[slug];
  if (crate) return <CrateDetail page={crate} slug={slug} />;
  if (slug !== "apex-solver") notFound();

  const poseGraphCaption =
    "Benchmarks: pose graphs and bundle adjustment compared against Ceres 2.2.0, GTSAM 4.3.0, g2o, factrs and tiny-solver; Levenberg-Marquardt throughout. apex uses sparse Cholesky for odometry and the matrix-free ImplicitSparseSchur for BA.";

  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to projects
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <ProjectIcon slug="apex-solver" title={apexSolver.title} />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{apexSolver.title}</h1>
          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            v{apexSolver.version}
          </span>
        </div>
        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          {apexSolver.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          {apexSolver.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
            >
              {link.label}
              <ArrowUpRight className="size-3" />
            </a>
          ))}
        </div>
      </header>

      <figure className="flex flex-col gap-2">
        <img
          src={apexSolver.images}
          alt="apex solver sample run — optimized pose-graph trajectories"
          className="w-full rounded-xl border border-border"
        />
        <figcaption className="text-[11px] leading-relaxed text-muted-foreground">
          Sample run: optimized pose-graph trajectories with loop-closing edges, rendered from the
          optimizer&apos;s output — a 2D map with repeated structural loops (left) and a spiral
          odometry graph (right).
        </figcaption>
      </figure>

      <section className="flex flex-col gap-4">
        {apexSolver.overview.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {p}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Key features</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {apexSolver.features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {feature.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="benchmarks" className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">Performance benchmarks</h2>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-xs sm:grid-cols-2">
            {[
              ["Hardware", apexSolver.meta.hardware],
              ["Build", apexSolver.meta.build],
              ["Solvers", apexSolver.meta.versions],
              ["Measured", apexSolver.meta.measured],
              ["Methodology", apexSolver.meta.method],
            ].map(([term, desc]) => (
              <div key={term} className="flex flex-col">
                <dt className="font-medium text-foreground">{term}</dt>
                <dd className="text-muted-foreground">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Pose graph optimization</h3>
          <PoseGraphTable datasets={poseGraphSe2} />
          <PoseGraphTable datasets={poseGraphSe3} />
          <BarChart
            heading="Pose graph runtime per dataset"
            unit="Time (ms)"
            groups={[...poseGraphSe2, ...poseGraphSe3].map((d) => ({
              label: d.dataset,
              bars: d.rows.map((r) => ({ label: r.solver, value: r.timeVal, disp: r.time })),
            }))}
            caption={poseGraphCaption}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Bundle adjustment (self-calibration)</h3>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Large-scale BAL datasets: camera poses, 3D landmarks and intrinsics optimized{" "}
            <em>simultaneously</em>, Huber loss (δ = 1 px) for every solver. apex runs its library
            default, the matrix-free <span className="font-mono">ImplicitSparseSchur</span> (Schur-Jacobi
            preconditioner, forced to η = 1e-2), capped at 20 LM iterations.
          </p>
          <BaTable datasets={bundleAdjustment} />
          <BarChart
            heading="Reprojection error at convergence"
            unit="Final RMSE (px)"
            groups={bundleAdjustment.map((d) => ({
              label: d.dataset,
              bars: d.rows.map((r) => ({ label: r.solver, value: r.rmseVal, disp: r.rmse })),
            }))}
            caption={poseGraphCaption}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Schur solver comparison</h3>
          <p className="text-xs text-muted-foreground sm:text-sm">
            All four sparse Schur configurations on the same four datasets, 3 runs each.
            <span className="font-mono"> ExplicitSparseSchur / Sparse</span> solves the reduced
            system exactly (RMSE reference); the two PCG paths stop on the forcing sequence, so
            their steps are deliberately inexact.
          </p>
          <SchurTable datasets={schurComparison} />
          <BarChart
            heading="Schur solver runtime per dataset"
            unit="Time (s)"
            groups={schurComparison.map((d) => ({
              label: d.dataset,
              bars: d.rows.map((r) => ({ label: r.config, value: r.timeVal, disp: r.time })),
            }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Observations</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {apexSolver.observations.map((obs) => (
              <li key={obs.slice(0, 24)}>{obs}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          Full methodology, per-run data and interactive plots:{" "}
          <a
            href="https://github.com/aabouee/apex-solver/tree/main/doc/performance.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            doc/performance.md
          </a>{" "}
          in the repository.
        </p>
      </section>
    </article>
  );
}
