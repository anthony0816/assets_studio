import { NotificationIcon } from "@/Icons/NotificationIcon";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { GetNotificationsByUserId } from "@/utils/notifications";

import Modal from "./Modal";
import NotificationCard from "./NotificationCard";
import CloseIcon from "@/Icons/CloseIcon";
import SkeletonNotification from "@/skeletons/SkeletonNotification";
export default function NotificationsModule() {
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // buscar las notifiaciones
  useEffect(() => {
    if (!isModalOpen) return;
    console.log("Empezar a buscar las notificaciones");
    if (user == "await" || user == null) return;
    console.log("buscando notificacioens no leidas");
    setLoading(true);
    setFetchError(false);
    GetNotificationsByUserId(user.uid)
      .then(async (res) => await res.json())
      .then(({ notifications, error }) => {
        if (error) {
          setLoading(false);
          return setFetchError(true);
        }
        setNotifications(notifications);
        setLoading(false);
      });
  }, [isModalOpen]);

  // verificar si hay notificacioes no leidas
  useEffect(() => {
    if (user == "await" || user == null) return;
    console.log("buscando notificacioens no leidas");
  }, [user]);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={` p-2  transition rounded ${currentTheme.colors.hover}`}
      >
        <NotificationIcon />
      </div>
      {/* Modal Para mostrar las notificaciones */}
      <Modal
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        showButtomnClose={false}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={` max-w-100 flex flex-col justify-between  h-[90%] overflow-y-auto rounded-xl ${currentTheme.colors.primary}`}
        >
          <div
            className={`flex items-center justify-between px-5 h-20 ${currentTheme.colors.primary}`}
          >
            <h2>Notifications</h2>
            <div onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </div>
          </div>

          {/* Notificaciones */}
          {fetchError ? (
            <div className=" flex flex-col overflow-y-auto  space-y-10 h-full ">
              Error , try later
            </div>
          ) : loading ? (
            <div className=" w-100 flex flex-col  overflow-y-auto  space-y-10 h-full overflow-y-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonNotification key={i} />
              ))}
            </div>
          ) : (
            <div className=" flex flex-col overflow-y-auto  space-y-10 h-full">
              {notifications.map((n) => (
                <div className="">
                  <NotificationCard key={n.createdAt} notificacion={n} />
                </div>
              ))}
            </div>
          )}
          <div
            className={`flex items-center justify-end px-5 h-20 ${currentTheme.colors.primary}`}
          >
            <button onClick={() => setIsModalOpen(false)}>close</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
