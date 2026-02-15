import { ArrowLeftIcon, EditIcon, Trash2Icon, CalendarIcon, UserIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "@clerk/clerk-react";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useParams, Link, useNavigate } from "react-router";
import { useProjectSummary } from "../hooks/useProjectSummary";
import { formatDuration } from "../lib/format";

function ProjectPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useProject(id);
  const deleteProject = useDeleteProject();
  const summaryQ = useProjectSummary(id);

  const handleDelete = () => {
    if (confirm("Delete this project permanently?")) {
      deleteProject.mutate(id, { onSuccess: () => navigate("/") });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !project) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Project not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = userId === project.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/edit/${project.id}`} className="btn btn-ghost btn-sm gap-1">
              <EditIcon className="size-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm gap-1"
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="card bg-base-300">
          <figure className="p-4">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          </figure>
        </div>

        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{project.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {project.user?.name}
              </div>
            </div>

            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">{project.description}</p>

            {project.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={project.user.imageUrl} alt={project.user.name} />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{project.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="stats bg-base-200 my-4">
        <div className="stat">
          <div className="stat-title">Total Study Time</div>
          <div className="stat-value text-primary">
            {summaryQ.isLoading
              ? "..."
              : formatDuration(summaryQ.data?.totalSeconds)}
          </div>
        </div>
      </div>


      {/* Comments */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentsSection projectId={id} comments={project.comments} currentUserId={userId} />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;