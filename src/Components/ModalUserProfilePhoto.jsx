import Modal from "./Modal";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { _POST_, fileToBase64 } from "@/utils/functions";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpiner";

export default function ModalUserProfilePhoto({
  photo,
  onClose,
  owner,
  onChangeAvatar,
}) {
  const { user } = useAuth();

  // preview
  const [preview, setPreview] = useState(null);
  // Tema
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;
  const buttonStyle = `  ${color.buttonPrimary} ${color.buttonPrimaryHover} text-white p-2 rounded-xl transition`;
  // carga
  const [updating, setUpdating] = useState(false);

  function handleChange(file) {
    fileToBase64(file).then((base64) => setPreview(base64));
  }
  function handleUpdate() {
    if (!preview) return;
    setUpdating(true);
    _POST_(`${window.location.origin}/api/user/update-avatar`, {
      old_avatar: photo,
      new_avatar: preview,
      user_id: user.uid,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setPreview(data.url);
        onChangeAvatar(data.url);
        setUpdating(false);
      })
      .catch((error) => {
        console.error("Error actualizando avatar", { error });
        setUpdating(false);
      });
  }

  console.log({ owner });

  return (
    <Modal
      isOpen={photo != null}
      onClose={() => {
        setPreview(null);
        onClose();
      }}
    >
      <div className="flex flex-col w-full items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className=" relative w-full max-w-200 h-[70vh] max-h-200 bg-black rounded-xl"
        >
          {/* Estado de carga */}
          {updating && (
            <div className="absolute flex justify-center items-center w-full h-full bg-black/70 ">
              <LoadingSpinner />
            </div>
          )}

          {/* Imagen */}
          <img
            src={preview ? preview : photo}
            alt="User Profile Photo"
            className=" w-full h-full object-contain"
          />
        </div>
        <div onClick={(e) => e.stopPropagation()} className=" pt-4">
          {user?.uid == owner?.uid &&
            owner?.providerData[0].providerId === "Assets Studio" && (
              <>
                {preview ? (
                  <div className="space-x-4">
                    <button
                      onClick={() => setPreview(null)}
                      className={buttonStyle}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate()}
                      className={buttonStyle}
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <label className={buttonStyle}>
                    Change
                    <input
                      onChange={(e) => handleChange(e.target.files[0])}
                      type="file"
                      className="hidden"
                    />
                  </label>
                )}
              </>
            )}
        </div>
      </div>
    </Modal>
  );
}
