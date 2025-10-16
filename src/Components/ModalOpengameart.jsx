import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useTheme } from "@/context/themeContext";
import CloseIcon from "@/Icons/CloseIcon";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";

export default function ModalOpengameart({ initialData, isMobile = false }) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  const [urls, setUrls] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    console.log("Ejecutando modal", initialData);
    setIsOpen(true);
    setLoading(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/content?url=${initialData.url}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUrls(data);
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
                    className={` ${color.third} w-[90%] mx-auto`}
                  >
                    <img
                      className={`w-full h-full`}
                      src={row.url}
                      alt={`Asset de ${initialData?.title}`}
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
