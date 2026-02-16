export const formatDuration = (totalSeconds) => {
  const s = Math.floor(totalSeconds ?? 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};
