import Button from "./Button.jsx";
import img from "../assets/no-projects.png";

export default function NoProjectSelected({ onStartAddProject }) {
  return (
    <div className="no-project-container">
      <img src={img} className="no-project-image" alt="No projects" />
      <h2 className="no-project-title">Проект не выбран.</h2>
      <p className="no-project-description">
        Пожалуйста выберите проект или создайте новый.
      </p>
      <Button onClick={onStartAddProject} text={"Создать новый проект"} />
    </div>
  );
}
