import { stores } from '@/data/stores';
import { describeSchedule, describeSlot, describeStoreStatus } from '@/i18n/localize';
import { en } from '@/i18n/messages/en';
import { createI18n } from '@/i18n/translate';
import { getStoreStatus, getTimeSlots, isStoreOpenAt } from '@/lib/storeHours';

const downtown = stores[0]!;
const beachside = stores[1]!;
const i18n = createI18n('en', en);
// 2026-11-16 is a Monday; Date parts are local time so the tests do not depend on the machine's time zone.
const monday = (hours: number, minutes = 0) => new Date(2026, 10, 16, hours, minutes);

describe('getStoreStatus', () => {
  it('is open during opening hours', () => {
    const status = getStoreStatus(downtown, monday(15));
    expect(status).toEqual({ open: true, closesAt: 21 * 60 });
    expect(describeStoreStatus(status, i18n)).toBe('Open now, closes 9:00 PM');
  });

  it('says when it opens later today', () => {
    expect(describeStoreStatus(getStoreStatus(downtown, monday(9)), i18n)).toBe('Closed, opens today at 11:00 AM');
  });

  it('says when it opens tomorrow after closing', () => {
    expect(describeStoreStatus(getStoreStatus(downtown, monday(22)), i18n)).toBe('Closed, opens tomorrow at 11:00 AM');
  });

  it('treats closing time as closed', () => {
    expect(isStoreOpenAt(downtown, monday(21))).toBe(false);
    expect(isStoreOpenAt(downtown, monday(20, 59))).toBe(true);
  });
});

describe('getTimeSlots', () => {
  it('offers half-hour slots starting at least 30 minutes from now', () => {
    const slots = getTimeSlots([downtown], monday(14));
    expect(describeSlot(slots[0]!, i18n)).toBe('Today, 2:30 PM');
    expect(describeSlot(slots[1]!, i18n)).toBe('Today, 3:00 PM');
  });

  it('rolls over to tomorrow when the store is about to close', () => {
    expect(describeSlot(getTimeSlots([downtown], monday(20, 10))[0]!, i18n)).toBe('Tomorrow, 11:00 AM');
  });

  it('respects the requested count', () => {
    expect(getTimeSlots([downtown], monday(11), 4)).toHaveLength(4);
  });
});

describe('describeSchedule', () => {
  it('builds readable day ranges from the schedule', () => {
    expect(describeSchedule(downtown, i18n)).toEqual([
      { days: 'Mon - Thu', time: '11:00 AM - 9:00 PM' },
      { days: 'Fri - Sat', time: '11:00 AM - 11:00 PM' },
      { days: 'Sunday', time: '12:00 PM - 9:00 PM' },
    ]);
  });

  it('handles ranges that wrap past Saturday', () => {
    expect(describeSchedule(beachside, i18n)[1]).toEqual({ days: 'Fri - Sun', time: '10:00 AM - 11:00 PM' });
  });
});
