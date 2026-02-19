function TimerControls({
  status, // "idle" | "running" | "paused"
  canStart,
  canComplete,
  onStart,
  onPause,
  onResume,
  onComplete,
  busy,
}) {
  const main =
    status === "running"
      ? { label: "Pause", onClick: onPause, className: "btn btn-warning" }
      : status === "paused"
      ? { label: "Resume", onClick: onResume, className: "btn btn-success" }
      : { label: "Start", onClick: onStart, className: "btn btn-primary" };

  const mainDisabled =
    busy || (status === "idle" && !canStart);

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        className={main.className}
        disabled={mainDisabled}
        onClick={main.onClick}
      >
        {main.label}
      </button>

      <button
        className="btn btn-outline"
        disabled={!canComplete || busy}
        onClick={onComplete}
      >
        Complete
      </button>
    </div>
  );
}

export default TimerControls;
