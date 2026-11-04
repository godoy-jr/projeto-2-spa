import assert from 'node:assert/strict'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { readTheme, resolveTheme, THEME_STORAGE_KEY, useTheme } from '../src/hooks/useTheme.js'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Node = dom.window.Node
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
const { act, renderHook, waitFor } = await import('@testing-library/react')

function storageWith(value) {
  return { getItem: (key) => key === THEME_STORAGE_KEY ? value : null }
}

test('readTheme restaura tema válido e usa sistema na primeira visita', () => {
  assert.equal(readTheme(storageWith('dark')), 'dark')
  assert.equal(readTheme(storageWith('light')), 'light')
  assert.equal(readTheme(storageWith('invalid')), 'system')
  assert.equal(readTheme(storageWith(null)), 'system')
})

test('resolveTheme acompanha a preferência do sistema', () => {
  assert.equal(resolveTheme('light'), 'light')
  assert.equal(resolveTheme('dark'), 'dark')
  assert.equal(resolveTheme('system', () => ({ matches: true })), 'dark')
  assert.equal(resolveTheme('system', () => ({ matches: false })), 'light')
})

test('useTheme salva e restaura a escolha após remontar', async () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  const matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
  const first = renderHook(() => useTheme(storage, matchMedia))
  act(() => first.result.current.setTheme('dark'))
  await waitFor(() => assert.equal(values.get(THEME_STORAGE_KEY), 'dark'))
  assert.equal(document.documentElement.dataset.theme, 'dark')
  first.unmount()

  const reopened = renderHook(() => useTheme(storage, matchMedia))
  assert.equal(reopened.result.current.theme, 'dark')
  reopened.unmount()
})
