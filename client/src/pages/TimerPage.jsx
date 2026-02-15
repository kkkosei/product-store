import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { useTimer } from "../hooks/useTimer";

import ProjectSelect from "../components/timer/ProjectSelect";
import TaskList from "../components/timer/TaskList";
import TimerStats from "../components/timer/TimerStats";
import TimerControls from "../components/timer/TimerControls";

function TimerPage() {
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");

  const projectsQ = useProjects();
  const tasksQ = useTasks(projectId);
  const timer = useTimer();

  const runningSession = timer.current.data || null;
  const running = !!runningSession;

  const runningTaskId = timer.current.data?.task?.id ?? "";
  const runningProjectId = timer.current.data?.task?.projectId ?? "";

  // On initial load, if no active session exists, select the first project once projects are loaded
  useEffect(() => {
    if (runningTaskId) return;
    if (!projectsQ.data?.length) return;
    setProjectId((prev) => (prev ? prev : projectsQ.data[0].id));
  }, [projectsQ.data, runningTaskId]);

  // On initial load, automatically select the task → project from the active timer session (highest priority)
  useEffect(() => {
    if (!runningTaskId || !runningProjectId) return;
    setProjectId((prev) => (prev === runningProjectId ? prev : runningProjectId));
    setTaskId((prev) => (prev === runningTaskId ? prev : runningTaskId));
  }, [runningTaskId, runningProjectId]);

  const canStart = !!taskId && !running && !timer.start.isPending;
  const canStop = running && !timer.stop.isPending;

  const selectedTaskTitle = useMemo(() => {
    if (!tasksQ.data?.length) return null;
    const t = tasksQ.data.find((t) => t.id === taskId);
    return t?.title ?? null;
  }, [tasksQ.data, taskId]);

  if (projectsQ.isLoading) return <LoadingSpinner />;
  if (projectsQ.error) return <div className="alert alert-error">Failed to load projects</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <ProjectSelect
        projects={projectsQ.data}
        projectId={projectId}
        onChange={(newProjectId) => {
          setProjectId(newProjectId);
          setTaskId("");
        }}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <TaskList
          tasksQ={tasksQ}
          selectedTaskId={taskId}
          runningTaskId={runningTaskId}
          onSelectTask={(id) => setTaskId(id)}
        />

        <div className="card bg-base-300 lg:col-span-2">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Timer</h2>
              {timer.current.isFetching && (
                <span className="loading loading-spinner loading-xs" />
              )}
            </div>

            <TimerStats running={running} selectedTaskTitle={selectedTaskTitle} />

            {!taskId && (
              <div className="alert alert-info">
                Select a task from the left to start.
              </div>
            )}

            <TimerControls
              canStart={canStart}
              canStop={canStop}
              onStart={() => timer.start.mutate(taskId)}
              onStop={() => timer.stop.mutate()}
              isStarting={timer.start.isPending}
              isStopping={timer.stop.isPending}
            />

            {(timer.start.error || timer.stop.error) && (
              <div className="alert alert-error">
                Timer action failed. Check server routes and try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
