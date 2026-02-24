import type { ShareablePlan } from "./types";

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function encodeShareData(data: ShareablePlan): string {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeShareData(encoded: string): ShareablePlan | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTotalPlanMinutes(
  stations: { drills: { duration: number }[] }[]
): number {
  let max = 0;
  for (const station of stations) {
    const stationTotal = station.drills.reduce((s, d) => s + d.duration, 0);
    if (stationTotal > max) max = stationTotal;
  }
  return max;
}
