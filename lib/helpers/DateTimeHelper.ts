export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTimeOnlyMinutes(totalSeconds: number): string {
  // TODO: hours and minutes or only minutes (?)
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return minutes.toString();
}

export function formatTimeShort(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    // e.g. "1h 05m"
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  } else if (minutes > 0) {
    // e.g. "05m 09s"
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  } else {
    // e.g. "09s"
    return `${seconds}s`;
  }
}
