import { useState, useRef, useEffect } from "react";
import { OptionsDots } from "@/Icons/OptionDocsIcon";
import DeleteIcon from "@/Icons/DeleteIcon";
import { DeleteAsset_AlsoCloudnary } from "@/utils/functions";
import LoadingSpinner from "./LoadingSpiner";

export default function AssetCardOptionButton({
  asset,
  currentUser_id,
  menuColor,
  fontMenuColor,
  onDelete,
}) {
  const asset_user_id = asset.user_id;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete() {
    console.log("deleting...");
    setLoading(true);
    const res = await DeleteAsset_AlsoCloudnary(asset.id, asset.public_id);
    if (res.ok) {
      onDelete();
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  if (String(currentUser_id) !== String(asset_user_id)) return null;

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
          className={`absolute right-0 mt-2 w-40 ${menuColor} ${fontMenuColor} rounded-lg shadow-lg z-50`}
        >
          <ul className="py-2 text-sm">
            <li onClick={handleDelete} className={`px-4 py-2  cursor-pointer`}>
              <div className="flex justify-between">
                <div>Delete</div>
                {loading ? <LoadingSpinner /> : <DeleteIcon />}
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
