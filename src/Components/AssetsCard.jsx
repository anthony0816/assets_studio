import { useTheme } from "@/context/themeContext";
export default function AssetsCard({ asset }) {
  const { currentTheme } = useTheme();
  return (
    <>
      <div
        className={`${currentTheme.colors.secondary} rounded-lg shadow hover:shadow-lg transition overflow-hidden`}
      >
        <img
          src={asset.src}
          alt={`Asset ${asset.id}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-3 flex flex-col gap-1">
          <span className={`text-sm ${currentTheme.textColor.primary}`}>
            Likes: {asset.likes} | Reports: {asset.reports}
          </span>
          <span className={`text-xs ${currentTheme.textColor.secondary}`}>
            {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </>
  );
}
