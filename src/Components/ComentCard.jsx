import { useTheme } from "@/context/themeContext";

export default function ComentCard({ coment }) {
  const { currentTheme } = useTheme();

  return (
    <div
      className={`${currentTheme.colors.third} ${currentTheme.colors.border} border rounded-lg p-4 mb-3`}
    >
      {/* Contenido del comentario */}
      <p
        className={`${currentTheme.textColor.primary} text-base mb-2 whitespace-normal break-words `}
      >
        {coment.content}
      </p>

      {/* Fecha y likes */}
      <div className="flex items-center justify-between text-sm">
        <span className={currentTheme.textColor.muted}>
          {new Date(coment.createdAt).toLocaleDateString()}
        </span>
        <span className={currentTheme.textColor.secondary}>
          ❤️ {coment.likes?.length || 0}
        </span>
      </div>
    </div>
  );
}
