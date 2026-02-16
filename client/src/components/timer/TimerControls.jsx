function TimerControls({
  canStart,
  canPause,
  canResume,
  onStart,
  onPause,
  onResume,
  onComplete,
  isStarting,
  isPausing,
  isResuming,
  isCompleting,
}) {
  return (
    <div className="flex gap-2">
      <button className="btn btn-primary" disabled={!canStart || isStarting} onClick={onStart}>
        Start
      </button>

      <button className="btn" disabled={!canPause || isPausing} onClick={onPause}>
        Pause
      </button>

      <button className="btn" disabled={!canResume || isResuming} onClick={onResume}>
        Resume
      </button>

       <button className="btn btn-outline" disabled={!onComplete || isCompleting} onClick={onComplete}>
        Complete
      </button>
    </div>
  );
}


export default TimerControls;
