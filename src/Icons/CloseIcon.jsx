// XDeleteIcon.jsx
import React from "react";

const CloseIcon = ({
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
  className,
  title = "Eliminar",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label={title}
    {...props}
  >
    <title>{title}</title>
    <path d="M6 6 L18 18" />
    <path d="M6 18 L18 6" />
  </svg>
);

export default CloseIcon;
