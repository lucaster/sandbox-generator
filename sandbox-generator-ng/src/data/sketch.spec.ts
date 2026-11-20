import { seedFromKey, sketchPath } from './sketch';

describe('sketch helpers', () => {
  const path = 'M -20 -20 H 20 V 20 H -20 Z';

  it('derives a stable, non-zero seed from a key', () => {
    expect(seedFromKey('room:1')).toBe(seedFromKey('room:1'));
    expect(seedFromKey('room:1')).not.toBe(seedFromKey('room:2'));
    expect(seedFromKey('')).toBeGreaterThan(0);
  });

  it('returns a deterministic sketched path for the same key', () => {
    const first = sketchPath(path, 'room:1');
    const second = sketchPath(path, 'room:1');
    expect(first).toBe(second);
    expect(first).toContain('C');
    expect(first).not.toMatch(/\d\.\d{2,}/);
  });

  it('produces different sketched paths for different keys', () => {
    expect(sketchPath(path, 'room:1')).not.toBe(sketchPath(path, 'room:2'));
  });
});
