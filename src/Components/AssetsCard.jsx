import { useTheme } from "@/context/themeContext";
import { useState, useEffect } from "react";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { GiveLike } from "@/utils/functions";

export default function AssetsCard({
  asset,
  currentUserId,
  onClickPhoto,
  onClickBar,
  onClickComents,
}) {
  const { currentTheme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(asset.likes.length);
  const [coments, setComents] = useState("");
  const [isStarting, setIsStarting] = useState(true);

  const { router } = useLoadingRouter();

  useEffect(() => {
    asset.likes.forEach((like) => {
      if (like.user_id == currentUserId) {
        setLiked(true);
        setIsStarting(false);
        return;
      }
    });
    setComents(asset?._count.coments);
    setIsStarting(false);
  }, []);

  function handleCreateComent(e) {
    e.stopPropagation();
    onClickComents();
  }

  async function handleGiveLike(e) {
    e.stopPropagation();
    const res = await GiveLike(asset.id, liked, currentUserId);
    if (!res.ok) {
      if (res.status == 401) {
        router("/login");
      }
    }
    const data = await res.json();
    const { id, count } = data;
    if (id) {
      setLiked(true);
      setLikes(likes + 1);
      console.log("data from liked asset", data);
      return;
    }
    if (count) {
      setLiked(false);
      setLikes(likes - 1);
      return;
    }
  }

  return (
    <>
      <div
        className={`${currentTheme.colors.secondary} rounded-lg shadow ${currentTheme.colors.hover} hover:shadow-lg transition overflow-hidden`}
      >
        <img
          onClick={() => onClickPhoto(asset)}
          src={asset.src}
          alt={`Asset ${asset.id}`}
          className="w-full h-48 object-cover"
        />
        <div onClick={() => onClickBar()} className="p-3 flex flex-col gap-1">
          <div className="flex flex-row items-center">
            <div className="flex flex-row space-x-1 w-full ">
              <span
                onClick={async (e) => handleGiveLike(e)}
                className="cursor-pointer flex flex-row  items-center px-2 rounded-xl  "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={liked ? "rgba(200, 28, 28, 1)" : "gray"}
                  width="30"
                  height="30"
                  aria-hidden="true"
                >
                  <path d="M12.001 21.35l-1.45-1.32C6.14 15.99 3 13.14 3 9.88 3 7.19 5.19 5 7.88 5c1.54 0 3.04.73 4.12 1.88A5.84 5.84 0 0 1 16.12 5C18.81 5 21 7.19 21 9.88c0 3.26-3.14 6.11-7.55 10.15l-1.449 1.32z" />
                </svg>
                <span
                  className={`text-sm ml-2 ${currentTheme.textColor.primary}`}
                >
                  {likes}
                </span>
              </span>
              {/* Comentarios */}
              <span
                onClick={(e) => handleCreateComent(e)}
                className={`cursor-pointer ${currentTheme.textColor.primary}`}
              >
                <div className="flex flex-row  items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M7 7h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H11l-4 3v-3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z" />
                    <circle
                      cx="10"
                      cy="12"
                      r="1.1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="13"
                      cy="12"
                      r="1.1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="16"
                      cy="12"
                      r="1.1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  <span className="ml-1">{coments} </span>
                </div>
              </span>
            </div>
          </div>
          <span className={`text-xs ${currentTheme.textColor.secondary}`}>
            {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </>
  );
}
