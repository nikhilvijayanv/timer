/**
 * Format seconds into HH:MM:SS or MM:SS
 */
export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${minutes}:${pad(secs)}`;
  }
}

/**
 * Pad number with leading zero
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Get elapsed seconds from start time
 */
export function getElapsedSeconds(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

/**
 * Format tray title with timer emoji and time
 */
export function formatTrayTitle(elapsedSeconds: number | null): string {
  if (elapsedSeconds === null) {
    return 'Timer'; // No active timer
  }

  const timeStr = formatElapsedTime(elapsedSeconds);
  return `⏱ ${timeStr}`;
}
