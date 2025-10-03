export function UploadIcon({
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
    >
      {/* Flecha hacia arriba */}
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
      {/* Línea base */}
      <path d="M5 19h14" />
    </svg>
  );
}
