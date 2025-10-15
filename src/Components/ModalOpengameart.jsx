import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useTheme } from "@/context/themeContext";

export default function ModalOpengameart({ initialData }) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    console.log("Ejecutando modal", initialData);
    setIsOpen(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/content?url=${initialData.url}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [initialData]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={`${tcolor.primary}`}>{initialData?.url}</div>
      </Modal>
    </>
  );
}
