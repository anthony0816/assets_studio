export default function SkeletonAnimationGrid({
  minCellWidth = 150,
  gap = 4,
  cellCount = 12,
  h = 24,
}) {
  return (
    <div
      className="grid animate-pulse"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCellWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: cellCount }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-300 rounded-lg `}
          style={{ height: `${h}px` }}
        ></div>
      ))}
    </div>
  );
}
