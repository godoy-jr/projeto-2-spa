import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCurrencies, getLatestRate, getHistoricalRates } from '../src/services/frankfurter.js'

const rate = { date: '2024-05-03', base: 'EUR', quote: 'USD', rate: 1.07 }
const ok = data => async () => ({ ok: true, json: async () => data })
const errorCode = code => error => error.code === code
const history = options => getHistoricalRates('EUR', 'USD', '2024-05-01', '2024-05-31', options)

test('catálogo valida campos usados e preserva metadados adicionais', async () => {
  const currencies = [{ iso_code: 'EUR', name: 'Euro', symbol: '€' }]
  const result = await getCurrencies({ fetchImpl: async url => {
    assert.equal(url, 'https://api.frankfurter.dev/v2/currencies')
    return { ok: true, json: async () => currencies }
  } })
  assert.deepEqual(result, currencies)
})

test('taxa normaliza os códigos, preserva data e encaminha signal', async () => {
  const signal = new AbortController().signal
  const result = await getLatestRate('eur', 'usd', { signal, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.frankfurter.dev/v2/rate/EUR/USD')
    assert.equal(options.signal, signal)
    return { ok: true, json: async () => rate }
  } })
  assert.deepEqual(result, rate)
})

test('histórico envia os parâmetros v2 e preserva os registros', async () => {
  const result = await history({ fetchImpl: async url => {
    const parsed = new URL(url)
    assert.equal(parsed.pathname, '/v2/rates')
    assert.deepEqual(Object.fromEntries(parsed.searchParams), {
      base: 'EUR', quotes: 'USD', from: '2024-05-01', to: '2024-05-31',
    })
    return { ok: true, json: async () => [rate] }
  } })
  assert.deepEqual(result, [rate])
})

test('histórico vazio é ausência de dados, não erro nem série fabricada', async () => {
  assert.deepEqual(await history({ fetchImpl: ok([]) }), [])
})

test('status HTTP é preservado inclusive sem corpo JSON', async () => {
  for (const status of [404, 422, 500]) {
    await assert.rejects(getLatestRate('EUR', 'USD', {
      fetchImpl: async () => ({ ok: false, status }),
    }), error => error.code === 'HTTP' && error.status === status)
  }
})

test('falha de rede mantém causa e classificação', async () => {
  const cause = new TypeError('Failed to fetch')
  await assert.rejects(getCurrencies({ fetchImpl: async () => { throw cause } }),
    error => error.code === 'NETWORK' && error.cause === cause)
})

test('JSON inválido é rejeitado', async () => {
  await assert.rejects(getCurrencies({ fetchImpl: async () => ({ ok: true,
    json: async () => { throw new SyntaxError('invalid JSON') },
  }) }), errorCode('INVALID_RESPONSE'))
})

test('catálogo rejeita formato e campos inválidos', async () => {
  for (const data of [null, {}, [], [null], [{ iso_code: 'EUR' }], [{ iso_code: 'E', name: 'Euro' }]]) {
    await assert.rejects(getCurrencies({ fetchImpl: ok(data) }), errorCode('INVALID_RESPONSE'))
  }
})

test('taxa rejeita datas impossíveis, pares errados e números inválidos', async () => {
  for (const data of [null, [], { ...rate, date: '2024-02-30' }, { ...rate, base: 'BRL' },
    { ...rate, quote: 'BRL' }, { ...rate, rate: 0 }, { ...rate, rate: -1 },
    { ...rate, rate: Infinity }, { ...rate, rate: '1.07' }]) {
    await assert.rejects(getLatestRate('EUR', 'USD', { fetchImpl: ok(data) }), errorCode('INVALID_RESPONSE'))
  }
})

test('histórico rejeita formato, par e registros fora do intervalo', async () => {
  for (const data of [{}, [null], [{ ...rate, date: '2024-04-30' }], [{ ...rate, quote: 'BRL' }]]) {
    await assert.rejects(history({ fetchImpl: ok(data) }), errorCode('INVALID_RESPONSE'))
  }
})

test('entradas inválidas falham antes de chamar fetch', async () => {
  const options = { fetchImpl: () => assert.fail('Não deve consultar a rede') }
  await assert.rejects(getLatestRate('../EUR', 'USD', options), errorCode('INVALID_INPUT'))
  await assert.rejects(getHistoricalRates('EUR', 'USD', '2024-02-30', '2024-05-31', options), errorCode('INVALID_INPUT'))
  await assert.rejects(getHistoricalRates('EUR', 'USD', '2024-05-31', '2024-05-01', options), errorCode('INVALID_INPUT'))
})

test('moedas iguais não fabricam cotação ou data e não consultam a rede', async () => {
  const options = { fetchImpl: () => assert.fail('Não deve consultar a rede') }
  assert.equal(await getLatestRate('EUR', 'eur', options), null)
  await assert.rejects(getHistoricalRates('EUR', 'EUR', '2024-05-01', '2024-05-31', options), errorCode('INVALID_INPUT'))
})

test('signal já cancelado não inicia a consulta', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(getCurrencies({ signal: controller.signal,
    fetchImpl: () => assert.fail('Não deve consultar a rede'),
  }), error => error.name === 'AbortError')
})

test('cancelamento durante fetch não é convertido em erro de rede', async () => {
  const controller = new AbortController()
  const fetchImpl = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
  })
  const pending = getLatestRate('EUR', 'USD', { signal: controller.signal, fetchImpl })
  controller.abort()
  await assert.rejects(pending, error => error.name === 'AbortError')
})

test('cancelamento durante leitura do corpo é preservado', async () => {
  const controller = new AbortController()
  await assert.rejects(history({ signal: controller.signal, fetchImpl: async () => ({ ok: true,
    json: async () => { controller.abort(); throw controller.signal.reason },
  }) }), error => error.name === 'AbortError')
})

test('interrupção de conexão durante leitura do corpo é erro de rede', async () => {
  await assert.rejects(history({ fetchImpl: async () => ({ ok: true,
    json: async () => { throw new TypeError('connection reset') },
  }) }), errorCode('NETWORK'))
})
