// RetryIcon.jsx
export function RetryIcon({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.8,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Circular arrow (retry) */}
      <path d="M3 12a9 9 0 1 1 9 9" />
      <path d="M3 12h4" />
      <path d="M7 12l-3 3" />
    </svg>
  );
}
