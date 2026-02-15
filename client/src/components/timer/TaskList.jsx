import LoadingSpinner from "../LoadingSpinner";

function TaskList({
  tasksQ,
  selectedTaskId,
  runningTaskId,
  onSelectTask,
}) {
  return (
    <div className="card bg-base-300 lg:col-span-1">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Tasks</h2>
          {tasksQ.isFetching && (
            <span className="loading loading-spinner loading-xs" />
          )}
        </div>

        {tasksQ.isLoading ? (
          <LoadingSpinner />
        ) : tasksQ.error ? (
          <div className="alert alert-error">Failed to load tasks</div>
        ) : (
          <ul className="menu bg-base-200 rounded-box">
            {tasksQ.data?.map((t) => {
              const active = selectedTaskId === t.id;
              const isRunningTask = runningTaskId === t.id;

              return (
                <li key={t.id}>
                  <button
                    className={active ? "active" : ""}
                    onClick={() => onSelectTask(t.id)}
                  >
                    <span className="truncate">{t.title}</span>

                    {isRunningTask ? (
                      <span className="badge badge-success">running</span>
                    ) : (
                      <span className="badge badge-ghost">
                        {t.status ?? "todo"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}

            {!tasksQ.data?.length && (
              <li>
                <span className="text-base-content/60">No tasks yet</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskList;
