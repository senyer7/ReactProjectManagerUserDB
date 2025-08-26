import Tasks from "./Tasks.jsx";
import Button from "./Button.jsx";

export default function SelectedProject({
  onAddTask,
  onDeleteTask,
  project,
  onDelete,
  tasks,
}) {
  if (!project) {
    return (
      <div className="selected-project">
        <p className="text-red-500">Проект не найден</p>
      </div>
    );
  }

  const formattedDate = new Date(project.dueDate).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="selected-project">
      <header className="project-header">
        <div className="project-actions">
          <h1 className="project-title">{project.title}</h1>
          <Button onClick={onDelete} text="Удалить" variant="danger" />
        </div>
        <p className="project-date">{formattedDate}</p>
        <p className="project-description">{project.description}</p>
      </header>
      <Tasks onAdd={onAddTask} onDelete={onDeleteTask} tasksList={safeTasks} />
    </div>
  );
}
