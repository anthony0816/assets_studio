export default function LikeIcon({ liked = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={liked ? "rgba(200, 28, 28, 1)" : "gray"}
      width="30"
      height="30"
      aria-hidden="true"
    >
      <path d="M12.001 21.35l-1.45-1.32C6.14 15.99 3 13.14 3 9.88 3 7.19 5.19 5 7.88 5c1.54 0 3.04.73 4.12 1.88A5.84 5.84 0 0 1 16.12 5C18.81 5 21 7.19 21 9.88c0 3.26-3.14 6.11-7.55 10.15l-1.449 1.32z" />
    </svg>
  );
}
