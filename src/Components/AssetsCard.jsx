import { useTheme } from "@/context/themeContext";
import { useState, useEffect } from "react";
import { useLoadingRouter } from "./LoadingRouterProvider";

export default function AssetsCard({ asset, user_id }) {
  const { currentTheme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(asset.likes.length);
  const [isStarting, setIsStarting] = useState(true);

  const { router } = useLoadingRouter();

  useEffect(() => {
    asset.likes.forEach((like) => {
      if (like.user_id == user_id) {
        setLiked(true);
        setIsStarting(false);
        return;
      }
    });
    setIsStarting(false);
  }, []);

  async function GiveLike(asset_id) {
    if (isStarting) return;

    if (!liked) {
      const res = await fetch("api/likes/create-delete", {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          user_id,
          asset_id,
        }),
      });

      if (!res.ok) {
        if (res.status == 401) {
          return router("/login");
        }
      }
      const data = await res.json();
      const { id } = data;
      if (id) {
        setLiked(true);
        setLikes(likes + 1);
      }
      console.log("data from liked asset", data);
      return;
    }
    if (liked) {
      const res = await fetch("api/likes/create-delete", {
        method: "DELETE",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          user_id,
          asset_id,
        }),
      });
      const data = await res.json();
      const { count } = data;
      console.log("FROM delete:", data);
      if (count) {
        setLiked(false);
        setLikes(likes - 1);
        return;
      }
    }
  }

  return (
    <>
      <div
        className={`${currentTheme.colors.secondary} rounded-lg shadow ${currentTheme.colors.hover} hover:shadow-lg transition overflow-hidden`}
      >
        <img
          src={asset.src}
          alt={`Asset ${asset.id}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-3 flex flex-col gap-1">
          <div className="flex flex-row items-center">
            <span onClick={() => GiveLike(asset.id)} className="cursor-pointer">
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
            </span>
            <span className={`text-sm ml-2 ${currentTheme.textColor.primary}`}>
              {likes} likes
            </span>
          </div>
          <span className={`text-xs ${currentTheme.textColor.secondary}`}>
            {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </>
  );
}
