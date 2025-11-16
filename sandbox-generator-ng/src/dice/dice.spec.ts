import { d10, d12, d2, d20, d3, d4, d6, d8, dd, ddd } from './dice';

describe('dice', () => {
  describe('dd function (base dice)', () => {
    it('should be a curried function that returns a function', () => {
      const rollD6 = dd(6);
      expect(typeof rollD6).toBe('function');
    });

    it('should return a function that produces a number', () => {
      const rollD6 = dd(6);
      expect(typeof rollD6()).toBe('number');
    });

    it('should return values within the correct range for d6', () => {
      const rollD6 = dd(6);
      for (let i = 0; i < 100; i++) {
        const result = rollD6();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
      }
    });

    it('should return values within the correct range for d20', () => {
      const rollD20 = dd(20);
      for (let i = 0; i < 100; i++) {
        const result = rollD20();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(20);
      }
    });

    it('should work with different face values', () => {
      const rollD4 = dd(4);
      const rollD8 = dd(8);
      const rollD12 = dd(12);

      for (let i = 0; i < 50; i++) {
        expect(rollD4()).toBeGreaterThanOrEqual(1);
        expect(rollD4()).toBeLessThanOrEqual(4);
        expect(rollD8()).toBeGreaterThanOrEqual(1);
        expect(rollD8()).toBeLessThanOrEqual(8);
        expect(rollD12()).toBeGreaterThanOrEqual(1);
        expect(rollD12()).toBeLessThanOrEqual(12);
      }
    });

    it('should produce different results on multiple calls', () => {
      const rollD20 = dd(20);
      const results = new Set();
      for (let i = 0; i < 50; i++) {
        results.add(rollD20());
      }
      // With 50 rolls, we should get at least a few different values
      expect(results.size).toBeGreaterThan(1);
    });

    it('should create independent dice instances', () => {
      const rollD6_1 = dd(6);
      const rollD6_2 = dd(6);
      const rollD20 = dd(20);

      // Each instance should work independently
      const result1 = rollD6_1();
      const result2 = rollD6_2();
      const result3 = rollD20();

      expect(result1).toBeGreaterThanOrEqual(1);
      expect(result1).toBeLessThanOrEqual(6);
      expect(result2).toBeGreaterThanOrEqual(1);
      expect(result2).toBeLessThanOrEqual(6);
      expect(result3).toBeGreaterThanOrEqual(1);
      expect(result3).toBeLessThanOrEqual(20);
    });

    it('should handle edge case of d1', () => {
      const rollD1 = dd(1);
      for (let i = 0; i < 10; i++) {
        expect(rollD1()).toBe(1);
      }
    });
  });

  describe('ddd (multiple dice)', () => {
    it('should be a curried function', () => {
      const roll3d = ddd(3);
      expect(typeof roll3d).toBe('function');
      expect(typeof roll3d(6)).toBe('number');
    });

    it('should roll the correct number of dice', () => {
      const roll3d6 = ddd(3)(6);
      // Sum of 3d6 should be between 3 and 18
      expect(roll3d6).toBeGreaterThanOrEqual(3);
      expect(roll3d6).toBeLessThanOrEqual(18);
    });

    it('should handle single die', () => {
      const roll1d20 = ddd(1)(20);
      expect(roll1d20).toBeGreaterThanOrEqual(1);
      expect(roll1d20).toBeLessThanOrEqual(20);
    });

    it('should handle multiple dice with different faces', () => {
      const roll5d4 = ddd(5)(4);
      expect(roll5d4).toBeGreaterThanOrEqual(5);
      expect(roll5d4).toBeLessThanOrEqual(20);
    });

    it('should allow partial application', () => {
      const roll3d = ddd(3);
      const result1 = roll3d(6);
      const result2 = roll3d(20);

      expect(result1).toBeGreaterThanOrEqual(3);
      expect(result1).toBeLessThanOrEqual(18);
      expect(result2).toBeGreaterThanOrEqual(3);
      expect(result2).toBeLessThanOrEqual(60);
    });
  });

  describe('d20', () => {
    it('should return a number', () => {
      expect(typeof d20()).toBe('number');
    });

    it('should return a value between 1 and 20', () => {
      for (let i = 0; i < 100; i++) {
        const result = d20();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(20);
      }
    });

    it('should produce different results on multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 50; i++) {
        results.add(d20());
      }
      // With 50 rolls, we should get at least a few different values
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('d12', () => {
    it('should return a value between 1 and 12', () => {
      for (let i = 0; i < 100; i++) {
        const result = d12();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(12);
      }
    });
  });

  describe('d10', () => {
    it('should return a value between 1 and 10', () => {
      for (let i = 0; i < 100; i++) {
        const result = d10();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('d8', () => {
    it('should return a value between 1 and 8', () => {
      for (let i = 0; i < 100; i++) {
        const result = d8();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(8);
      }
    });
  });

  describe('d6', () => {
    it('should return a value between 1 and 6', () => {
      for (let i = 0; i < 100; i++) {
        const result = d6();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
      }
    });
  });

  describe('d4', () => {
    it('should return a value between 1 and 4', () => {
      for (let i = 0; i < 100; i++) {
        const result = d4();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(4);
      }
    });
  });

  describe('d3', () => {
    it('should return a value between 1 and 3', () => {
      for (let i = 0; i < 100; i++) {
        const result = d3();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('d2', () => {
    it('should return a value between 1 and 2', () => {
      for (let i = 0; i < 100; i++) {
        const result = d2();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle rolling zero dice', () => {
      const roll0d6 = ddd(0)(6);
      expect(roll0d6).toBe(0);
    });

    it('should handle rolling many dice', () => {
      const roll100d6 = ddd(100)(6);
      expect(roll100d6).toBeGreaterThanOrEqual(100);
      expect(roll100d6).toBeLessThanOrEqual(600);
    });
  });
});
