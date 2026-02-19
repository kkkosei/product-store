export function getRemainingSec(pState) {
  if (!pState?.startedAt || !pState?.endsAt) return 0;

  const started = new Date(pState.startedAt).getTime();
  const ends = new Date(pState.endsAt).getTime();


  const base = pState.status === "paused"
    ? (ends - started)
    : (ends - Date.now());

  return Math.max(0, Math.floor(base / 1000));
}


export function formatMMSS(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
