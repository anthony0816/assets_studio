// components/LogoAS.jsx
export default function LogoAS({
  width = 132,
  height = 132,
  textPrimary = "#60A5FA", // gradiente del borde
  textSecondary = "#FFFFFF", // color de la "A"
  accent = "#10B981", // color de la "S"
  bg = "transparent",
  title = "AS",
  onClick,
}) {
  const gradId = "as-grad";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 164 164"
      role="img"
      aria-label={title}
      style={{
        display: "block",
        background: "#1f2937", // gris oscuro fijo (Tailwind bg-gray-800)
      }}
      className="cursor-pointer rounded-xl"
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
      <g transform="translate(16, 16)" filter="url(#soft)">
        {/* Marco */}
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
        {/* Letra A */}
        <path
          d="M26 108 L48 28 L70 108 L60 108 L54 90 L42 90 L36 108 Z M49 72 L51 64 L53 72 Z"
          fill={textSecondary}
          opacity="0.95"
        />
        {/* Letra S */}
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
    </svg>
  );
}
