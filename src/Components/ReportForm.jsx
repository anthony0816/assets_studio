import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";

import { CreateReport } from "@/utils/functions";
import ReportsCategorySelector from "./ReportsCategorySelector";

export default function ReportForm({ asset_id, onSubmit }) {
  {
    /* custom hooks */
  }
  const { user } = useAuth();

  {
    /* Estados  */
  }

  const [type, setType] = useState(null);
  const [description, setDescription] = useState("");
  const [optional, setOptional] = useState(true);
  {
    /* estilos */
  }
  const { currentTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type == "") return;
    if (type == "other" && description == "") return;
    if (!user) return;

    console.log("hola", asset_id);

    const res = await CreateReport(asset_id, user.uid, type, description);
    const data = await res.json();
    console.log("res:", data);
  };

  useEffect(() => {
    if (type == "other") {
      return setOptional(false);
    }
    setOptional(true);
  }, [type]);

  return (
    <form
      onSubmit={handleSubmit}
      className={` m-3 p-6 rounded-xl shadow-lg space-y-4 ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
    >
      <h2 className="text-xl font-semibold">Create Report</h2>

      {/* Categorias */}
      <select
        required
        onChange={(e) => setType(e.target.value)}
        className={` w-full px-3 py-2 rounded-lg outline-none ${currentTheme.colors.secondary} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
      >
        <option value={""}> select type of issue</option>
        <ReportsCategorySelector />
      </select>

      {/* description */}
      <div className="flex flex-col">
        <label className={`${currentTheme.textColor.secondary} text-sm mb-1`}>
          Description {optional && "(optional)"}
        </label>
        <textarea
          required={!optional}
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
