import { baseRelative } from './url';

describe('baseRelative', () => {
  it('strips the leading slash from app paths', () => {
    expect(baseRelative('/assets/images/forest.png')).toBe('assets/images/forest.png');
    expect(baseRelative('/lairs?biome=Forest')).toBe('lairs?biome=Forest');
  });

  it('keeps relative and external URLs untouched', () => {
    expect(baseRelative('assets/images/forest.png')).toBe('assets/images/forest.png');
    expect(baseRelative('https://example.com/forest.png')).toBe('https://example.com/forest.png');
  });
});
