import { useTheme } from "@/context/themeContext";
import { useState, useEffect } from "react";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { GiveLike } from "@/utils/functions";
import { useInterface } from "@/context/intercomunicationContext";
import LikeIcon from "@/Icons/LikeIcon";
import ComentsIcon from "@/Icons/ComentsIcon";
import ReportButton from "@/Icons/ReportButton";
import AssetCardOptionButton from "./AssetCardOptionButton";
import { useAuth } from "@/context/authContext";
import Image from "next/image";

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
  const [destroy, setDestroy] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const { user } = useAuth();

  const { router } = useLoadingRouter();
  const { LikeInterface, setLikeInterface, setOpenReportsFormInterface } =
    useInterface();

  {
    /* useffect de la interfaz */
  }

  useEffect(() => {
    if (!LikeInterface) return;
    const { asset_id, liked_status, createdBy } = LikeInterface;
    if (asset_id == asset.id) {
      setLikes(likes + liked_status);
      if (liked_status == -1) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    }
  }, [LikeInterface]);

  {
    /* Otros USeffect */
  }
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

  function handleReport(e) {
    e.stopPropagation();
    onClickBar();
    setOpenReportsFormInterface({ to: "ModalAssetData", message: "open" });
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
      console.log("data from liked asset", data);
      setLikeInterface({ asset_id: asset.id, liked_status: 1 });
      return;
    }
    if (count) {
      setLikeInterface({ asset_id: asset.id, liked_status: -1 });
      return;
    }
  }

  if (destroy) return null;

  return (
    <>
      <div
        className={` relative ${currentTheme.colors.secondary} rounded-lg shadow ${currentTheme.colors.hover} hover:shadow-lg transition overflow-hidden`}
      >
        <div className="absolute right-2 top-2">
          <AssetCardOptionButton
            asset={asset}
            onDelete={() => setDestroy(true)}
            currentUser_id={user?.uid}
            menuColor={currentTheme.colors.primary}
            fontMenuColor={currentTheme.textColor.primary}
          />
        </div>
        <div className="relative w-full h-48">
          <Image
            onClick={() => onClickPhoto(asset)}
            src={asset.src}
            alt={`Asset ${asset.id}`}
            fill
            sizes="551px"
            className="object-cover cursor-pointer"
          />
        </div>
        <div onClick={() => onClickBar()} className="p-3 flex flex-col gap-1">
          <div className={`flex flex-row justify-between items-center   `}>
            <div className="flex flex-row space-x-1 w-full ">
              <span
                onClick={async (e) => handleGiveLike(e)}
                className="cursor-pointer flex flex-row  items-center px-2 rounded-xl  "
              >
                <LikeIcon liked={liked} />
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
                  <ComentsIcon />
                  <span className="ml-1">{coments} </span>
                </div>
              </span>
            </div>
            {/* Reportes */}
            <div>
              <span
                onClick={(e) => handleReport(e)}
                className={` flex flex-row items-center space-x-2 cursor-pointer ${currentTheme.textColor.secondary} `}
              >
                <ReportButton
                  color={currentTheme.colors.buttonReport}
                  strokeWidth="3"
                />
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
