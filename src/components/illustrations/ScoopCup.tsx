interface ScoopCupProps {
  color: string;
  speckle?: string;
  className?: string;
}

const SPECKLES: [number, number][] = [
  [46, 44],
  [62, 32],
  [76, 46],
  [56, 54],
  [70, 58],
  [40, 58],
  [84, 56],
];

export function ScoopCup({ color, speckle, className }: ScoopCupProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path d="M30 64h60l-8 43a5 5 0 0 1-5 4H43a5 5 0 0 1-5-4z" fill="hsl(var(--primary))" />
      <g fill="#fff" opacity=".8">
        <circle cx="48" cy="80" r="2.4" />
        <circle cx="62" cy="92" r="2.4" />
        <circle cx="74" cy="78" r="2.4" />
        <circle cx="56" cy="102" r="2" />
        <circle cx="68" cy="102" r="2" />
      </g>
      <path d="M26 64c0-24 16-42 34-42s34 18 34 42z" fill={color} />
      <path d="M23 62h74a6 6 0 0 1 0 9H23a6 6 0 0 1 0-9z" fill={color} />
      <path d="M23 66h74a6 6 0 0 1-3 5H26a6 6 0 0 1-3-5z" fill="#000" opacity=".08" />
      <ellipse cx="45" cy="40" rx="9" ry="5" fill="#fff" opacity=".4" transform="rotate(-35 45 40)" />
      {speckle && (
        <g fill={speckle}>
          {SPECKLES.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" />
          ))}
        </g>
      )}
    </svg>
  );
}
