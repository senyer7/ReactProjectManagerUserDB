export default function Button({ onClick, text, variant = "primary" }) {
  const buttonClass = variant === "danger" ? "btn-danger" : "btn-primary";

  return (
    <button onClick={onClick} className={buttonClass}>
      {text}
    </button>
  );
}
