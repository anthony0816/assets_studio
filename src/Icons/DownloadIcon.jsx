export function DownloadIcon({
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
      {/* Arrow down */}
      <path d="M12 3v10" />
      <path d="M7 9l5 5 5-5" />
      {/* Tray */}
      <path d="M4 20h16" />
    </svg>
  );
}
