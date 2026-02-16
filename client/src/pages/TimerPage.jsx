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

  // effectiveProjectId を決める前に tasksQ が必要なので、先に一旦候補を決める
  // -> projectsQ ベースの選択を優先（runningProjectId はあとで逆引き）
  const baseProjectId = useMemo(() => {
    if (selectedProjectId) return selectedProjectId;
    if (projectsQ.data?.length) return projectsQ.data[0].id;
    return "";
  }, [selectedProjectId, projectsQ.data]);

  const tasks = useTasks(baseProjectId);
  const tasksQ = tasks.tasksQ;

  // running中は、そのタスクが属するプロジェクトを採用したい
  const runningProjectId = useMemo(() => {
    if (!runningTaskId) return "";
    const t = tasksQ.data?.find((x) => x.id === runningTaskId);
    return t?.projectId ?? "";
  }, [runningTaskId, tasksQ.data]);

  const effectiveProjectId = useMemo(() => {
    if (runningProjectId) return runningProjectId;
    return baseProjectId;
  }, [runningProjectId, baseProjectId]);

  // effectiveProjectId が変わったら tasks hook も変えたいので、再取得
  // ※ ここで hook を二回呼べないので、実装を単純化するなら
  // 「running中はProjectSelectをロックする」のが現実的。
  // まずは「ProjectSelectロック」で進める。
  // ----
  // シンプル運用：running中は projectId を変えない
  // effectiveProjectId が baseProjectId とズレるケースを避けるため、
  // running中は baseProjectId を動かさない（ProjectSelect disabled化を推奨）

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

  // 残り0秒で自動 complete
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
          if (running) return; // running中はロック（バグ回避）
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
            if (running) return; // running中に切替しない（まずは安全に）
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
