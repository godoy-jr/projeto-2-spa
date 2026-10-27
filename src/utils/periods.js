export const HISTORICAL_PERIODS = Object.freeze({
  '7d': { unit: 'day', amount: 7 },
  '15d': { unit: 'day', amount: 15 },
  '30d': { unit: 'day', amount: 30 },
  '3m': { unit: 'month', amount: 3 },
  '6m': { unit: 'month', amount: 6 },
  '1y': { unit: 'year', amount: 1 },
  '5y': { unit: 'year', amount: 5 },
  '10y': { unit: 'year', amount: 10 },
})

function parseLocalDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError('A data de referência é inválida.')
    }

    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    throw new RangeError('A data de referência deve usar o formato YYYY-MM-DD.')
  }

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText) - 1
  const day = Number(dayText)
  const date = new Date(year, month, day)

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    throw new RangeError('A data de referência é inválida.')
  }

  return date
}

function formatLocalDate(date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function subtractCalendarMonths(date, amount) {
  const absoluteMonth = date.getFullYear() * 12 + date.getMonth() - amount
  const targetYear = Math.floor(absoluteMonth / 12)
  const targetMonth = ((absoluteMonth % 12) + 12) % 12
  const targetDay = Math.min(date.getDate(), daysInMonth(targetYear, targetMonth))

  return new Date(targetYear, targetMonth, targetDay)
}

function subtractCalendarYears(date, amount) {
  const targetYear = date.getFullYear() - amount
  const targetDay = Math.min(date.getDate(), daysInMonth(targetYear, date.getMonth()))

  return new Date(targetYear, date.getMonth(), targetDay)
}

export function calculateHistoricalInterval(period, referenceDate) {
  const definition = HISTORICAL_PERIODS[period]
  if (!definition) {
    throw new RangeError(`Período histórico não suportado: ${period}.`)
  }

  const endDate = parseLocalDate(referenceDate)
  let startDate

  if (definition.unit === 'day') {
    startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    startDate.setDate(startDate.getDate() - (definition.amount - 1))
  } else if (definition.unit === 'month') {
    startDate = subtractCalendarMonths(endDate, definition.amount)
  } else {
    startDate = subtractCalendarYears(endDate, definition.amount)
  }

  return {
    from: formatLocalDate(startDate),
    to: formatLocalDate(endDate),
  }
}
