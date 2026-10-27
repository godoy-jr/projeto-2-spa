import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import { useExchangeRate } from '../src/hooks/useExchangeRate.js'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Node = dom.window.Node
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })

const { act, renderHook, waitFor } = await import('@testing-library/react')

const rate = (base, quote, value = 1.25) => ({
  date: '2026-10-27',
  base,
  quote,
  rate: value,
})

function deferred() {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

async function renderExchangeRate(initialProps) {
  const rendered = renderHook((hookProps) => useExchangeRate(hookProps), { initialProps })

  return {
    get current() {
      return rendered.result.current
    },
    async update(props) {
      await act(async () => {
        rendered.rerender(props)
      })
    },
    async unmount() {
      await act(async () => rendered.unmount())
    },
  }
}

function props(requestRate, overrides = {}) {
  return {
    sourceCode: 'EUR',
    targetCode: 'BRL',
    pairRevision: 0,
    enabled: true,
    requestRate,
    ...overrides,
  }
}

test('useExchangeRate expõe sucesso com a resposta simulada', async () => {
  const pending = deferred()
  const hook = await renderExchangeRate(props(() => pending.promise))
  assert.equal(hook.current.status, 'loading')

  await act(async () => pending.resolve(rate('EUR', 'BRL', 5.9696)))

  assert.equal(hook.current.status, 'success')
  assert.deepEqual(hook.current.quote, rate('EUR', 'BRL', 5.9696))
  assert.equal(hook.current.error, '')
  await hook.unmount()
})

test('useExchangeRate permite tentar novamente após erro', async () => {
  let calls = 0
  const requestRate = async () => {
    calls += 1
    if (calls === 1) throw new Error('falha simulada')
    return rate('EUR', 'BRL')
  }
  const hook = await renderExchangeRate(props(requestRate))
  await waitFor(() => assert.equal(hook.current.status, 'error'))
  assert.match(hook.current.error, /Não foi possível/)

  await act(async () => hook.current.retry())

  await waitFor(() => assert.equal(hook.current.status, 'success'))
  assert.equal(calls, 2)
  assert.deepEqual(hook.current.quote, rate('EUR', 'BRL'))
  await hook.unmount()
})

test('useExchangeRate cancela a consulta anterior ao trocar o par', async () => {
  const signals = []
  const requestRate = (_base, _quote, { signal }) => {
    signals.push(signal)
    return new Promise(() => {})
  }
  const hook = await renderExchangeRate(props(requestRate))

  await hook.update(props(requestRate, { targetCode: 'USD', pairRevision: 1 }))

  assert.equal(signals.length, 2)
  assert.equal(signals[0].aborted, true)
  assert.equal(signals[1].aborted, false)
  await hook.unmount()
})

test('useExchangeRate descarta resposta atrasada de outro par', async () => {
  const eurBrl = deferred()
  const eurUsd = deferred()
  const requestRate = (_base, quote) => quote === 'BRL' ? eurBrl.promise : eurUsd.promise
  const hook = await renderExchangeRate(props(requestRate))

  await hook.update(props(requestRate, { targetCode: 'USD', pairRevision: 1 }))
  await act(async () => eurUsd.resolve(rate('EUR', 'USD', 1.16)))
  assert.deepEqual(hook.current.quote, rate('EUR', 'USD', 1.16))

  await act(async () => eurBrl.resolve(rate('EUR', 'BRL', 5.9)))
  assert.equal(hook.current.status, 'success')
  assert.deepEqual(hook.current.quote, rate('EUR', 'USD', 1.16))
  await hook.unmount()
})

test('useExchangeRate mantém carregamento correto na sequência A → B → A', async () => {
  const firstA = deferred()
  const pendingB = deferred()
  const secondA = deferred()
  const requests = [firstA, pendingB, secondA]
  const requestRate = () => requests.shift().promise
  const hook = await renderExchangeRate(props(requestRate))

  await act(async () => firstA.resolve(rate('EUR', 'BRL', 5.9)))
  assert.equal(hook.current.status, 'success')

  await hook.update(props(requestRate, { targetCode: 'USD', pairRevision: 1 }))
  await hook.update(props(requestRate, { targetCode: 'BRL', pairRevision: 2 }))
  assert.equal(hook.current.status, 'loading')
  assert.equal(hook.current.quote, null)

  await act(async () => pendingB.resolve(rate('EUR', 'USD', 1.1)))
  assert.equal(hook.current.status, 'loading')
  assert.equal(hook.current.quote, null)

  await act(async () => secondA.resolve(rate('EUR', 'BRL', 6)))
  assert.equal(hook.current.status, 'success')
  assert.deepEqual(hook.current.quote, rate('EUR', 'BRL', 6))
  await hook.unmount()
})

test('useExchangeRate trata moedas iguais sem consultar o serviço', async () => {
  let calls = 0
  const requestRate = () => {
    calls += 1
    return Promise.resolve(null)
  }
  const hook = await renderExchangeRate(props(requestRate, { targetCode: 'EUR' }))

  assert.equal(calls, 0)
  assert.equal(hook.current.status, 'identity')
  assert.equal(hook.current.quote, null)
  await hook.unmount()
})

test('useExchangeRate cancela a consulta ao desmontar', async () => {
  let capturedSignal
  const requestRate = (_base, _quote, { signal }) => {
    capturedSignal = signal
    return new Promise(() => {})
  }
  const hook = await renderExchangeRate(props(requestRate))
  assert.equal(capturedSignal.aborted, false)

  await hook.unmount()

  assert.equal(capturedSignal.aborted, true)
})
