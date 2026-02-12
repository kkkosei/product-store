import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useProject, useUpdateProject } from "../hooks/useProjects";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProjectForm from "../components/EditProjectForm";

function EditProjectPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  
  const { data: project, isLoading } = useProject(id);
  const updateProject = useUpdateProject();

  if(isLoading) return <LoadingSpinner />;

  if(!project || project.userId !== userId) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">{!project ? "Not found" : "Access denied"}</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return <EditProjectForm 
    project={project}
    isPending={updateProject.isPending}
    isError={updateProject.isError}
    onSubmit={(formData) => {
      updateProject.mutate(
        {id, ...formData}, 
        {onSuccess : () => navigate(`/project/${id}`)},
      )
    }}
  />

}

export default EditProjectPage;