import { convertToParamMap } from '@angular/router';
import { lairUrl, parseLairLink } from './lair-link';

describe('lair-link', () => {
  it('builds a link with one named parameter for each roll', () => {
    expect(lairUrl('Forest', [3, 4, 2, 5, 6])).toBe(
      '/lairs?biome=Forest&inhabitantsRoll1=3&inhabitantsRoll2=4&outsideRoll=2&outsideHexesRoll=5&layoutRoll=6'
    );
  });

  it('keeps the two split outside groups in the link', () => {
    expect(lairUrl('Mountains', [5, 5, 6, 8, 2, 4, 6])).toBe(
      '/lairs?biome=Mountains&inhabitantsRoll1=5&inhabitantsRoll2=5&outsideRoll=6&outsideHexesRoll=8&outsideGroupRoll1=2&outsideGroupRoll2=4&layoutRoll=6'
    );
  });

  it('reads the lair parameters from the query string', () => {
    expect(
      parseLairLink(
        convertToParamMap({
          biome: 'Forest',
          inhabitantsRoll1: '3',
          inhabitantsRoll2: '4',
          outsideRoll: '2',
          outsideHexesRoll: '5',
          layoutRoll: '6',
        })
      )
    ).toEqual({ biome: 'Forest', rolls: [3, 4, 2, 5, 6] });
  });

  it('rebuilds the split outside groups', () => {
    expect(
      parseLairLink(
        convertToParamMap({
          biome: 'Mountains',
          inhabitantsRoll1: '5',
          inhabitantsRoll2: '5',
          outsideRoll: '6',
          outsideHexesRoll: '8',
          outsideGroupRoll1: '2',
          outsideGroupRoll2: '4',
          layoutRoll: '6',
        })
      )
    ).toEqual({ biome: 'Mountains', rolls: [5, 5, 6, 8, 2, 4, 6] });
  });

  it('returns null when the page has no lair parameters', () => {
    expect(parseLairLink(convertToParamMap({}))).toBeNull();
  });

  it('names the missing or invalid parameter', () => {
    expect(() => parseLairLink(convertToParamMap({ biome: 'Forest' }))).toThrowError(
      'Lair link must include inhabitantsRoll1.'
    );
    expect(() =>
      parseLairLink(
        convertToParamMap({
          biome: 'Forest',
          inhabitantsRoll1: '3',
          inhabitantsRoll2: '4',
          outsideRoll: '2',
          outsideHexesRoll: '5',
          layoutRoll: 'x',
        })
      )
    ).toThrowError('Lair link layoutRoll must be an integer from 1 to 8.');
  });

  it('rejects outside groups when the outside hexes roll is not an 8', () => {
    expect(() =>
      parseLairLink(
        convertToParamMap({
          biome: 'Forest',
          inhabitantsRoll1: '3',
          inhabitantsRoll2: '4',
          outsideRoll: '2',
          outsideHexesRoll: '5',
          outsideGroupRoll1: '2',
          outsideGroupRoll2: '4',
          layoutRoll: '6',
        })
      )
    ).toThrowError(
      'Lair link outside groups are only used when outsideHexesRoll is 8.'
    );
  });
});
