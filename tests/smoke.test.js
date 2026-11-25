/**
 * Env smoke test — confirms Jest + ESM imports work.
 * Real Top-10 suites live beside this file (see Test Plan §4.4 / §9).
 */
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

describe('unit-test environment', () => {
  test('Jest runs under ESM (type: module)', () => {
    expect(typeof import.meta.url).toBe('string')
    expect(typeof pathToFileURL).toBe('function')
  })

  test('can import a public src module', async () => {
    const { default: toNumber } = await import('../src/toNumber.js')
    expect(typeof toNumber).toBe('function')
    expect(toNumber('3.2')).toBe(3.2)
  })

  test('Jest is installed as a local dependency', () => {
    expect(() => require.resolve('jest')).not.toThrow()
  })
})
