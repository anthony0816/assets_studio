// components/LogoAssetsStudio.jsx
export default function LogoAssetsStudio({
  width = 260,
  height = 72,
  textPrimary = "#60A5FA", // azul (Assets)
  textSecondary = "#FFFFFF", // blanco (Studio)
  accent = "#10B981", // acento verde
  bg = "transparent",
  title = "Assets Studio",
  isOpen,
  onClick,
}) {
  const gradId = "as-grad";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 760 180"
      role="img"
      aria-label={title}
      style={{ display: "block", background: bg }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={textPrimary} />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Isotipo “AS” */}
      <g transform="translate(16, 24)" filter="url(#soft)">
        <rect
          x="0"
          y="0"
          width="132"
          height="132"
          rx="16"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
        />
        {/* A */}
        <path
          d="M26 108 L48 28 L70 108 L60 108 L54 90 L42 90 L36 108 Z M49 72 L51 64 L53 72 Z"
          fill={textSecondary}
          opacity="0.95"
        />
        {/* S */}
        <path
          d="M80 46
             C80 36, 90 30, 104 30
             C118 30, 128 36, 128 46
             C128 56, 118 60, 106 62
             C94 64, 84 68, 84 78
             C84 90, 96 98, 112 98
             C124 98, 132 94, 136 88
             L136 100
             C130 108, 118 114, 104 114
             C84 114, 70 102, 70 86
             C70 70, 86 64, 102 62
             C114 60, 120 56, 120 48
             C120 40, 112 36, 104 36
             C94 36, 86 40, 82 44 Z"
          fill={accent}
          opacity="0.9"
        />
      </g>

      {/* Wordmark */}
      <g
        transform="translate(170, 56)"
        className={`transition-all duration-300 ease-in-out
    ${
      isOpen
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }`}
      >
        <text
          x="0"
          y="48"
          fill={`url(#${gradId})`}
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
          fontSize="56"
          fontWeight="800"
          letterSpacing="0.5"
        >
          Assets
        </text>
        <text
          x="230"
          y="48"
          fill={textSecondary}
          opacity="0.95"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
          fontSize="56"
          fontWeight="600"
          letterSpacing="0.5"
        >
          Studio
        </text>

        {/* Subrayados */}
        <rect
          x="2"
          y="64"
          width="200"
          height="8"
          rx="4"
          fill={`url(#${gradId})`}
        />
        <rect
          x="232"
          y="64"
          width="140"
          height="8"
          rx="4"
          fill={accent}
          opacity="0.9"
        />
      </g>
    </svg>
  );
}
