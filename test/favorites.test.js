import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { FAVORITES_STORAGE_KEY, readFavorites } from '../src/hooks/useFavorites.js'
import { useFavorites } from '../src/hooks/useFavorites.js'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Node = dom.window.Node
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })

const { act, renderHook, waitFor } = await import('@testing-library/react')

function storageWith(value) {
  return { getItem: (key) => key === FAVORITES_STORAGE_KEY ? value : null }
}

test('readFavorites preserves direction and removes exact duplicates', () => {
  const favorites = readFavorites(storageWith(JSON.stringify([
    { source: 'EUR', target: 'BRL' },
    { source: 'BRL', target: 'EUR' },
    { source: 'EUR', target: 'BRL' },
  ])))
  assert.deepEqual(favorites, [
    { source: 'EUR', target: 'BRL' },
    { source: 'BRL', target: 'EUR' },
  ])
})

test('readFavorites safely ignores malformed storage', () => {
  assert.deepEqual(readFavorites(storageWith('{invalid')), [])
  assert.deepEqual(readFavorites(storageWith(JSON.stringify([{ source: 'EU', target: 'BRL' }]))), [])
})

test('favorite is saved, reopened and removed from browser storage', async () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  const first = renderHook(() => useFavorites(storage))
  act(() => first.result.current.toggleFavorite('EUR', 'BRL'))
  await waitFor(() => assert.equal(JSON.parse(values.get(FAVORITES_STORAGE_KEY)).length, 1))
  first.unmount()

  const reopened = renderHook(() => useFavorites(storage))
  assert.deepEqual(reopened.result.current.favorites, [{ source: 'EUR', target: 'BRL' }])
  act(() => reopened.result.current.toggleFavorite('EUR', 'BRL'))
  await waitFor(() => assert.deepEqual(JSON.parse(values.get(FAVORITES_STORAGE_KEY)), []))
  reopened.unmount()
})
