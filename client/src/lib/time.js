export function getRemainingSec(state) {
  if (!state?.endsAt) return 0;
  const ends = new Date(state.endsAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((ends - now) / 1000));
}

export function formatMMSS(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
