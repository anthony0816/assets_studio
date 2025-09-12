export default function LoadingSpinner({ text, color = "blue-500" }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {text ? <strong>{text}</strong> : null}
      <div
        className={`animate-spin rounded-full h-5 w-5 border-b-3 border-${color}`}
      ></div>
    </div>
  );
}
