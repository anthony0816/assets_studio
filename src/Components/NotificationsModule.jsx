import { NotificationIcon } from "@/Icons/NotificationIcon";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";

import Modal from "./Modal";
export default function NotificationsModule() {
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // buscar las notifiaciones
  useEffect(() => {
    if (!isModalOpen) return;
    console.log("Empezar a buscar las notificaciones");
  }, [isModalOpen]);

  // verificar si hay notificacioes no leidas
  useEffect(() => {
    console.log("buscando notificacioens no leidas");
  }, []);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={` p-2  transition rounded ${currentTheme.colors.hover}`}
      >
        <NotificationIcon />
      </div>
      {/* Modal Para mostrar las notificaciones */}
      <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        Este es el modal de las notificaciones
      </Modal>
    </>
  );
}
