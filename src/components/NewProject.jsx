import { useRef, useState } from "react";
import Input from "./Input.jsx";
import Modal from "./Modal.jsx";
import { useImperativeHandle, forwardRef } from "react";

const NewProject = forwardRef(function NewProject({ onAdd, onCancel }, ref) {
  const title = useRef();
  const description = useRef();
  const dueDate = useRef();
  const [error, setError] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        title.current?.focus();
      },
    };
  });

  function handleSave() {
    const enteredTitle = title.current?.value?.trim();
    const enteredDescription = description.current?.value?.trim();
    const enteredDueDate = dueDate.current?.value?.trim();

    if (!enteredTitle || !enteredDescription || !enteredDueDate) {
      setError(true);
      return;
    }

    setError(false);
    onAdd({
      title: enteredTitle,
      description: enteredDescription,
      dueDate: enteredDueDate,
    });
  }

  return (
    <>
      {error && (
        <div className="error-notification">
          <h2 className="text-center font-bold uppercase text-lg text-stone-900 mb-4">
            Ошибка с вводом
          </h2>
          <p className="text-center text-sm font-bold text-red-600 mb-2">
            Пожалуйста, заполните все необходимые поля
          </p>
        </div>
      )}

      <div className="new-project-container">
        <div className="new-project-actions">
          <button onClick={onCancel} className="btn-secondary">
            Отменить
          </button>
          <button onClick={handleSave} className="btn-primary">
            Сохранить
          </button>
        </div>

        <div className="new-project-form">
          <div className="space-y-4">
            <Input ref={title} type="text" label={"Заголовок"} />
            <Input ref={description} label={"Описание"} textarea={true} />
            <Input ref={dueDate} type="date" label={"Дата выполнения"} />
          </div>
        </div>
      </div>
    </>
  );
});

export default NewProject;
