import { useTheme } from "@/context/themeContext";
import NavegateIcon from "@/Icons/NavegateIcon";
import Modal from "./Modal";
import { useState, useRef, useEffect } from "react";
import CloseIcon from "@/Icons/CloseIcon";

export default function Paginator({ onNext, onPrev, page, onChange }) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;
  // referencias
  const inputRef = useRef(null);
  // estados
  const [modalOpen, setModalOpen] = useState(false);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if (!modalOpen) return;
    let id;
    if (inputRef.current) {
      id = setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
    return () => clearTimeout(id);
  }, [modalOpen]);

  useEffect(() => {
    const id = setInterval(() => {
      onNext();
    }, 4500);
    return () => clearInterval(id);
  }, [onNext]);

  return (
    <>
      <div
        className={`${tcolor.primary} ${color.secondary}  gap-x-4  p-2 flex flex-wrap items-center justify-center  mx-auto rounded-xl `}
      >
        <div className=" mx-auto flex gap-3 justify-center  ">
          <div
            className={`${color.primary} ${color.hover} p-3 rounded-xl cursor-pointer active:scale-90 transition duration-300`}
            onClick={() => onPrev()}
          >
            <NavegateIcon direcction={-1} />
          </div>
        </div>

        {/*  boton para activar el modal */}
        <button
          onClick={() => setModalOpen(true)}
          className={`${color.primary} ${color.hover} p-1 rounded-xl cursor-pointer px-4 hover:scale-95   transition`}
        >
          {page}
        </button>
        <div className="flex gap-3 justify-center   ">
          <div
            className={`${color.primary} ${color.hover}  p-3 rounded-xl cursor-pointer active:scale-90 transition  duration-300`}
            onClick={() => onNext()}
          >
            <NavegateIcon direcction={+1} />
          </div>
        </div>
      </div>
      {/* Modal paginador */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modalAbsolute
        showButtomnClose={false}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={` ${color.primary} flex flex-col w-full max-w-100 h-[90%]  rounded-xl  `}
        >
          <header
            className={` relative flex justify-center  p-2 border-b ${color.border} `}
          >
            <CloseIcon
              onClick={() => setModalOpen(false)}
              className={` absolute right-3 cursor-pointer  `}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onChange(inputSearch);
                setModalOpen(false);
              }}
            >
              <input
                ref={inputRef}
                onChange={(e) => setInputSearch(e.target.value)}
                type="number"
                className="w-full max-w-50 border border-gray-400 rounded-xl p-1 px-3 transition-all  "
                placeholder="Type a page number"
              />
            </form>
          </header>

          <div
            className={` ${color.primary}  space-y-3 flex-1 h-full overflow-y-auto`}
          >
            {Array.from({ length: 661 }, (_, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(i);
                  setModalOpen(false);
                }}
                className={` ${color.secondary}  ${color.hover} ${
                  i == 0 ? "mt-10" : ""
                } flex justify-between px-4 py-2 mx-3   transition rounded-xl cursor-pointer`}
              >
                <div>page</div>
                <div>{i}</div>
              </div>
            ))}
          </div>
          <div
            className={` flex justify-end px-3 border-t ${color.border} p-2  `}
          >
            <div onClick={() => setModalOpen(false)} className="cursor-pointer">
              Close
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
