import { d } from './dice';

describe('dice function', () => {
  it('should return a number between 1 and die size', () => {
    const result = d(6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });

  it('should return a number between 1 and 20 for d20', () => {
    const result = d(20);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(20);
  });

  it('should return a number between 1 and 100 for d100', () => {
    const result = d(100);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(100);
  });
});

