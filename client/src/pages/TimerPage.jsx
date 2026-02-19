import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMyProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { usePomodoro } from "../hooks/usePomodoro";
import { formatMMSS, getRemainingSec } from "../lib/time";

import ProjectSelect from "../components/timer/ProjectSelect";
import TaskList from "../components/timer/TaskList";
import TimerStats from "../components/timer/TimerStats";
import TimerControls from "../components/timer/TimerControls";

function TimerPage() {

  // Local UI state
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Data hooks
  const projectsQ = useMyProjects();
  const pomodoro = usePomodoro();
  const pState = pomodoro.state;


  // Derived state
  const status = pState?.status ?? "idle";
  const isLocked = status !== "idle";
  const phase = pState?.phase ?? "work";

  const runningTaskId = pState?.taskId ?? "";

  const projectId = useMemo(() => {
    if (selectedProjectId) return selectedProjectId;
    return projectsQ.data?.[0]?.id ?? "";
  }, [selectedProjectId, projectsQ.data]);

  const tasks = useTasks(projectId);
  const tasksQ = tasks.tasksQ;

  const effectiveTaskId = useMemo(() => {
  return status === "running"
    ? runningTaskId
    : selectedTaskId;
  }, [status, runningTaskId, selectedTaskId]);


  const selectedTaskTitle = useMemo(() => {
    if (!tasksQ.data?.length) return null;
    const task = tasksQ.data.find((t) => t.id === effectiveTaskId);
    return task?.title ?? null;
  }, [tasksQ.data, effectiveTaskId]);

  const remainingSec = getRemainingSec(pState);
  const remainingLabel = formatMMSS(remainingSec);

  const isBusy =
    pomodoro.start.isPending ||
    pomodoro.pause.isPending ||
    pomodoro.resume.isPending ||
    pomodoro.complete.isPending;

  // Actions (event handlers)
  const changeProject = (newProjectId) => {
    if (isLocked) return;
    setSelectedProjectId(newProjectId);
    setSelectedTaskId("");
  };

  const selectTask = (taskId) => {
    if (isLocked) return;
    setSelectedTaskId(taskId);
  };

  const createTask = (title) => tasks.create.mutateAsync(title);

  const archiveTask = async (taskId) => {
    const updated = await tasks.archive.mutateAsync(taskId);
    if (!updated) return;
    if (selectedTaskId === taskId) setSelectedTaskId("");
  };

  const deleteTask = async (taskId) => {
    const ok = window.confirm("Delete this task? This cannot be undone.");
    if (!ok) return;

    await tasks.delete.mutateAsync(taskId);

    if (selectedTaskId === taskId) setSelectedTaskId("");
  };

  const deleteArchivedAll = async () => {
    const ok = window.confirm("Delete all archived tasks? This cannot be undone.");
    if (!ok) return;

    await tasks.deleteArchivedAll.mutateAsync();

    const selected = tasksQ.data?.find((t) => t.id === selectedTaskId);
    if (selected?.status === "archived") setSelectedTaskId("");
  };

  const start = () => pomodoro.start.mutate({ taskId: effectiveTaskId });
  const pause = () => pomodoro.pause.mutate();
  const resume = () => pomodoro.resume.mutate();
  const complete = () => pomodoro.complete.mutate();
  const [, setTick] = useState(0);

  useEffect(() => {
  if (status !== "running") return;
  const id = setInterval(() => setTick((t) => t + 1), 1000);
  return () => clearInterval(id);
  }, [status]);

  // Auto complete when timer hits 0
  useEffect(() => {
    if (!pState) return;
    if (status !== "running") return;
    if (pomodoro.complete.isPending) return;
    if (remainingSec > 0) return;

    pomodoro.complete.mutate();
  }, [pState, status, remainingSec, pomodoro.complete.isPending, pomodoro.complete]);


  // Guards
  if (projectsQ.isLoading) return <LoadingSpinner />;
  if (projectsQ.error) return <div className="alert alert-error">Failed to load projects</div>;
  
  // UI flags
  const canStart = !!effectiveTaskId && status === "idle" && !isBusy;
  const canComplete = !!pState && !pomodoro.complete.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <ProjectSelect
        projects={projectsQ.data}
        projectId={projectId}
        onChange={changeProject}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <TaskList
          tasksQ={tasksQ}
          selectedTaskId={effectiveTaskId}
          runningTaskId={runningTaskId}
          isLocked={isLocked}
          pomodoroStatus={status}
          onSelectTask={selectTask}
          onCreateTask={createTask}
          creatingTask={tasks.create.isPending}
          onArchiveTask={archiveTask}
          onDeleteTask={deleteTask}
          deletingTask={tasks.delete.isPending}
          onDeleteArchivedAll={deleteArchivedAll}
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
              status={status} 
              phase={phase} 
              remainingLabel={remainingLabel} 
              selectedTaskTitle={selectedTaskTitle} 
            />

            {!effectiveTaskId && (
              <div className="alert alert-warning">Select a task from the left to start.</div>
            )}

            <TimerControls
              status={status}
              canStart={canStart}
              canComplete={canComplete}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onComplete={complete}
              busy={isBusy}
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
