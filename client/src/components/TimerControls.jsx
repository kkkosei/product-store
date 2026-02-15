function TimerControls({ canStart, canStop, onStart, onStop, isStarting, isStopping }) {
  return (
    <div className="flex gap-2">
      <button className="btn btn-primary" disabled={!canStart} onClick={onStart}>
        {isStarting && <span className="loading loading-spinner loading-xs" />}
        Start
      </button>

      <button className="btn btn-error" disabled={!canStop} onClick={onStop}>
        {isStopping && <span className="loading loading-spinner loading-xs" />}
        Stop
      </button>
    </div>
  );
}

export default TimerControls;
