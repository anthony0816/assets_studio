import { Options } from "@/utils/consts";

export default function CategorySelector() {
  return (
    <>
      {Options.map((option) => (
        <option key={option.value} value={option.param}>
          {option.name}
        </option>
      ))}
    </>
  );
}
