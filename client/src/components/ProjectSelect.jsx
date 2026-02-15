function ProjectSelect({ projects, projectId, onChange }) {
  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-xl font-semibold">Timer</h1>

          <select
            className="select select-bordered w-full max-w-xs"
            value={projectId}
            onChange={(e) => onChange(e.target.value)}
          >
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProjectSelect;
