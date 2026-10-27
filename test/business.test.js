import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { convertWithDemoRates, convertWithDirectRate } from '../src/utils/conversion.js'
import { filterHistory, sortHistory } from '../src/utils/history.js'
import { calculateHistoricalInterval, HISTORICAL_PERIODS } from '../src/utils/periods.js'

const demoRates = { BRL: 1, EUR: 6.2, USD: 5.7 }

const history = [
  { date: '2024-05-03', base: 'EUR', quote: 'USD', rate: 1.08 },
  { date: '2024-05-01', base: 'EUR', quote: 'USD', rate: 1.06 },
  { date: '2024-05-04', base: 'EUR', quote: 'USD', rate: 1.07 },
  { date: '2024-05-02', base: 'EUR', quote: 'USD', rate: 1.09 },
]

function countInclusiveCalendarDates(from, to) {
  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number)
  const [toYear, toMonth, toDay] = to.split('-').map(Number)
  const start = new Date(fromYear, fromMonth - 1, fromDay)
  const end = new Date(toYear, toMonth - 1, toDay)
  let count = 0

  while (start <= end) {
    count += 1
    start.setDate(start.getDate() + 1)
  }

  return count
}

describe('conversões', () => {
  test('aplica uma taxa direta sem usar a base demonstrativa', () => {
    assert.equal(convertWithDirectRate(100, 1.25), 125)
  })

  test('preserva o valor de moedas iguais com taxa direta unitária', () => {
    assert.equal(convertWithDirectRate(100, 1), 100)
  })

  test('preserva a fórmula e as taxas demonstrativas existentes', () => {
    assert.equal(convertWithDemoRates(100, 'EUR', 'BRL', demoRates), 620)
    assert.ok(Math.abs(convertWithDemoRates(100, 'BRL', 'EUR', demoRates) - 16.129032258064516) < Number.EPSILON)
  })

  test('preserva o valor quando as moedas demonstrativas são iguais', () => {
    assert.equal(convertWithDemoRates(100, 'USD', 'USD', demoRates), 100)
  })

  test('rejeita valores e taxas diretas inválidos', () => {
    for (const invalidValue of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, '100']) {
      assert.throws(() => convertWithDirectRate(invalidValue, 1.2), RangeError)
    }
    for (const invalidRate of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, '1.2']) {
      assert.throws(() => convertWithDirectRate(100, invalidRate), RangeError)
    }
  })

  test('rejeita taxas demonstrativas ausentes ou inválidas', () => {
    assert.throws(() => convertWithDemoRates(100, 'GBP', 'BRL', demoRates), RangeError)
    assert.throws(() => convertWithDemoRates(100, 'EUR', 'BRL'), TypeError)
    assert.throws(() => convertWithDemoRates(0, 'EUR', 'BRL', demoRates), RangeError)
  })
})

describe('intervalos históricos', () => {
  test('mantém exatamente os oito períodos previstos', () => {
    assert.deepEqual(Object.keys(HISTORICAL_PERIODS), ['7d', '15d', '30d', '3m', '6m', '1y', '5y', '10y'])
  })

  test('calcula dias e atravessa limites de mês', () => {
    assert.deepEqual(calculateHistoricalInterval('7d', '2024-05-31'), { from: '2024-05-25', to: '2024-05-31' })
    assert.deepEqual(calculateHistoricalInterval('15d', '2024-05-31'), { from: '2024-05-17', to: '2024-05-31' })
    assert.deepEqual(calculateHistoricalInterval('30d', '2024-05-31'), { from: '2024-05-02', to: '2024-05-31' })
  })

  test('inclui exatamente a quantidade de datas indicada nos períodos em dias', () => {
    for (const [period, expectedCount] of [['7d', 7], ['15d', 15], ['30d', 30]]) {
      const interval = calculateHistoricalInterval(period, '2024-05-31')
      assert.equal(countInclusiveCalendarDates(interval.from, interval.to), expectedCount)
    }
  })

  test('calcula meses de calendário e ajusta o último dia válido', () => {
    assert.deepEqual(calculateHistoricalInterval('3m', '2024-05-31'), { from: '2024-02-29', to: '2024-05-31' })
    assert.deepEqual(calculateHistoricalInterval('6m', '2024-05-31'), { from: '2023-11-30', to: '2024-05-31' })
  })

  test('calcula anos de calendário incluindo ano bissexto', () => {
    assert.deepEqual(calculateHistoricalInterval('1y', '2024-02-29'), { from: '2023-02-28', to: '2024-02-29' })
    assert.deepEqual(calculateHistoricalInterval('5y', '2024-05-31'), { from: '2019-05-31', to: '2024-05-31' })
    assert.deepEqual(calculateHistoricalInterval('10y', '2024-05-31'), { from: '2014-05-31', to: '2024-05-31' })
  })

  test('usa os campos locais de Date sem converter o dia por UTC', () => {
    const localReference = new Date(2024, 0, 1, 0, 30)
    assert.deepEqual(calculateHistoricalInterval('7d', localReference), { from: '2023-12-26', to: '2024-01-01' })
  })

  test('rejeita período e data inválidos', () => {
    assert.throws(() => calculateHistoricalInterval('2m', '2024-05-31'), RangeError)
    assert.throws(() => calculateHistoricalInterval('7d', '2024-02-30'), RangeError)
  })
})

