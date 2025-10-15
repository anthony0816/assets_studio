import { useTheme } from "@/context/themeContext";
import NavegateIcon from "@/Icons/NavegateIcon";

export default function Paginator({ onNext, onPrev, page }) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  let prevPage = page;
  let nextPage = page;
  return (
    <>
      <div
        className={`${tcolor.primary} ${color.secondary}  gap-x-4  p-2 flex flex-wrap items-center justify-center  mx-auto rounded-xl `}
      >
        <div className=" mx-auto flex gap-3 justify-center  ">
          <div
            className={`${color.primary} p-3 rounded-xl cursor-pointer active:scale-90 transition duration-300`}
            onClick={() => onPrev()}
          >
            <NavegateIcon direcction={-1} />
          </div>
        </div>
        <div className={`${color.primary} p-1 rounded-xl`}>{page}</div>
        <div className="flex gap-3 justify-center   ">
          <div
            className={`${color.primary} p-3 rounded-xl cursor-pointer active:scale-90 transition  duration-300`}
            onClick={() => onNext()}
          >
            <NavegateIcon direcction={+1} />
          </div>
        </div>
      </div>
    </>
  );
}
