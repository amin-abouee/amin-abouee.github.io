// Base URL for demo videos and their posters. Media lives on Cloudflare R2 so
// the repo stays small; swap this one constant when moving hosts.
export const VIDEO_BASE = "https://pub-84003ea98a9d40318271e8de3c26576a.r2.dev/videos";

export function videoSrc(name: string) {
  return `${VIDEO_BASE}/${name}.mp4`;
}
