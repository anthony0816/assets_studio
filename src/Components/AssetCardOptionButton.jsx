import { useState, useRef, useEffect } from "react";
import { OptionsDots } from "@/Icons/OptionDocsIcon";
import DeleteIcon from "@/Icons/DeleteIcon";
import { DeleteAsset_AlsoCloudnary } from "@/utils/functions";
import { useInterface } from "@/context/intercomunicationContext";

export default function AssetCardOptionButton({
  asset,
  currentUser,
  menuColor,
  fontMenuColor,
  onDelete,
}) {
  const asset_user_id = asset.user_id;
  const currentUser_id = currentUser?.uid;
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { setModalDeleteAssetInterface } = useInterface();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDelete() {
    async function Delete() {
      console.log("deleting...");

      const res = await DeleteAsset_AlsoCloudnary(asset.id, asset.public_id);
      if (res.ok) {
        onDelete();
        return;
      }
    }
    setModalDeleteAssetInterface({
      to: "ModalDeleteAsset",
      callBack: Delete,
    });
  }

  if (
    String(currentUser_id) !== String(asset_user_id) &&
    currentUser?.roll != "admin"
  )
    return null;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 bg-gray-800/60 rounded-xl p-2 hover:bg-gray-800/90 transition duration-300"
      >
        <OptionsDots color={"#d5cacaff"} />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-40 ${menuColor} ${fontMenuColor} rounded-lg shadow-lg z-40`}
        >
          <ul className="py-2 text-sm">
            <li onClick={handleDelete} className={`px-4 py-2  cursor-pointer`}>
              <div className="flex justify-between">
                <div>Delete</div>
                <DeleteIcon />
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
