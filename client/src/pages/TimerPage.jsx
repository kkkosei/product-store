import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMyProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { usePomodoro } from "../hooks/usePomodoro";
import { getRemainingSec, formatMMSS } from "../lib/time";

import ProjectSelect from "../components/timer/ProjectSelect";
import TaskList from "../components/timer/TaskList";
import TimerStats from "../components/timer/TimerStats";
import TimerControls from "../components/timer/TimerControls";

function TimerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const projectsQ = useMyProjects();
  const pomodoro = usePomodoro();
  const pState = pomodoro.state;

  const running = pState?.status === "running";
  const runningTaskId = pState?.taskId ?? "";


  const baseProjectId = useMemo(() => {
    if (selectedProjectId) return selectedProjectId;
    if (projectsQ.data?.length) return projectsQ.data[0].id;
    return "";
  }, [selectedProjectId, projectsQ.data]);

  const tasks = useTasks(baseProjectId);
  const tasksQ = tasks.tasksQ;

  const handleCreateTask = (title) => tasks.create.mutateAsync(title);

  const handleArchiveTask = async (taskId) => {
    const result = await tasks.archive.mutateAsync(taskId);
    if (!result) return;
    if (selectedTaskId === taskId) setSelectedTaskId("");
  };

  const handleDeleteTask = async (taskId) => {
    const ok = window.confirm("Delete this task? This cannot be undone.");
    if (!ok) return;
    await tasks.delete.mutateAsync(taskId);
    if (selectedTaskId === taskId) setSelectedTaskId("");
  };

  const handleDeleteArchivedAll = async () => {
    const ok = window.confirm("Delete all archived tasks? This cannot be undone.");
    if (!ok) return;

    await tasks.deleteArchivedAll.mutateAsync();

    const selected = tasksQ.data?.find((t) => t.id === selectedTaskId);
    if (selected?.status === "archived") setSelectedTaskId("");
  };

  const effectiveTaskId = useMemo(() => {
    if (runningTaskId) return runningTaskId;
    return selectedTaskId;
  }, [runningTaskId, selectedTaskId]);

  const selectedTaskTitle = useMemo(() => {
    if (!tasksQ.data?.length) return null;
    const t = tasksQ.data.find((t) => t.id === effectiveTaskId);
    return t?.title ?? null;
  }, [tasksQ.data, effectiveTaskId]);

  const phase = pState?.phase ?? "work";
  const remainingLabel = formatMMSS(getRemainingSec(pState));

  // Start / Pause / Resume / Complete
  const canStart = !!effectiveTaskId && !running && !pomodoro.start.isPending;
  const canPause = running && !pomodoro.pause.isPending;
  const canResume = pState?.status === "paused" && !pomodoro.resume.isPending;


  useEffect(() => {
    if (!pState) return;
    if (pState.status !== "running") return;
    if (pomodoro.complete.isPending) return;

    const remaining = getRemainingSec(pState);
    if (remaining > 0) return;

    pomodoro.complete.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pState?.endsAt, pState?.status]);

  if (projectsQ.isLoading) return <LoadingSpinner />;
  if (projectsQ.error)
    return <div className="alert alert-error">Failed to load projects</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <ProjectSelect
        projects={projectsQ.data}
        projectId={baseProjectId}
        onChange={(newProjectId) => {
          if (running) return; // lock
          setSelectedProjectId(newProjectId);
          setSelectedTaskId("");
        }}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <TaskList
          tasksQ={tasksQ}
          selectedTaskId={effectiveTaskId}
          runningTaskId={runningTaskId}
          onSelectTask={(id) => {
            if (running) return;
            setSelectedTaskId(id);
          }}
          onCreateTask={handleCreateTask}
          creatingTask={tasks.create.isPending}
          onArchiveTask={handleArchiveTask}
          onDeleteTask={handleDeleteTask}
          deletingTask={tasks.delete.isPending}
          onDeleteArchivedAll={handleDeleteArchivedAll}
          deletingArchivedAll={tasks.deleteArchivedAll.isPending}
        />

        <div className="card bg-base-300 lg:col-span-2">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Pomodoro</h2>
              {pomodoro.pomodoroQ.isFetching && (
                <span className="loading loading-spinner loading-xs" />
              )}
            </div>

            <TimerStats
              running={running}
              phase={phase}
              remainingLabel={remainingLabel}
              selectedTaskTitle={selectedTaskTitle}
            />

            {!effectiveTaskId && (
              <div className="alert alert-warning">
                Select a task from the left to start.
              </div>
            )}

            <TimerControls
              canStart={canStart}
              canPause={canPause}
              canResume={canResume}
              onStart={() => pomodoro.start.mutate({ taskId: effectiveTaskId })}
              onPause={() => pomodoro.pause.mutate()}
              onResume={() => pomodoro.resume.mutate()}
              onComplete={() => pomodoro.complete.mutate()}
              isStarting={pomodoro.start.isPending}
              isPausing={pomodoro.pause.isPending}
              isResuming={pomodoro.resume.isPending}
              isCompleting={pomodoro.complete.isPending}
            />

            {(pomodoro.start.error ||
              pomodoro.pause.error ||
              pomodoro.resume.error ||
              pomodoro.complete.error) && (
              <div className="alert alert-error">
                Pomodoro action failed. Check server routes and try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
