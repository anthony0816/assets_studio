"use client";
import { useState } from "react";
import { useTheme } from "@/context/themeContext";
import CloseIcon from "@/Icons/CloseIcon";

export default function InputSearch({ onSearch, onClose }) {
  const { currentTheme } = useTheme();

  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  // limpiar el texto del input
  function close() {
    setQuery("");
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center rounded-lg w-full px-3 py-2  ${currentTheme.colors.third} ${currentTheme.colors.border} border`}
    >
      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by category, username of the owner"
        className={` flex-1 bg-transparent focus:outline-none ${currentTheme.textColor.primary} placeholder:${currentTheme.textColor.muted}`}
      />
      <div onClick={() => close()}>
        <CloseIcon color={currentTheme.colors.SearchIcon} />
      </div>
    </form>
  );
}
