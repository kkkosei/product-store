import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

function TaskList({
  tasksQ,
  selectedTaskId,
  runningTaskId,
  onSelectTask,

  onCreateTask,
  creatingTask,
  onArchiveTask,

  onDeleteTask,
  deletingTask,
  onDeleteArchivedAll,
  deletingArchivedAll,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const hasArchived = (tasksQ.data ?? []).some((t) => t.status === "archived");

  const submit = async () => {
    const v = title.trim();
    if (!v) return;
    await onCreateTask(v);
    setTitle("");
    setIsAdding(false);
  };

  return (
    <div className="card bg-base-300 lg:col-span-1">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Tasks</h2>

          <div className="flex items-center gap-2">
            {tasksQ.isFetching && (
              <span className="loading loading-spinner loading-xs" />
            )}

            {/* add button*/}
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => {
                setIsAdding((prev) => {
                 if (prev) setTitle("");
                 return !prev;
                });
              }}
              title="Add task"
            >
              +
            </button>

            {hasArchived && (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => { onDeleteArchivedAll?.().catch(() => {}); }}
                disabled={deletingArchivedAll || tasksQ.isFetching}
                title="Delete all archived tasks"
              >
                Delete all archived tasks
              </button>
            )}
          </div>
        </div>

        {/* inline */}
        {isAdding && (
          <div className="flex gap-2">
            <input
              className="input input-sm input-bordered w-full"
              placeholder="New task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setTitle("");
                }
              }}
              autoFocus
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={submit}
              disabled={!title.trim() || creatingTask}
            >
              Add
            </button>
          </div>
        )}

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
                <li key={t.id} className="group">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <button
                      className={`btn btn-ghost btn-sm justify-start flex-1 min-w-0 ${active ? "btn-active" : ""}`}
                      onClick={() => onSelectTask(t.id)}
                      type="button"
                    >
                      <span className="truncate">{t.title}</span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {isRunningTask ? (
                        <span className="badge badge-success whitespace-nowrap">running</span>
                      ) : t.status === "archived" ? (
                        <span className="badge badge-outline badge-success whitespace-nowrap">
                          archived
                        </span>
                      ) : (
                        <span className="badge badge-outline badge-secondary whitespace-nowrap">
                          todo
                        </span>
                      )}

                      {t.status !== "archived" && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
                          onClick={() => { onArchiveTask(t.id).catch(() => {}); }}
                          disabled={isRunningTask}
                          title={isRunningTask ? "Stop timer first" : "Archive task"}
                        >
                          complete
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100"
                        onClick={() => { onDeleteTask?.(t.id).catch(() => {}); }}
                        disabled={isRunningTask || deletingTask}
                        title={isRunningTask ? "Stop timer first" : "Delete task"}
                      >
                        delete
                      </button>
                    </div>
                  </div>
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
