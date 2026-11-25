import filter from '../../src/filter.js'

/**
 * Expectations follow JSDoc + Test Plan §9.2 (UT-F-*).
 * Observed mismatches with the implementation are defects to report, not silent softens.
 */
describe('unit / filter (real deps)', () => {
  describe('JSDoc example', () => {
    test('keeps active users (UT-F-01)', () => {
      const users = [
        { user: 'barney', active: true },
        { user: 'fred', active: false },
      ]
      expect(filter(users, ({ active }) => active)).toEqual([
        { user: 'barney', active: true },
      ])
    })
  })

  describe('Scenario A — product search/filter', () => {
    test('filters by max price (UT-F-02)', () => {
      const products = [
        { name: 'Bread', price: 2.5 },
        { name: 'Cheese', price: 9 },
      ]
      expect(filter(products, (p) => p.price <= 5)).toEqual([
        { name: 'Bread', price: 2.5 },
      ])
    })

    test('filters by producer (UT-F-03)', () => {
      const products = [{ producer: 'A' }, { producer: 'B' }]
      expect(filter(products, (p) => p.producer === 'A')).toEqual([
        { producer: 'A' },
      ])
    })
  })

  describe('boundaries and empty results', () => {
    test('no matches => [] (UT-F-04)', () => {
      expect(filter([1, 2, 3], () => false)).toEqual([])
    })

    test('all match => same elements (UT-F-05)', () => {
      expect(filter([1, 2], () => true)).toEqual([1, 2])
    })

    test('empty array => [] (UT-F-06)', () => {
      expect(filter([], () => true)).toEqual([])
    })

    test('null collection => [] (UT-F-07)', () => {
      expect(filter(null, () => true)).toEqual([])
    })

    test('undefined collection => []', () => {
      expect(filter(undefined, () => true)).toEqual([])
    })
  })

  describe('predicate arguments', () => {
    test('invokes predicate with (value, index, array)', () => {
      const array = ['x', 'y']
      const calls = []
      filter(array, (value, index, coll) => {
        calls.push({ value, index, same: coll === array })
        return true
      })
      expect(calls).toEqual([
        { value: 'x', index: 0, same: true },
        { value: 'y', index: 1, same: true },
      ])
    })

    test('returns a new array (does not mutate input)', () => {
      const input = [1, 2, 3]
      const output = filter(input, (n) => n > 1)
      expect(output).toEqual([2, 3])
      expect(output).not.toBe(input)
      expect(input).toEqual([1, 2, 3])
    })
  })
})
