import { useState } from "react";

export default function Tasks({ onAdd, onDelete, tasksList }) {
  const [enteredTask, setEnteredTask] = useState("");

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleAddClick() {
    if (enteredTask.trim() === "") return;

    onAdd(enteredTask);
    setEnteredTask("");
  }

  function handleDeleteClick(taskId) {
    onDelete(taskId);
  }

  const safeTasks = Array.isArray(tasksList) ? tasksList : [];

  return (
    <div className="tasks-container">
      <div className="new-task-container">
        <input
          onChange={handleChange}
          value={enteredTask}
          className="new-task-input"
          type="text"
          placeholder="Введите задачу"
        />
        <button onClick={handleAddClick} className="btn-primary new-task-btn">
          добавить задачу
        </button>
      </div>

      {safeTasks.length > 0 ? (
        <ul className="tasks-list">
          {safeTasks.map((task) => (
            <li key={task.id} className="task-item">
              <span className="task-text">{task.text}</span>
              <button
                onClick={() => handleDeleteClick(task.id)}
                className="task-delete-btn"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-tasks-message">Задачи отсутствуют</p>
      )}
    </div>
  );
}
