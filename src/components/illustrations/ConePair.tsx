function Cone({ x, y, tilt, scoops }: { x: number; y: number; tilt: number; scoops: string[] }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path d="M-34 0h68L0 150z" fill="#E9B872" />
      <path d="M-22 22l36 18M-12 48l24 12M-30 8l60 28M-6 74l12 6M-26 14l32 70M-6 30l22 78M10 20l-12 90M26 14l-32 90" stroke="#C98F4B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {scoops.map((color, index) => (
        <g key={color + index}>
          <circle cx="0" cy={-18 - index * 46} r={42 - index * 4} fill={color} />
          <ellipse cx="0" cy={-4 - index * 46} rx={44 - index * 4} ry="10" fill={color} />
          <ellipse cx={-14 - index * 2} cy={-34 - index * 46} rx="9" ry="5" fill="#fff" opacity=".45" transform={`rotate(-35 ${-14 - index * 2} ${-34 - index * 46})`} />
        </g>
      ))}
    </g>
  );
}

export function ConePair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 330" className={className} aria-hidden="true">
      <Cone x={95} y={150} tilt={-10} scoops={['#7A4A33', '#F7A3B7']} />
      <Cone x={208} y={160} tilt={12} scoops={['#F7A3B7', '#F6E3B0']} />
      <g fill="#fff" opacity=".9">
        <path d="M150 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
        <path d="M260 60l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </g>
    </svg>
  );
}
