export function SaveIcon({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.5,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Outline of floppy */}
      <path d="M5 4h10l4 4v12H5V4z" />
      {/* Notch line */}
      <path d="M9 4v6h6V4" />
      {/* Bottom label area */}
      <rect x="7" y="13" width="10" height="6" rx="1" />
    </svg>
  );
}
