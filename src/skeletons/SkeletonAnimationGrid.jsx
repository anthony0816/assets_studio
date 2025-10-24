export default function SkeletonAnimationGrid({
  minCellWidth = 150,
  gap = 4,
  cellCount = 12,
  h = 24,
  w = "100%",
  animation = "pulse",
}) {
  const animationTypes = {
    pulse: "grid animate-pulse",
    bounce: " grid animate-bounce",
    spin: " grid animate-spin",
    ping: " grid animate-ping",
    // todavia no funcionan , isntalar plugin de animaciones de tailwind
    flash: "grid animate-flash",
    rubberBand: "grid animate-rubberBand",
    shakeX: "grid animate-shakeX",
    shakeY: "grid animate-shakeY",
    headShake: "grid animate-headShake",
    swing: "grid animate-swing",
    tada: "grid animate-tada",
    wobble: "grid animate-wobble",
    jello: "grid animate-jello",
    heartBeat: "grid animate-heartBeat",
    hinge: "grid animate-hinge",
    jackInTheBox: "grid animate-jackInTheBox",
    rollIn: "grid animate-rollIn",
    rollOut: "grid animate-rollOut",
    zoomIn: "grid animate-zoomIn",
    zoomOut: "grid animate-zoomOut",
  };

  return (
    <div
      className={`${animationTypes[animation]}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCellWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: cellCount }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-300 rounded-lg `}
          style={{ height: `${h}px`, width: w }}
        ></div>
      ))}
    </div>
  );
}
