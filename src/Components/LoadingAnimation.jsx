export default function LoadingAnimation({ size = 8, color = "blue" }) {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div
        className={`bg-${color}-500 rounded-full animate-bounce`}
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
      <div
        className={`bg-${color}-500 rounded-full animate-bounce`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: "0.1s",
        }}
      ></div>
      <div
        className={`bg-${color}-500 rounded-full animate-bounce`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: "0.2s",
        }}
      ></div>
    </div>
  );
}
