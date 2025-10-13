import { NotificationIcon } from "@/Icons/NotificationIcon";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { GetNotificationsByUserId } from "@/utils/notifications";

import Modal from "./Modal";
import NotificationCard from "./NotificationCard";
import CloseIcon from "@/Icons/CloseIcon";
import SkeletonNotification from "@/skeletons/SkeletonNotification";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "./LoadingSpiner";

export default function NotificationsModule() {
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [countNotificaciones, SetCountNotificaciones] = useState(null);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 5;
  const { user } = useAuth();

  const LoadingRef = useInfiniteScroll(loadNotifications, hasMore, {
    threshold: 1,
  });

  // bsucar cantidad de notificaciones nuevas
  useEffect(() => {
    function loadNewNotifications() {
      if (user == "await" || user == null) return;
      fetch(`api/notifications/user/${user.uid}/count`)
        .then((res) => res.json())
        .then(({ count, error }) => {
          if (error)
            console.error("Error a la hora de contar notificacioes nuevas");
          if (count) {
            if (count == 0) return SetCountNotificaciones(null);
            if (count > 9) return SetCountNotificaciones("9+");
            SetCountNotificaciones(count);
          }
        });
    }
    // ejecutar por primera vez rapido
    loadNewNotifications();
    // seguir ejecutando cada 30 seg
    const interval_id = setInterval(() => {
      loadNewNotifications();
    }, 30000);
    // limpiar la subscripcion
    return () => clearInterval(interval_id);
  }, [user]);

  // buscar las notifiaciones
  useEffect(() => {
    if (!isModalOpen) return;
    console.log("Empezar a buscar las notificaciones");
    if (user == "await" || user == null) return;
    console.log("buscando notificacioens no leidas");
    setLoading(true);
    setFetchError(false);
    loadNotifications();
  }, [isModalOpen]);

  async function loadNotifications() {
    setFetchError(false);
    await GetNotificationsByUserId(user.uid, page, limit)
      .then(async (res) => await res.json())
      .then(({ notifications, error }) => {
        if (error) {
          console.log(error);
          setLoading(false);
          return setFetchError(true);
        }
        if (notifications.length < limit) setHasMore(false);
        setNotifications((prev) => [...prev, ...notifications]);
        setPage((prev) => prev + 1);
        setLoading(false);
      });
  }

  function close() {
    setNotifications([]);
    setPage(0);
    setIsModalOpen(false);
    setHasMore(true);
    SetCountNotificaciones(null);
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length == 0) return;
    fetch("api/notifications/mask-as-read", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        ids,
      }),
    })
      .then((res) => res.json())
      .then(({ count, error }) => {
        if (error)
          console.log(
            "Error al actualizar estado de leído de las notificaciones ",
            error
          );
        if (count) return console.log("Exito", count);
      });
  }

  if (user != "await" && user != null)
    return (
      <>
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className={` p-2 flex items-center transition rounded ${currentTheme.colors.hover}`}
        >
          <NotificationIcon />
          <div
            className={`text-center text-black font-bold px-1 rounded-xl  ${
              !countNotificaciones ? "hidden" : ""
            }`}
            style={{ backgroundColor: "#10d3ddff" }}
          >
            {countNotificaciones}
          </div>
        </div>
        {/* Modal Para mostrar las notificaciones */}
        <Modal onClose={close} isOpen={isModalOpen} showButtomnClose={false}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`   w-full max-w-100 flex flex-col justify-between  h-[90%] overflow-y-auto rounded-xl ${currentTheme.colors.primary}`}
          >
            <div
              className={`flex items-center justify-between px-5 h-20 ${currentTheme.colors.primary}`}
            >
              <h2>Notifications</h2>
              <div onClick={close}>
                <CloseIcon />
              </div>
            </div>

            {/* Notificaciones */}
            {loading ? (
              <div className="  flex flex-col  overflow-y-auto  space-y-10  overflow-y-hidden w-full h-full">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonNotification key={i} />
                ))}
              </div>
            ) : (
              <div className=" flex flex-col overflow-y-auto  space-y-10 h-full">
                {notifications.map((n) => (
                  <NotificationCard key={n.createdAt} notificacion={n} />
                ))}
                <div ref={LoadingRef} className="text-center">
                  {fetchError ? (
                    <button onClick={loadNotifications}>
                      Error, try again
                    </button>
                  ) : hasMore ? (
                    <LoadingSpinner />
                  ) : notifications.length == 0 ? (
                    "Empty"
                  ) : (
                    "no more to load "
                  )}
                </div>
              </div>
            )}
            <div
              className={`flex items-center justify-end px-5 h-20 ${currentTheme.colors.primary}`}
            >
              <button onClick={close}>close</button>
            </div>
          </div>
        </Modal>
      </>
    );
}
