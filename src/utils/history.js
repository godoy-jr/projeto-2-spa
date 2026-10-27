const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function isValidIsoDate(value) {
  const match = ISO_DATE_PATTERN.exec(value)
  if (!match) return false

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText) - 1
  const day = Number(dayText)
  const date = new Date(year, month, day)

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
}

function validateOptionalDate(value, label) {
  if (value !== undefined && value !== '' && !isValidIsoDate(value)) {
    throw new RangeError(`${label} deve ser uma data válida no formato YYYY-MM-DD.`)
  }
}

function validateOptionalRate(value, label) {
  if (value !== undefined && value !== '' && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    throw new RangeError(`${label} deve ser um número finito maior ou igual a zero.`)
  }
}

export function filterHistory(records, filters = {}) {
  if (!Array.isArray(records)) {
    throw new TypeError('O histórico deve ser um array.')
  }

  const { from, to, minRate, maxRate } = filters
  validateOptionalDate(from, 'A data inicial')
  validateOptionalDate(to, 'A data final')
  validateOptionalRate(minRate, 'A cotação mínima')
  validateOptionalRate(maxRate, 'A cotação máxima')

  if (from && to && from > to) {
    throw new RangeError('A data inicial não pode ser posterior à data final.')
  }
  if (minRate !== undefined && minRate !== '' && maxRate !== undefined && maxRate !== '' && minRate > maxRate) {
    throw new RangeError('A cotação mínima não pode ser maior que a máxima.')
  }

  return records.filter((record) => {
    if (from && record.date < from) return false
    if (to && record.date > to) return false
    if (minRate !== undefined && minRate !== '' && record.rate < minRate) return false
    if (maxRate !== undefined && maxRate !== '' && record.rate > maxRate) return false
    return true
  })
}

export function sortHistory(records, sortBy, direction = 'asc') {
  if (!Array.isArray(records)) {
    throw new TypeError('O histórico deve ser um array.')
  }
  if (!['date', 'rate'].includes(sortBy)) {
    throw new RangeError('A ordenação deve usar date ou rate.')
  }
  if (!['asc', 'desc'].includes(direction)) {
    throw new RangeError('A direção deve usar asc ou desc.')
  }

  const multiplier = direction === 'asc' ? 1 : -1

  return [...records].sort((left, right) => {
    const comparison = sortBy === 'rate'
      ? left.rate - right.rate
      : left.date.localeCompare(right.date)

    return comparison * multiplier
  })
}
