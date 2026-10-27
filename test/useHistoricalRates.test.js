import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import { useHistoricalRates } from '../src/hooks/useHistoricalRates.js'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Node = dom.window.Node
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })

const { act, renderHook, waitFor } = await import('@testing-library/react')

function deferred() {
  let resolve
  const promise = new Promise((resolvePromise) => { resolve = resolvePromise })
  return { promise, resolve }
}

const row = (base, quote, date, rate) => ({ date, base, quote, rate })

function props(requestHistory, overrides = {}) {
  return {
    sourceCode: 'EUR',
    targetCode: 'BRL',
    pairRevision: 0,
    period: '7d',
    enabled: true,
    referenceDate: '2026-10-27',
    requestHistory,
    ...overrides,
  }
}

test('useHistoricalRates calcula o intervalo e expõe dados reais preservados', async () => {
  let received
  const data = [row('EUR', 'BRL', '2026-10-27', 5.9696)]
  const requestHistory = async (...args) => {
    received = args
    return data
  }
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory),
  })

  await waitFor(() => assert.equal(hook.result.current.status, 'success'))
  assert.deepEqual(received.slice(0, 4), ['EUR', 'BRL', '2026-10-21', '2026-10-27'])
  assert.deepEqual(hook.result.current.data, data)
  assert.deepEqual(hook.result.current.interval, { from: '2026-10-21', to: '2026-10-27' })
  hook.unmount()
})

test('useHistoricalRates diferencia ausência de dados', async () => {
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(async () => []),
  })
  await waitFor(() => assert.equal(hook.result.current.status, 'empty'))
  assert.deepEqual(hook.result.current.data, [])
  hook.unmount()
})

test('useHistoricalRates permite tentar novamente após erro', async () => {
  let calls = 0
  const requestHistory = async () => {
    calls += 1
    if (calls === 1) throw new Error('falha simulada')
    return [row('EUR', 'BRL', '2026-10-27', 5.9696)]
  }
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory),
  })
  await waitFor(() => assert.equal(hook.result.current.status, 'error'))

  await act(async () => hook.result.current.retry())
  await waitFor(() => assert.equal(hook.result.current.status, 'success'))
  assert.equal(calls, 2)
  hook.unmount()
})

test('useHistoricalRates cancela o período anterior e descarta sua resposta atrasada', async () => {
  const first = deferred()
  const second = deferred()
  const signals = []
  let calls = 0
  const requestHistory = (_base, _quote, _from, _to, { signal }) => {
    signals.push(signal)
    calls += 1
    return calls === 1 ? first.promise : second.promise
  }
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory),
  })

  hook.rerender(props(requestHistory, { period: '15d' }))
  assert.equal(signals[0].aborted, true)
  await act(async () => second.resolve([row('EUR', 'BRL', '2026-10-27', 6)]))
  assert.equal(hook.result.current.status, 'success')

  await act(async () => first.resolve([row('EUR', 'BRL', '2026-10-21', 5)]))
  assert.deepEqual(hook.result.current.data, [row('EUR', 'BRL', '2026-10-27', 6)])
  hook.unmount()
})

test('useHistoricalRates protege a sequência A → B → A', async () => {
  const firstA = deferred()
  const pendingB = deferred()
  const secondA = deferred()
  const pending = [firstA, pendingB, secondA]
  const requestHistory = () => pending.shift().promise
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory),
  })

  await act(async () => firstA.resolve([row('EUR', 'BRL', '2026-10-27', 5.9)]))
  hook.rerender(props(requestHistory, { targetCode: 'USD', pairRevision: 1 }))
  hook.rerender(props(requestHistory, { targetCode: 'BRL', pairRevision: 2 }))
  assert.equal(hook.result.current.status, 'loading')
  assert.deepEqual(hook.result.current.data, [])

  await act(async () => pendingB.resolve([row('EUR', 'USD', '2026-10-27', 1.1)]))
  assert.equal(hook.result.current.status, 'loading')

  await act(async () => secondA.resolve([row('EUR', 'BRL', '2026-10-27', 6)]))
  assert.deepEqual(hook.result.current.data, [row('EUR', 'BRL', '2026-10-27', 6)])
  hook.unmount()
})

test('useHistoricalRates não consulta nem fabrica dados para moedas iguais', () => {
  let calls = 0
  const requestHistory = () => { calls += 1; return Promise.resolve([]) }
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory, { targetCode: 'EUR' }),
  })
  assert.equal(calls, 0)
  assert.equal(hook.result.current.status, 'identity')
  assert.deepEqual(hook.result.current.data, [])
  hook.unmount()
})

test('useHistoricalRates cancela a consulta ao desmontar', () => {
  let signal
  const requestHistory = (_base, _quote, _from, _to, options) => {
    signal = options.signal
    return new Promise(() => {})
  }
  const hook = renderHook((hookProps) => useHistoricalRates(hookProps), {
    initialProps: props(requestHistory),
  })
  assert.equal(signal.aborted, false)
  hook.unmount()
  assert.equal(signal.aborted, true)
})
