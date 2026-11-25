import toNumber from '../../src/toNumber.js'

describe('unit / toNumber (real deps)', () => {
  describe('JSDoc examples', () => {
    test.each([
      [3.2, 3.2],
      [Number.MIN_VALUE, 5e-324],
      [Infinity, Infinity],
      ['3.2', 3.2],
    ])('toNumber(%p) => %p', (input, expected) => {
      expect(toNumber(input)).toBe(expected)
    })
  })

  describe('numbers and special values', () => {
    test.each([
      [0, 0],
      [-0, -0],
      [-3.2, -3.2],
      [NaN, NaN],
      [-Infinity, -Infinity],
    ])('toNumber(%p) => %p', (input, expected) => {
      expect(toNumber(input)).toEqual(expected)
    })
  })

  describe('string parsing (prices / quantities)', () => {
    test.each([
      ['  42  ', 42],
      ['-2.5', -2.5],
      ['2.50', 2.5],
      ['1e3', 1000],
      ['0', 0],
      ['0b1010', 10],
      ['0o10', 8],
      ['0x1A', 26],
      ['+0x1', NaN],
      ['-0x1', NaN],
      ['0b2', NaN],
      ['abc', NaN],
      ['1,50', NaN], // comma decimal is not parsed (Scenario B locale risk)
    ])('toNumber(%p) => %p', (input, expected) => {
      expect(toNumber(input)).toEqual(expected)
    })

    // A blank mandatory price silently becomes 0 (Scenario C risk)
    test.each([
      ['', 0],
      ['   ', 0],
    ])('blank string %p => %p', (input, expected) => {
      expect(toNumber(input)).toBe(expected)
    })
  })

  describe('symbols, objects, and other types', () => {
    test('symbol => NaN', () => {
      expect(toNumber(Symbol('x'))).toEqual(NaN)
    })

    test('object with valueOf number uses that number', () => {
      expect(toNumber({ valueOf: () => 7 })).toBe(7)
    })

    test('object with valueOf returning 0 => 0', () => {
      expect(toNumber({ valueOf: () => 0 })).toBe(0)
    })

    test('object whose valueOf is not a function => NaN', () => {
      expect(toNumber({ valueOf: 1 })).toEqual(NaN)
    })

    test('plain object => NaN', () => {
      expect(toNumber({})).toEqual(NaN)
    })

    test('empty array => 0', () => {
      expect(toNumber([])).toBe(0)
    })

    test('single-number array => that number', () => {
      expect(toNumber([5])).toBe(5)
    })

    test('null-prototype object throws TypeError', () => {
      expect(() => toNumber(Object.create(null))).toThrow(TypeError)
    })

    test('true => 1', () => {
      expect(toNumber(true)).toBe(1)
    })

    test('false => 0', () => {
      expect(toNumber(false)).toBe(0)
    })

    test('null => 0', () => {
      expect(toNumber(null)).toBe(0)
    })

    test('undefined => NaN', () => {
      expect(toNumber(undefined)).toEqual(NaN)
    })
  })
})
