"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

export type WorkVideo = {
  title: string;
  description: string;
  src: string;
};

export default function VideoGallery({
  videos,
}: {
  videos: readonly WorkVideo[];
}) {
  const [active, setActive] = useState<WorkVideo | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="flex flex-col gap-6">
        {videos.map((video, index) => (
          <div
            key={video.src}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8"
          >
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold">{video.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {video.description}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Enlarge video: ${video.title}`}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border shadow-sm sm:w-1/2 sm:shrink-0"
              onClick={() => setActive(video)}
            >
              <video
                src={video.src}
                poster={video.src.replace(/\.mp4$/, ".jpg")}
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                <Play className="size-3" /> enlarge
              </span>
            </button>
          </div>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/80 p-4 sm:p-8"
          onClick={() => setActive(null)}
        >
          <div
            className="flex max-w-full flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={active.src}
              className="max-h-[80vh] max-w-full rounded-lg border border-border bg-black shadow-2xl"
              controls
              autoPlay
              loop
              playsInline
            />
            <p className="max-w-full text-center text-sm text-foreground/90">
              {active.title} — {active.description}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
