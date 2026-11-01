// Base URL for demo videos and their posters. Media lives outside the repo so
// the site stays small; swap this one constant when moving hosts.
// TODO: point at the R2 public URL once the bucket exists.
export const VIDEO_BASE = "/videos";

export function videoSrc(name: string) {
  return `${VIDEO_BASE}/${name}.mp4`;
}
