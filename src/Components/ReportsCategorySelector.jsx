import { ReportSelectorOptions } from "@/utils/consts";

export default function ReportsCategorySelector() {
  return (
    <>
      {ReportSelectorOptions.map((option) => {
        if (option.value == "other")
          return (
            <option key={option.name} value={option.value}>
              {option.name} ⬅️descrription'll be needed
            </option>
          );
        return (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </>
  );
}
