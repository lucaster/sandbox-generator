import {
  calcNpc,
  tableNpcAttitude,
  tableNpcClothes,
  tableNpcDream,
  tableNpcFavoriteThing,
  tableNpcFirstName,
  tableNpcHobby,
  tableNpcOccupation,
  tableNpcParticularity,
  tableNpcRelationship,
  tableNpcSecret,
  tableNpcSurname,
} from './npc';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

describe('npc.ts tables', () => {
  it('uses the 2023 first name and surname tables', () => {
    expect(tableNpcFirstName.dice).toBe('1d20');
    expect(Object.values(tableNpcFirstName.options)).toEqual([
      'Ann',
      'Arthur',
      'Bella',
      'Cecilia',
      'David',
      'Dina',
      'Eliza',
      'Finn',
      'Georg',
      'Hank',
      'Helen',
      'Ingol',
      'John',
      'Lilly',
      'Mona',
      'Olov',
      'Sophie',
      'Thomas',
      'Tisha',
      'Will',
    ]);

    expect(tableNpcSurname.dice).toBe('1d20');
    expect(Object.values(tableNpcSurname.options)).toEqual([
      'Briggs',
      'Burrows',
      'Button',
      'Cray',
      'Flint',
      'Gibbs',
      'Griffith',
      'Hartley',
      'Head',
      'Hook',
      'Lloyd',
      'Moore',
      'Poole',
      'Powell',
      'Quinn',
      'Robinson',
      'Shaw',
      'Smith',
      'Taylor',
      'Wright',
    ]);
  });

  it('uses the 2023 occupation table', () => {
    expect(tableNpcOccupation.dice).toBe('1d100');
    expect(Object.keys(tableNpcOccupation.options).length).toBe(100);
    expect(tableNpcOccupation.options[1]).toBe('Accountant');
    expect(tableNpcOccupation.options[50]).toBe('Jeweler');
    expect(tableNpcOccupation.options[100]).toBe('Writer');
  });

  it('uses the 2023 appearance tables', () => {
    expect(tableNpcClothes.options).toEqual({
      1: 'Dirty',
      2: 'Neglected',
      3: 'Neglected',
      4: 'Neutral',
      5: 'Neutral',
      6: 'Groomed',
      7: 'Groomed',
      8: 'Flamboyant',
    });

    expect(tableNpcParticularity.options).toEqual({
      1: 'None',
      2: 'None',
      3: 'None',
      4: 'None',
      5: 'None',
      6: 'Eccentric hairstyle',
      7: 'Piercings',
      8: 'Rare eye color',
      9: 'Scar(s)',
      10: 'Tattoo(s)',
    });
  });

  it('uses the 2023 personality tables', () => {
    expect(tableNpcAttitude.options).toEqual({
      1: 'Aggressive',
      2: 'Apathetic',
      3: 'Cheerful',
      4: 'Condescending',
      5: 'Confident',
      6: 'Depressed',
      7: 'Friendly',
      8: 'Neutral',
      9: 'Outgoing',
      10: 'Secretive',
      11: 'Seductive',
      12: 'Submissive',
    });

    expect(tableNpcFavoriteThing.options).toEqual({
      1: 'None',
      2: 'Book',
      3: 'Clothes/Cape/Hat',
      4: 'Flowers',
      5: 'Food',
      6: 'House',
      7: 'Keepsake',
      8: 'Money',
      9: 'Music instrument',
      10: 'Pet',
      11: 'Piece of jewelry',
      12: 'Weapon',
    });
  });

  it('uses the 2023 dream and hobby tables', () => {
    expect(tableNpcDream.options).toEqual({
      1: 'None',
      2: 'Becoming an adventurer',
      3: 'Being famous',
      4: 'Being powerful',
      5: 'Being respected',
      6: 'Being rich',
      7: 'Being self-sufficient',
      8: 'Bringing peace to the world',
      9: 'Buying a big property',
      10: 'Changing of occupation',
      11: 'Discovering something new',
      12: 'Dominating others',
      13: 'Finding true love',
      14: 'Helping others',
      15: 'Living a peaceful life',
      16: 'Living elsewhere',
      17: 'Organizing an event',
      18: 'Starting a family',
      19: 'Touring the world',
      20: 'Writing a book/their memoirs',
    });

    expect(tableNpcHobby.options).toEqual({
      1: 'None',
      2: 'Camping',
      3: 'Collecting',
      4: 'Cooking',
      5: 'Drawing',
      6: 'Embroidery',
      7: 'Flea markets',
      8: 'Fishing',
      9: 'Gambling',
      10: 'Gardening',
      11: 'Hiking',
      12: 'Hunting',
      13: 'Music',
      14: 'Painting',
      15: 'Partying',
      16: 'Reading',
      17: 'Sewing',
      18: 'Sports',
      19: 'Traveling',
      20: 'Woodworking',
    });
  });

  it('uses the 2023 secret and relationship tables', () => {
    expect(tableNpcSecret.options).toEqual({
      1: 'Has a dark past',
      2: 'Has a huge debt',
      3: 'Has an addiction',
      4: 'Has an affair',
      5: 'Has questionable connections',
      6: "Has stolen someone's identity",
      7: 'Has stolen something',
      8: 'Hides an illness/mutation',
      9: 'Is from a (very) rich family',
      10: 'Is part of a secret organization',
      11: 'Was adopted',
      12: 'Was once kidnapped/abducted',
    });

    expect(tableNpcRelationship.options).toEqual({
      1: 'Neutral',
      2: 'Neutral',
      3: 'Neutral',
      4: 'Neutral',
      5: 'Neutral',
      6: 'Neutral',
      7: 'Neutral',
      8: 'Neutral',
      9: 'Neutral',
      10: 'Neutral',
      11: 'Bad reputation',
      12: 'Bullied',
      13: 'Confidant',
      14: 'Feared',
      15: 'Ignored',
      16: 'Loved',
      17: 'Misunderstood',
      18: 'Outsider',
      19: 'Popular',
      20: 'Trusted',
    });
  });
});

