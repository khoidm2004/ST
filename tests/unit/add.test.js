import add from '../../src/add.js'

describe('unit / add (real deps)', () => {
  describe('JSDoc examples', () => {
    test('add(6, 4) => 10', () => {
      expect(add(6, 4)).toBe(10)
    })
  })

  describe('cart / money totals', () => {
    test.each([
      [2.5, 1.25, 3.75],
      [0, 0, 0],
      [10, -3, 7],
      [0.1, 0.2, 0.30000000000000004], // IEEE-754; surfaces float risk in Scenario B
    ])('add(%p, %p) => %p', (a, b, expected) => {
      expect(add(a, b)).toBe(expected)
    })
  })

  describe('NaN and Infinity', () => {
    test.each([
      [NaN, 1, NaN],
      [1, NaN, NaN],
      [Infinity, 1, Infinity],
      [Infinity, -Infinity, NaN],
    ])('add(%p, %p) => %p', (a, b, expected) => {
      expect(add(a, b)).toEqual(expected)
    })
  })

  describe('partial and missing arguments', () => {
    test('both undefined => 0', () => {
      expect(add(undefined, undefined)).toBe(0)
    })

    test('only first argument => that value', () => {
      expect(add(5, undefined)).toBe(5)
    })

    test('only second argument => that value', () => {
      expect(add(undefined, 8)).toBe(8)
    })

    test('null augend is treated as 0', () => {
      expect(add(null, 5)).toBe(5)
    })

    test('null addend is treated as 0', () => {
      expect(add(5, null)).toBe(5)
    })
  })

  // Outside the documented number contract; concatenation would corrupt cart totals (Scenario B risk)
  describe('string operands are concatenated, not summed', () => {
    test.each([
      ['6', '4', '64'],
      [6, '4', '64'],
      ['2.50', 1, '2.501'],
    ])('add(%p, %p) => %p', (a, b, expected) => {
      expect(add(a, b)).toBe(expected)
    })
  })
})
