function TimerStats({ running, selectedTaskTitle }) {
  return (
    <div className="stats bg-base-200 stats-vertical sm:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Status</div>
        <div className="stat-desc">
          {running ? (
            <span className="badge badge-success">running</span>
          ) : (
            <span className="badge badge-error">stopped</span>
          )}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Selected task</div>
        <div className="stat-value text-lg">{selectedTaskTitle ? "" : "None"}</div>
        <div className="stat-desc truncate max-w-240px">
          {selectedTaskTitle ?? "Select a task on the left"}
        </div>
      </div>
    </div>
  );
}

export default TimerStats;