describe('npc.ts calcNpc', () => {
  it('reproduces the book example (Helen Gibbs)', () => {
    const npc = calcNpc(
      sequence([
        11, // Helen
        6, // Gibbs
        69, // Musician
        4, // Neutral clothes
        9, // Scar(s)
        4, // Condescending
        10, // Pet
        2, // Becoming an adventurer
        2, // Camping
        1, // has a secret
        11, // Was adopted
        16, // Loved
      ])
    );

    expect(npc).toEqual({
      firstName: 'Helen',
      surname: 'Gibbs',
      name: 'Helen Gibbs',
      occupation: 'Musician',
      appearance: {
        clothes: 'Neutral',
        particularity: 'Scar(s)',
      },
      attitude: 'Condescending',
      favoriteThing: 'Pet',
      dream: 'Becoming an adventurer',
      hobby: 'Camping',
      secret: 'Was adopted',
      relationships: ['Loved'],
    });
  });

  it('leaves the secret null on a 2-6', () => {
    const npc = calcNpc(sequence([11, 6, 69, 4, 9, 4, 10, 2, 2, 2, 16]));

    expect(npc.secret).toBeNull();
    expect(npc.relationships).toEqual(['Loved']);
  });

  it('always rolls dream, hobby, secret, and one relationship', () => {
    const requestedFaces: number[] = [];
    calcNpc((faces) => {
      requestedFaces.push(faces);
      return 1;
    });

    expect(requestedFaces).toEqual([
      20, // first name
      20, // surname
      100, // occupation
      8, // clothes
      10, // particularity
      12, // attitude
      12, // favorite thing
      20, // dream
      20, // hobby
      6, // secret check
      12, // secret
      20, // relationship
    ]);
  });

  it('maps every relationship roll to the 2023 table', () => {
    const expected: { [roll: number]: string } = {
      1: 'Neutral',
      2: 'Neutral',
      3: 'Neutral',
      4: 'Neutral',
      5: 'Neutral',
      6: 'Neutral',
      7: 'Neutral',
      8: 'Neutral',
      9: 'Neutral',
      10: 'Neutral',
      11: 'Bad reputation',
      12: 'Bullied',
      13: 'Confidant',
      14: 'Feared',
      15: 'Ignored',
      16: 'Loved',
      17: 'Misunderstood',
      18: 'Outsider',
      19: 'Popular',
      20: 'Trusted',
    };

    for (let roll = 1; roll <= 20; roll++) {
      const npc = calcNpc(
        sequence([1, 1, 1, 1, 1, 1, 1, 1, 1, 2, roll])
      );

      expect(npc.relationships).toEqual([expected[roll]]);
    }
  });
});