describe('filtros do histórico', () => {
  test('filtra cada limite de data de forma inclusiva', () => {
    assert.deepEqual(filterHistory(history, { from: '2024-05-03' }).map((row) => row.date), ['2024-05-03', '2024-05-04'])
    assert.deepEqual(filterHistory(history, { to: '2024-05-02' }).map((row) => row.date), ['2024-05-01', '2024-05-02'])
    assert.deepEqual(filterHistory(history, { from: '2024-05-02', to: '2024-05-03' }).map((row) => row.date), ['2024-05-03', '2024-05-02'])
  })

  test('filtra cotações mínima e máxima de forma inclusiva', () => {
    assert.deepEqual(filterHistory(history, { minRate: 1.08 }).map((row) => row.rate), [1.08, 1.09])
    assert.deepEqual(filterHistory(history, { maxRate: 1.07 }).map((row) => row.rate), [1.06, 1.07])
  })

  test('combina simultaneamente filtros de data e cotação', () => {
    assert.deepEqual(
      filterHistory(history, { from: '2024-05-02', to: '2024-05-04', minRate: 1.07, maxRate: 1.08 }),
      [history[0], history[2]],
    )
  })

  test('rejeita intervalos, datas e cotações inválidos', () => {
    assert.throws(() => filterHistory(history, { from: '2024-05-04', to: '2024-05-01' }), RangeError)
    assert.throws(() => filterHistory(history, { minRate: 2, maxRate: 1 }), RangeError)
    assert.throws(() => filterHistory(history, { from: '2024-02-30' }), RangeError)
    assert.throws(() => filterHistory(history, { minRate: -1 }), RangeError)
  })
})

describe('ordenação do histórico', () => {
  test('ordena cronologicamente nos dois sentidos', () => {
    assert.deepEqual(sortHistory(history, 'date', 'asc').map((row) => row.date), ['2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04'])
    assert.deepEqual(sortHistory(history, 'date', 'desc').map((row) => row.date), ['2024-05-04', '2024-05-03', '2024-05-02', '2024-05-01'])
  })

  test('ordena numericamente por cotação nos dois sentidos', () => {
    assert.deepEqual(sortHistory(history, 'rate', 'asc').map((row) => row.rate), [1.06, 1.07, 1.08, 1.09])
    assert.deepEqual(sortHistory(history, 'rate', 'desc').map((row) => row.rate), [1.09, 1.08, 1.07, 1.06])
  })

  test('não modifica o array original', () => {
    const snapshot = structuredClone(history)
    const sorted = sortHistory(history, 'date', 'asc')

    assert.deepEqual(history, snapshot)
    assert.notStrictEqual(sorted, history)
  })

  test('rejeita campo ou direção desconhecidos', () => {
    assert.throws(() => sortHistory(history, 'base'), RangeError)
    assert.throws(() => sortHistory(history, 'date', 'up'), RangeError)
  })
})
