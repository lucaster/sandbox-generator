import { extractBracketElements, generateName, generateRandomName, generateRandomNameVariants } from './names';

describe('names.ts', () => {
  describe('extractBracketElements', () => {
    it('extracts elements within brackets', () => {
      expect(extractBracketElements('')).toEqual([]);
      expect(extractBracketElements(' ')).toEqual([]);
      expect(extractBracketElements('{A}')).toEqual(['A']);
      expect(extractBracketElements('aaa{A}aaa')).toEqual(['A']);
      expect(extractBracketElements('A{A}A')).toEqual(['A']);
      expect(extractBracketElements('{A} {B}')).toEqual(['A', 'B']);
      expect(extractBracketElements('{A}s {B}')).toEqual(['A', 'B']);
      expect(extractBracketElements('{A} {B} {C}')).toEqual(['A', 'B', 'C']);
    });
  });
  describe('generateName', () => {
    it('generates names', () => {
      expect(generateName('{A}')).not.toBeFalsy();
      expect(generateName('{A} {B} {F}')).not.toBeFalsy();
    });
    it('does not replace non-existing placeholders', () => {
      expect(generateName('{X}')).toBe('{X}');
    });
  });
  describe('generateRandomName', () => {
    it('generates a random name variant', () => {
      expect(generateRandomName()).not.toBeFalsy();
    });
  });
   describe('generateRandomVariants', () => {
    it('generates a random name variant', () => {
      const actual = generateRandomNameVariants();
      expect(actual).not.toBeFalsy();
      expect(actual.length).not.toBeFalsy();
    });
  });

});
