import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";

import { useLoadingRouter } from "./LoadingRouterProvider";
import { CreateReport } from "@/utils/functions";
import ReportsCategorySelector from "./ReportsCategorySelector";
import LoadingSpinner from "./LoadingSpiner";

export default function ReportForm({ asset_id, onError, onSucces }) {
  {
    /* custom hooks */
  }
  const { user } = useAuth();
  const { router } = useLoadingRouter();

  {
    /* Estados  */
  }

  const [type, setType] = useState(null);
  const [description, setDescription] = useState("");
  const [optional, setOptional] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  {
    /* estilos */
  }
  const { currentTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type == "") return;
    if (type == "other" && description == "") return;
    if (!user) return router("/login");
    setisLoading(true);
    const res = await CreateReport(asset_id, user.uid, type, description);

    {
      //  handle  error
    }
    if (!res.ok) {
      const { status, message } = await res.json();
      console.log("status:", res.status, "mensaje:", message);
      onError();
      setisLoading(false);
      return;
    }

    //  handle Succes

    const { report, status } = await res.json();
    if (report) {
      console.log("report:", report);
      onSucces();
      setisLoading(false);
      return;
    }
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
        {isLoading ? <LoadingSpinner color="white" /> : "Report"}
      </button>
    </form>
  );
}
