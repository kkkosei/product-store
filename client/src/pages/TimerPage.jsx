import { useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { useTimer } from "../hooks/useTimer";

import ProjectSelect from "../components/timer/ProjectSelect";
import TaskList from "../components/timer/TaskList";
import TimerStats from "../components/timer/TimerStats";
import TimerControls from "../components/timer/TimerControls";

function TimerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const projectsQ = useProjects();
  const timer = useTimer();

  const runningSession = timer.current.data ?? null;
  const running = !!runningSession;

  const runningTaskId = runningSession?.task?.id ?? "";
  const runningProjectId = runningSession?.task?.projectId ?? "";
  
  const effectiveProjectId = useMemo(() => {
    if (runningProjectId) return runningProjectId;
    if (selectedProjectId) return selectedProjectId;
    if (projectsQ.data?.length) return projectsQ.data[0].id;
    return "";
  }, [runningProjectId, selectedProjectId, projectsQ.data]);

  const tasks = useTasks(effectiveProjectId);
  const tasksQ = tasks.tasksQ;

  const handleCreateTask = (title) => {
  return tasks.create.mutateAsync(title);
  };

  const handleArchiveTask = async (taskId) => {
    const result = await tasks.archive.mutateAsync(taskId);
    if (!result) return;
    if (selectedTaskId === taskId) setSelectedTaskId("");
  };


  const effectiveTaskId = useMemo(() => {
    if (runningTaskId) return runningTaskId;
    return selectedTaskId;
  }, [runningTaskId, selectedTaskId]);

  const canStart = !!effectiveTaskId && !running && !timer.start.isPending;
  const canStop = running && !timer.stop.isPending;

  const selectedTaskTitle = useMemo(() => {
    if (!tasksQ.data?.length) return null;
    const t = tasksQ.data.find((t) => t.id === effectiveTaskId);
    return t?.title ?? null;
  }, [tasksQ.data, effectiveTaskId]);

  if (projectsQ.isLoading) return <LoadingSpinner />;
  if (projectsQ.error)
    return <div className="alert alert-error">Failed to load projects</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <ProjectSelect
        projects={projectsQ.data}
        projectId={effectiveProjectId}
        onChange={(newProjectId) => {
          setSelectedProjectId(newProjectId);
          setSelectedTaskId("");
        }}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <TaskList
          tasksQ={tasksQ}
          selectedTaskId={effectiveTaskId}
          runningTaskId={runningTaskId}
          onSelectTask={setSelectedTaskId}
          onCreateTask={handleCreateTask}
          creatingTask={tasks.create.isPending}
          onArchiveTask={handleArchiveTask}
        />

        <div className="card bg-base-300 lg:col-span-2">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Timer</h2>
              {timer.current.isFetching && (
                <span className="loading loading-spinner loading-xs" />
              )}
            </div>

            <TimerStats
              running={running}
              selectedTaskTitle={selectedTaskTitle}
            />

            {!effectiveTaskId && (
              <div className="alert alert-info">
                Select a task from the left to start.
              </div>
            )}

            <TimerControls
              canStart={canStart}
              canStop={canStop}
              onStart={() => timer.start.mutate(effectiveTaskId)}
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
