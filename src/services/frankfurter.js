const API_URL = 'https://api.frankfurter.dev'

export class FrankfurterError extends Error {
  constructor(message, code, { status, cause } = {}) {
    super(message, { cause })
    this.name = 'FrankfurterError'
    this.code = code
    if (status !== undefined) this.status = status
  }
}

function invalidResponse() {
  return new FrankfurterError('A API devolveu dados em formato inesperado.', 'INVALID_RESPONSE')
}

function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function currencyCode(value) {
  if (typeof value !== 'string' || !/^[a-z]{3}$/i.test(value)) {
    throw new FrankfurterError('Informe um código de moeda com três letras.', 'INVALID_INPUT')
  }
  return value.toUpperCase()
}

function isRate(row, base, quote) {
  return row !== null && typeof row === 'object' && isDate(row.date)
    && row.base === base && row.quote === quote
    && typeof row.rate === 'number' && Number.isFinite(row.rate) && row.rate > 0
}

async function request(path, params, { signal, fetchImpl = globalThis.fetch } = {}) {
  signal?.throwIfAborted()
  const url = new URL(path, API_URL)
  url.search = new URLSearchParams(params).toString()
  let response
  try {
    response = await fetchImpl(url.toString(), { signal })
  } catch (cause) {
    if (signal?.aborted || cause?.name === 'AbortError') throw cause
    throw new FrankfurterError('Não foi possível conectar à Frankfurter.', 'NETWORK', { cause })
  }

  // O status HTTP tem prioridade, mesmo quando o servidor devolve HTML em vez de JSON.
  if (!response.ok) {
    throw new FrankfurterError(`A consulta falhou (HTTP ${response.status}).`, 'HTTP', { status: response.status })
  }
  try {
    const data = await response.json()
    signal?.throwIfAborted()
    return data
  } catch (cause) {
    if (signal?.aborted || cause?.name === 'AbortError') throw cause
    if (cause instanceof SyntaxError) {
      throw new FrankfurterError('A API devolveu um JSON inválido.', 'INVALID_RESPONSE', { cause })
    }
    throw new FrankfurterError('A conexão foi interrompida ao ler a resposta.', 'NETWORK', { cause })
  }
}

export async function getCurrencies(options = {}) {
  const data = await request('/v2/currencies', {}, options)
  if (!Array.isArray(data) || data.length === 0 || !data.every(item => (
    item !== null && typeof item === 'object'
    && typeof item.iso_code === 'string' && /^[A-Z]{3}$/.test(item.iso_code)
    && typeof item.name === 'string' && item.name.trim().length > 0
  ))) throw invalidResponse()
  return data
}

export async function getLatestRate(baseCode, quoteCode, options = {}) {
  options.signal?.throwIfAborted()
  const base = currencyCode(baseCode)
  const quote = currencyCode(quoteCode)
  // Identidade matemática não é uma cotação publicada: não há data a inventar.
  if (base === quote) return null
  const data = await request(`/v2/rate/${base}/${quote}`, {}, options)
  if (!isRate(data, base, quote)) throw invalidResponse()
  return data
}

export async function getHistoricalRates(baseCode, quoteCode, from, to, options = {}) {
  const base = currencyCode(baseCode)
  const quote = currencyCode(quoteCode)
  if (!isDate(from) || !isDate(to) || from > to) {
    throw new FrankfurterError('Informe um intervalo de datas válido.', 'INVALID_INPUT')
  }
  if (base === quote) {
    throw new FrankfurterError('Selecione moedas diferentes para consultar o histórico.', 'INVALID_INPUT')
  }
  const data = await request('/v2/rates', { base, quotes: quote, from, to }, options)
  if (!Array.isArray(data) || !data.every(row => (
    isRate(row, base, quote) && row.date >= from && row.date <= to
  ))) throw invalidResponse()
  return data
}
