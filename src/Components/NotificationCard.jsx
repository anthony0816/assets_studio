import { useTheme } from "@/context/themeContext";

export default function NotificationCard({ notificacion }) {
  const { currentTheme } = useTheme();

  return (
    <div
      className={`
        relative p-4 rounded-xl border-l-4 transition-all duration-300 
        hover:shadow-lg transform hover:-translate-y-0.5
        ${currentTheme.colors.border} ${currentTheme.colors.secondary}
        group cursor-pointer
      `}
      style={{
        borderLeftColor: currentTheme.colors.primary || "#3B82F6",
        background: `linear-gradient(135deg, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.primary}15 100%)`,
      }}
    >
      {/* Indicador de estado */}
      {!notificacion.read && (
        <div
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
      )}

      {/* Icono */}
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
          style={{
            backgroundColor: `${currentTheme.colors.primary}20`,
            color: currentTheme.colors.primary,
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* Mensaje */}
          <div
            className={`font-medium leading-6 ${currentTheme.textColor.primary} group-hover:underline`}
          >
            {notificacion.message}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`text-xs ${currentTheme.textColor.muted} flex items-center gap-1`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {notificacion.createdAt}
            </div>

            {notificacion.type && (
              <span
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  color: currentTheme.colors.primary,
                }}
              >
                {notificacion.type}
              </span>
            )}
          </div>
        </div>

        {/* Botón de acción */}
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-black hover:bg-opacity-10"
          style={{ color: currentTheme.colors.primary }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
