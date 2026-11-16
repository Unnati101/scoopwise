function Scoop({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <ellipse cx={cx} cy={cy + r * 0.78} rx={r * 1.05} ry={r * 0.3} fill={color} />
      <ellipse cx={cx} cy={cy + r * 0.86} rx={r * 1.05} ry={r * 0.18} fill="#000" opacity=".08" />
      <ellipse cx={cx - r * 0.38} cy={cy - r * 0.4} rx={r * 0.24} ry={r * 0.13} fill="#fff" opacity=".45" transform={`rotate(-35 ${cx - r * 0.38} ${cy - r * 0.4})`} />
    </g>
  );
}

export function HeroSundae({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 420" className={className} aria-hidden="true">
      <rect x="236" y="40" width="18" height="120" rx="5" fill="#E9BE78" transform="rotate(20 245 100)" />
      <rect x="262" y="52" width="18" height="110" rx="5" fill="#D9A55A" transform="rotate(36 271 107)" />
      <Scoop cx={148} cy={206} r={52} color="#F6E3B0" />
      <Scoop cx={252} cy={206} r={52} color="#F7A3B7" />
      <Scoop cx={200} cy={150} r={58} color="#7A4A33" />
      <path d="M150 128c10 14 6 30 14 34s14-12 12-26c8 4 8 20 20 20s6-22 14-30" fill="none" stroke="#F7A3B7" strokeWidth="6" strokeLinecap="round" opacity=".9" />
      <path d="M200 98c-2-16 6-30 22-38" fill="none" stroke="#4E7A3A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="104" r="17" fill="#C81E3F" />
      <ellipse cx="194" cy="98" rx="5" ry="3" fill="#fff" opacity=".5" />
      <path d="M104 238h192l-24 140a14 14 0 0 1-14 12H142a14 14 0 0 1-14-12z" fill="hsl(var(--primary))" />
      <rect x="96" y="228" width="208" height="22" rx="11" fill="#fff" opacity=".35" />
      <g fill="#fff" opacity=".85">
        <circle cx="152" cy="282" r="6" />
        <circle cx="200" cy="270" r="6" />
        <circle cx="248" cy="282" r="6" />
        <circle cx="176" cy="322" r="6" />
        <circle cx="224" cy="322" r="6" />
        <circle cx="200" cy="362" r="6" />
      </g>
      <g fill="#FFC94A">
        <path d="M70 120l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" />
        <path d="M338 210l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
      </g>
      <g fill="hsl(var(--primary))" opacity=".7">
        <path d="M330 80c0-9 12-9 12 0 0 6-6 10-6 14 0-4-6-8-6-14z" />
        <path d="M58 250c0-7 9-7 9 0 0 5-4.5 7.5-4.5 10.5 0-3-4.5-5.5-4.5-10.5z" />
      </g>
    </svg>
  );
}
