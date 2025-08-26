import { useState } from "react";

export default function NewTask({ onAdd }) {
  const [enteredTask, setEnteredTask] = useState("");

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleClick() {
    if (enteredTask.trim() === "") return;

    onAdd(enteredTask);
    setEnteredTask("");
  }

  return (
    <div className="new-task-container">
      <input
        onChange={handleChange}
        value={enteredTask}
        className="new-task-input"
        type="text"
        placeholder="Введите задачу"
      />
      <button onClick={handleClick} className="btn-primary new-task-btn">
        Добавить задачу
      </button>
    </div>
  );
}
