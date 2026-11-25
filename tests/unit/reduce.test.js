import reduce from '../../src/reduce.js'

const sum = (total, n) => total + n

describe('unit / reduce (real deps)', () => {
  describe('JSDoc examples', () => {
    test('sum array with initial accumulator', () => {
      expect(reduce([1, 2], sum, 0)).toBe(3)
    })

    test('group object keys by value', () => {
      const result = reduce(
        { a: 1, b: 2, c: 1 },
        (acc, value, key) => {
          ;(acc[value] || (acc[value] = [])).push(key)
          return acc
        },
        {}
      )
      expect(result[1].sort()).toEqual(['a', 'c'])
      expect(result[2]).toEqual(['b'])
    })
  })

  describe('arrays (cart line totals)', () => {
    test('sums product line prices', () => {
      const lines = [{ price: 2.5 }, { price: 9 }, { price: 1.5 }]
      expect(reduce(lines, (total, line) => total + line.price, 0)).toBe(13)
    })

    test('without accumulator uses first element as seed', () => {
      expect(reduce([1, 2, 3], sum)).toBe(6)
    })

    test('empty array with accumulator returns accumulator', () => {
      expect(reduce([], sum, 0)).toBe(0)
    })

    test('empty array without accumulator returns undefined', () => {
      expect(reduce([], sum)).toBeUndefined()
    })

    test('single-element array without accumulator returns that element', () => {
      expect(reduce([42], sum)).toBe(42)
    })

    // Passing undefined explicitly counts as an accumulator (Scenario B risk: NaN cart total)
    test('explicit undefined accumulator is used as seed => NaN for sums', () => {
      expect(reduce([1, 2], sum, undefined)).toEqual(NaN)
    })

    test('iteratee receives (accumulator, value, index, collection)', () => {
      const seen = []
      const collection = ['a', 'b']
      reduce(
        collection,
        (acc, value, index, coll) => {
          seen.push({ acc, value, index, same: coll === collection })
          return acc + value
        },
        ''
      )
      expect(seen).toEqual([
        { acc: '', value: 'a', index: 0, same: true },
        { acc: 'a', value: 'b', index: 1, same: true },
      ])
    })

    test('does not mutate the input array', () => {
      const lines = [1, 2, 3]
      reduce(lines, sum, 0)
      expect(lines).toEqual([1, 2, 3])
    })
  })

  describe('objects', () => {
    test('sums object values with accumulator', () => {
      expect(reduce({ x: 1, y: 2, z: 3 }, sum, 0)).toBe(6)
    })

    test('sums object values without accumulator', () => {
      expect(reduce({ a: 1, b: 2 }, sum)).toBe(3)
    })
  })

  describe('nullish collection', () => {
    test('null with accumulator returns accumulator', () => {
      expect(reduce(null, sum, 10)).toBe(10)
    })

    test('null without accumulator returns undefined', () => {
      expect(reduce(null, sum)).toBeUndefined()
    })

    test('undefined with accumulator returns accumulator', () => {
      expect(reduce(undefined, sum, 10)).toBe(10)
    })
  })
})
