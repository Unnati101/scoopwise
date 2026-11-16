import { useI18n } from '@/i18n/provider';
import type { Flavor } from '@/types';

interface BuilderPreviewProps {
  vesselId: string;
  scoops: Flavor[];
  toppingIds: string[];
}

const SPRINKLES: [number, number, number, string][] = [
  [78, 16, 20, '#F7A3B7'],
  [100, 6, -30, '#FFC94A'],
  [122, 18, 40, '#A9E2C3'],
  [92, 28, 70, '#E5456E'],
  [112, 30, -50, '#A3ABE8'],
];

function Vessel({ vesselId }: { vesselId: string }) {
  switch (vesselId) {
    case 'cup':
      return (
        <g>
          <path d="M40 150h120l-20 130H60z" fill="hsl(var(--primary))" />
          <g fill="#fff" opacity=".8">
            <circle cx="80" cy="185" r="4" />
            <circle cx="115" cy="205" r="4" />
            <circle cx="95" cy="240" r="4" />
            <circle cx="125" cy="170" r="4" />
          </g>
        </g>
      );
    case 'waffle-bowl':
      return (
        <g>
          <path d="M30 150h140q-10 120-70 130-60-10-70-130z" fill="#D9A15F" />
          <path d="M50 175l95 70M75 160l75 55M45 220l70 45M150 165l-90 80M120 160l-80 60" stroke="#B97E3C" strokeWidth="3" opacity=".6" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M55 150h90l-45 140z" fill={vesselId === 'waffle-cone' ? '#D9A15F' : '#E9C48A'} />
          <path d="M70 160l55 50M85 190l35 30M130 160l-50 60M115 195l-25 50M75 205l45 35" stroke="#B97E3C" strokeWidth="3" opacity=".55" />
        </g>
      );
  }
}

function Toppings({ ids, topY }: { ids: string[]; topY: number }) {
  return (
    <g transform={`translate(0 ${topY - 10})`}>
      {ids.includes('menu-hot-fudge') && (
        <path d="M62 30q38-22 76 0l-6 14q-4 14-8 0-4 18-10 0-4 16-10 0-4 12-10 0-6 14-10 0-6 10-10-4z" fill="#4A2C20" />
      )}
      {ids.includes('menu-sprinkles') &&
        SPRINKLES.map(([x, y, angle, color]) => <rect key={`${x}-${y}`} x={x - 6} y={y} width="12" height="4" rx="2" fill={color} transform={`rotate(${angle} ${x} ${y + 2})`} />)}
      {ids.includes('menu-crushed-cookies') && (
        <g fill="#6B4128">
          <rect x="80" y="14" width="9" height="7" rx="2" />
          <rect x="104" y="8" width="8" height="8" rx="2" transform="rotate(25 108 12)" />
          <rect x="118" y="22" width="9" height="6" rx="2" />
        </g>
      )}
      {ids.includes('menu-fresh-strawberries') && (
        <g fill="#E5456E">
          <path d="M68 22q8-8 16 0l-8 14z" />
          <path d="M116 18q8-8 16 0l-8 14z" />
        </g>
      )}
      {ids.includes('menu-whipped-cherry') && (
        <g>
          <path d="M80 22q20-26 40 0z" fill="#fff" stroke="#F3D9D9" />
          <circle cx="100" cy="-4" r="9" fill="#C0213F" />
          <path d="M100 -12q6-12 14-14" stroke="#4A7A3C" strokeWidth="2.5" fill="none" />
        </g>
      )}
    </g>
  );
}

export function BuilderPreview({ vesselId, scoops, toppingIds }: BuilderPreviewProps) {
  const { t } = useI18n();
  const topY = scoops.length > 0 ? 140 - (scoops.length - 1) * 48 - 46 : 100;

  return (
    <svg viewBox="0 -30 200 330" className="mx-auto h-full max-h-[22rem] w-full" role="img" aria-label={t('builder.previewLabel', { count: scoops.length })}>
      <Vessel vesselId={vesselId} />
      {scoops.length === 0 && (
        <circle cx="100" cy="100" r="44" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="8 8" opacity=".5" />
      )}
      {scoops.map((flavor, index) => {
        const cy = 140 - index * 48;
        return (
          <g key={`${flavor.id}-${index}`} className="animate-fade-up">
            <circle cx="100" cy={cy} r="46" fill={flavor.color} />
            <ellipse cx="82" cy={cy - 22} rx="14" ry="7" fill="#fff" opacity=".4" transform={`rotate(-30 82 ${cy - 22})`} />
            {flavor.speckle && (
              <g fill={flavor.speckle}>
                <circle cx="108" cy={cy - 6} r="3" />
                <circle cx="124" cy={cy + 8} r="3" />
                <circle cx="90" cy={cy + 10} r="3" />
                <circle cx="112" cy={cy + 24} r="3" />
                <circle cx="78" cy={cy - 2} r="3" />
              </g>
            )}
          </g>
        );
      })}
      {scoops.length > 0 && <Toppings ids={toppingIds} topY={topY} />}
    </svg>
  );
}
