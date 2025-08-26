import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, textarea, ...props }, ref) {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      {textarea ? (
        <textarea
          ref={ref}
          className="input-field textarea-field"
          {...props}
        ></textarea>
      ) : (
        <input ref={ref} className="input-field" {...props}></input>
      )}
    </div>
  );
});

export default Input; // ✅ Добавлен default export
