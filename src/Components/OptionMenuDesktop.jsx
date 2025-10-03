import { SearchIcon } from "@/Icons/SearchIcon";
import { useState } from "react";
import InputSearch from "@/Components/InputSearch";
import CategorySelector from "@/Components/CategorySelector";

export default function OptionMenuDesktop({
  items,
  show,
  colorContext,
  itemsOnClick,
  onSearch,
}) {
  const { color, tcolor } = colorContext;

  const [searching, setSearching] = useState(false);

  if (show)
    return (
      <>
        {/* Lista con solo el search */}
        <ul
          className={` transition-all duration-300 ${
            searching
              ? "max-h-999 opacity-100 "
              : "max-h-0 opacity-0 pointer-events-none"
          } flex flex-row flex-wrap justify-center items-center gap-3 px-4`}
        >
          <li className="w-full max-w-200">
            <InputSearch
              onSearch={onSearch}
              onClose={() => setSearching(!searching)}
            />
          </li>
        </ul>

        {/* Lista de elementos  */}
        <ul
          className={` transition-all duration-300 ${
            searching
              ? "max-h-0 opacity-0 pointer-events-none"
              : "max-h-999 opacity-100 "
          } flex flex-row flex-wrap justify-center items-center gap-3 px-4`}
        >
          {items.map((item) => (
            <li
              onClick={() => itemsOnClick(item.clave)}
              key={item.clave}
              className={` whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
            >
              {item.name}
            </li>
          ))}
          <li>
            <select
              onChange={(e) => itemsOnClick(e.target.value)}
              className={`  whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
            >
              <option value="">Select a category</option>
              <CategorySelector />
            </select>
          </li>
          <li
            onClick={() => setSearching(!searching)}
            className={` whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
          >
            <SearchIcon color={color.SearchIcon} />
          </li>
        </ul>
      </>
    );
}
