import Button from "./Button.jsx";

export default function ProjectSideBar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
}) {
  return (
    <aside className="project-sidebar">
      <h2 className="project-sidebar-title">Ваш проект</h2>
      <div>
        <Button onClick={onStartAddProject} text="+ Добавить проект" />
      </div>
      <ul className="project-list">
        {projects.map((project) => {
          const isActive = project.id === selectedProjectId;

          return (
            <li key={project.id} className="project-item">
              <button
                onClick={() => onSelectProject(project.id)}
                className={`project-btn ${isActive ? "active" : ""}`}
              >
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
