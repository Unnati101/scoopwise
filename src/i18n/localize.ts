import { flavors as flavorCatalog } from '@/data/flavors';
import { menuItems } from '@/data/menu';
import type { I18n } from '@/i18n/translate';
import type { Messages } from '@/i18n/messages/en';
import { describeCreation } from '@/lib/builder';
import type { StoreStatus, TimeSlot } from '@/lib/storeHours';
import type { CartLine, Flavor, MenuItem, Store } from '@/types';

type Formatter = Pick<I18n, 'm' | 't' | 'formatTime' | 'formatWeekday'>;

const clock = (minutes: number) => new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);

export function localizeStore(store: Store, m: Messages): Store {
  return { ...store, name: m.data.stores[store.id] ?? store.name };
}

export function describeStoreStatus(status: StoreStatus, { t, formatTime, formatWeekday }: Formatter): string {
  if (status.open) return t('locations.openNow', { time: formatTime(clock(status.closesAt)) });
  if (status.opens === 'never') return t('locations.closed');
  const time = formatTime(clock(status.opensAt));
  if (status.opens === 'today') return t('locations.opensToday', { time });
  if (status.opens === 'tomorrow') return t('locations.opensTomorrow', { time });
  return t('locations.opensDay', { day: formatWeekday(status.day), time });
}

export function describeSlot(slot: TimeSlot, { t, formatTime, formatWeekday }: Formatter): string {
  const day = slot.dayOffset === 0 ? t('locations.today') : slot.dayOffset === 1 ? t('locations.tomorrow') : formatWeekday(slot.weekday);
  return t('locations.slot', { day, time: formatTime(slot.value) });
}

/** One line per opening-hours rule, e.g. "Mon - Thu: 11:00 AM - 9:00 PM". */
export function describeSchedule(store: Store, { t, formatTime, formatWeekday }: Formatter): { days: string; time: string }[] {
  return store.schedule.map(({ days, open, close }) => {
    const ordered = [...days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
    const first = ordered[0] ?? 0;
    const last = ordered[ordered.length - 1] ?? first;
    const consecutive = ordered.every((day, index) => index === 0 || (day + 6) % 7 === ((ordered[index - 1] ?? 0) + 6) % 7 + 1);
    const label =
      ordered.length === 1
        ? formatWeekday(first)
        : consecutive
          ? t('locations.daysRange', { from: formatWeekday(first, 'short'), to: formatWeekday(last, 'short') })
          : ordered.map((day) => formatWeekday(day, 'short')).join(', ');
    return { days: label, time: `${formatTime(clock(open))} - ${formatTime(clock(close))}` };
  });
}

export function localizeFlavor(flavor: Flavor, m: Messages): Flavor {
  const text = m.data.flavors[flavor.id];
  return text ? { ...flavor, ...text } : flavor;
}

export function localizeMenuItem(item: MenuItem, m: Messages): MenuItem {
  const text = m.data.menuItems[item.id];
  return text ? { ...item, ...text } : item;
}

/** Display name and detail for a cart or order line, in the active language. */
export function localizeLine(line: CartLine, { m, t }: Pick<I18n, 'm' | 't'>): { name: string; detail?: string } {
  if (line.kind === 'flavor') return { name: m.data.flavors[line.id]?.name ?? line.name };
  if (line.kind === 'menu') return { name: m.data.menuItems[line.id]?.name ?? line.name };
  if (!line.creation) return { name: line.name, detail: line.detail };

  const flavors = flavorCatalog.map((flavor) => localizeFlavor(flavor, m));
  const toppings = menuItems.filter((item) => item.category === 'Toppings').map((item) => localizeMenuItem(item, m));
  const vessel = m.data.vessels[line.creation.vesselId]?.name ?? '';
  return {
    name: t('builder.customName', { vessel }),
    detail: describeCreation(line.creation, flavors, toppings, (scoops, extras) => t('builder.withToppings', { scoops, toppings: extras })),
  };
}
