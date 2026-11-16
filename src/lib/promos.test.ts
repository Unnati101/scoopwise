import { lookupPromo } from '@/lib/promos';

describe('lookupPromo', () => {
  it('finds standard codes regardless of case and spacing', () => {
    expect(lookupPromo('  frosty10 ', [])?.code).toBe('FROSTY10');
  });

  it('returns null for empty or unknown codes', () => {
    expect(lookupPromo('', [])).toBeNull();
    expect(lookupPromo('NOPE', [])).toBeNull();
  });

  it('turns a reward code into a one-time fixed discount', () => {
    expect(lookupPromo('rwd-abc123', [{ code: 'RWD-ABC123', value: 7 }])).toMatchObject({ kind: 'fixed', value: 7, reward: true });
  });
});
