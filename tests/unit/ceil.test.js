import ceil from '../../src/ceil.js'

describe('unit / ceil (real deps)', () => {
  describe('JSDoc examples', () => {
    test.each([
      [4.006, undefined, 5],
      [6.004, 2, 6.01],
      [6040, -2, 6100],
    ])('ceil(%p, %p) => %p', (number, precision, expected) => {
      expect(ceil(number, precision)).toBe(expected)
    })
  })

  describe('two-decimal price rounding (Scenario B/C)', () => {
    test.each([
      [2.5, 2, 2.5],
      [2.501, 2, 2.51],
      [9.999, 2, 10],
      [1.001, 2, 1.01],
      [0.001, 2, 0.01],
      [-1.234, 2, -1.23],
    ])('ceil(%p, %p) => %p', (number, precision, expected) => {
      expect(ceil(number, precision)).toBe(expected)
    })

    // 0.1 + 0.2 in IEEE-754; rounding up float noise overcharges by a cent (Scenario B risk)
    test('float noise is rounded up: ceil(0.30000000000000004, 2) => 0.31', () => {
      expect(ceil(0.30000000000000004, 2)).toBe(0.31)
    })

    test('numeric string input is rounded', () => {
      expect(ceil('4.006', 2)).toBe(4.01)
    })
  })

  describe('default and integer precision', () => {
    test('default precision rounds up a positive fraction', () => {
      expect(ceil(4.006)).toBe(5)
    })

    test('default precision rounds a negative fraction toward zero', () => {
      expect(ceil(-1.1)).toBe(-1)
    })

    test('precision 0 rounds up to integer', () => {
      expect(ceil(1.1, 0)).toBe(2)
    })

    test('already-integer stays unchanged at precision 0', () => {
      expect(ceil(3)).toBe(3)
    })

    test('non-integer precision is truncated to an integer', () => {
      expect(ceil(4.006, 1.5)).toBe(4.1)
    })
  })

  describe('negative precision', () => {
    test('rounds up to tens', () => {
      expect(ceil(1234, -1)).toBe(1240)
    })

    test('rounds up to hundreds', () => {
      expect(ceil(1201, -2)).toBe(1300)
    })
  })

  describe('NaN and Infinity', () => {
    test('NaN => NaN', () => {
      expect(ceil(NaN)).toEqual(NaN)
    })

    test('NaN with precision => NaN', () => {
      expect(ceil(NaN, 2)).toEqual(NaN)
    })

    test('Infinity => Infinity', () => {
      expect(ceil(Infinity)).toBe(Infinity)
    })

    test('Infinity with precision stays Infinity', () => {
      expect(ceil(Infinity, 2)).toBe(Infinity)
    })

    test('-Infinity with precision stays -Infinity', () => {
      expect(ceil(-Infinity, 2)).toBe(-Infinity)
    })
  })
})
