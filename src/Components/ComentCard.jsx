import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { useData } from "@/context/GlobalDataAccesContext";

export default function ComentCard({ coment }) {
  const { currentTheme } = useTheme();
  const { router } = useLoadingRouter();
  const storage = useData();

  return (
    <div
      className={`${currentTheme.colors.third} ${currentTheme.colors.border} border rounded-lg p-4 mb-3`}
    >
      {/* User Info */}
      <div
        className=" mb-3 cursor-pointer flex items-center gap-2"
        onClick={() => {
          storage.setUserToProfile({ user_id: coment.user_id });
          router(`/user/${coment.user_id}`);
        }}
      >
        <img
          src={coment.userPhotoUrl == "" ? "/favicon.ico" : coment.userPhotoUrl}
          alt={coment.username}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-sm font-medium hover:text-blue-800 transition duration-200">
          {coment.username}
        </span>
      </div>

      {/* Contenido del comentario */}
      <p
        className={`${currentTheme.textColor.secondary} text-base mb-2 whitespace-normal break-words `}
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
