export default function SkeletonNotification({ color = "#969aa2ff" }) {
  return (
    <div className="  rounded-md  bg-transparent  ">
      {/* Placeholder para el mensaje */}
      <div
        className="h-4 w-4/5 mb-2 rounded animate-pulse"
        style={{ backgroundColor: color }}
      ></div>

      {/* Placeholder para la fecha */}
      <div
        className="h-3 w-2/5 rounded animate-pulse"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
