import { useState } from "react";
import { useTheme } from "@/context/themeContext";
export default function ReportForm({ theme, onSubmit }) {
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [description, setDescription] = useState("");
  {
    /* estilos */
  }
  const { currentTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ user_id: userId, asset_id: Number(assetId), description });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={` m-3 p-6 rounded-xl shadow-lg space-y-4 ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
    >
      <h2 className="text-xl font-semibold">Create Report</h2>

      {/* user_id */}
      <div className="flex flex-col">
        <label className={`${currentTheme.textColor.secondary} text-sm mb-1`}>
          User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={`px-3 py-2 rounded-lg outline-none ${currentTheme.colors.secondary} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
          placeholder="Enter user id"
        />
      </div>

      {/* asset_id */}
      <div className="flex flex-col">
        <label className={`${currentTheme.textColor.secondary} text-sm mb-1`}>
          Asset ID
        </label>
        <input
          type="number"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className={`px-3 py-2 rounded-lg outline-none ${currentTheme.colors.secondary} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
          placeholder="Enter asset id"
        />
      </div>

      {/* description */}
      <div className="flex flex-col">
        <label className={`${currentTheme.textColor.secondary} text-sm mb-1`}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`px-3 py-2 rounded-lg outline-none resize-none ${currentTheme.colors.secondary} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
          placeholder="Describe the issue..."
          rows={4}
        />
      </div>

      {/* submit */}
      <button
        type="submit"
        className={`w-full py-2 rounded-lg font-semibold transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} ${currentTheme.textColor.primary}`}
      >
        Submit Report
      </button>
    </form>
  );
}
