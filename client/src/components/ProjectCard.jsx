import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProjectCard = ({ project }) => {
  const isNew = new Date(project.createdAt) > oneWeekAgo;

  return (
    <Link
      to={`/project/${project.id}`}
      className="card bg-base-300 hover:bg-base-200 transition-colors"
    >
      <figure className="px-4 pt-4">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="rounded-xl h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {project.title}
          {isNew && <span className="badge badge-secondary badge-sm">NEW</span>}
        </h2>
        <p className="text-sm text-base-content/70 line-clamp-2">{project.description}</p>

        <div className="divider my-1"></div>

        <div className="flex items-center justify-between">
          {project.user && (
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full ring-1 ring-primary">
                  <img src={project.user.imageUrl} alt={project.user.name} />
                </div>
              </div>
              <span className="text-xs text-base-content/60">{project.user.name}</span>
            </div>
          )}
          {project.comments && (
            <div className="flex items-center gap-1 text-base-content/50">
              <MessageCircleIcon className="size-3" />
              <span className="text-xs">{project.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;