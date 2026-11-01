export default function InlineVideo({ src, title }: { src: string; title?: string }) {
  return (
    <video
      src={src}
      poster={src.replace(/\.mp4$/, ".jpg")}
      controls
      muted
      playsInline
      preload="metadata"
      aria-label={title}
      className="w-full rounded-lg border border-border bg-black"
    />
  );
}
