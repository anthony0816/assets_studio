import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useTheme } from "@/context/themeContext";
import CloseIcon from "@/Icons/CloseIcon";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import { SaveIcon } from "@/Icons/SaveIcon";
import { DownloadIcon } from "@/Icons/DownloadIcon";
import { downloadPhotoFromUrl } from "@/utils/functions";

export default function ModalOpengameart({ initialData, isMobile = false }) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  const [urls, setUrls] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadPhotoError, setLoadPhotoError] = useState({});

  useEffect(() => {
    if (!initialData) return;
    console.log("Ejecutando modal", initialData);
    setIsOpen(true);
    setLoading(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/content?url=${initialData.url}`
    )
      .then((res) => res.json())
      .then(({ urls, error }) => {
        console.log(urls, "error:", error);
        if (error) return;
        setUrls(urls);
        setLoading(false);
      });
  }, [initialData]);

  function close() {
    setIsOpen(false);
    setUrls([]);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} showButtomnClose={false}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${tcolor.primary} ${color.secondary}  w-full h-full  ${
            isMobile ? "max-h-130" : "max-w-200  max-h-150"
          }  rounded-xl`}
        >
          <div className=" flex justify-end border-b border-b-gray-500">
            <button onClick={close} className="p-2">
              <CloseIcon size={30} />
            </button>
          </div>
          <h2 className="text-center p-2 font-bold">{initialData?.title}</h2>

          <div className=" overflow-y-auto h-[80%] ">
            <div className="flex flex-col justify-center gap-10 rounded mt-10">
              {loading ? (
                <div className="w-[90%] mx-auto">
                  <SkeletonAnimationGrid cellCount={1} h={400} />
                </div>
              ) : (
                urls.map((row) => (
                  <div
                    key={row.url}
                    className={` ${color.third} w-[90%] mx-auto relative `}
                  >
                    {!loadPhotoError[row.url] && (
                      <div className=" absolute top-2 right-2 space-x-4 ">
                        <button className="bg-black/80 p-2 rounded-xl ">
                          <SaveIcon />
                        </button>
                        <button
                          onClick={() => downloadPhotoFromUrl(row.url)}
                          className="bg-black/80 p-2 rounded-xl "
                        >
                          <DownloadIcon />
                        </button>
                      </div>
                    )}
                    <img
                      className={`w-full h-full  min-h-100 `}
                      src={row.url}
                      alt={`Asset de ${initialData?.title}`}
                      onError={() =>
                        setLoadPhotoError((prev) => ({
                          ...prev,
                          [row.url]: true,
                        }))
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
