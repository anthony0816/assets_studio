export function OptionsDots({ color }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={`${color}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx={4} cy={12} r={2} />
      <circle cx={12} cy={12} r={2} />
      <circle cx={20} cy={12} r={2} />
    </svg>
  );
}
