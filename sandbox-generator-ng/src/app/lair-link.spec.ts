import { convertToParamMap } from '@angular/router';
import { lairUrl, parseLairLink } from './lair-link';

describe('lair-link', () => {
  it('builds a link that carries the biome and the rolls', () => {
    expect(lairUrl('Forest', [3, 4, 2, 5, 6])).toBe(
      '/lairs?biome=Forest&rolls=3,4,2,5,6'
    );
  });

  it('reads the lair parameters from the query string', () => {
    expect(
      parseLairLink(convertToParamMap({ biome: 'Forest', rolls: '3,4,2,5,6' }))
    ).toEqual({ biome: 'Forest', rolls: [3, 4, 2, 5, 6] });
  });

  it('returns null when the page has no lair parameters', () => {
    expect(parseLairLink(convertToParamMap({}))).toBeNull();
  });

  it('rejects incomplete or invalid lair parameters', () => {
    expect(() => parseLairLink(convertToParamMap({ biome: 'Forest' }))).toThrowError(
      'Lair link must include both biome and rolls.'
    );
    expect(() =>
      parseLairLink(convertToParamMap({ biome: 'Forest', rolls: '3,x' }))
    ).toThrowError('Lair link rolls must be a comma-separated list of positive integers.');
  });
});
