function assertPositiveNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} deve ser um número finito maior que zero.`)
  }
}

export function convertWithDirectRate(amount, rate) {
  assertPositiveNumber(amount, 'O valor')
  assertPositiveNumber(rate, 'A taxa')

  return amount * rate
}

export function convertWithDemoRates(amount, sourceCode, targetCode, demoRates) {
  assertPositiveNumber(amount, 'O valor')

  if (!demoRates || typeof demoRates !== 'object') {
    throw new TypeError('As taxas demonstrativas devem ser informadas.')
  }

  const sourceRate = demoRates[sourceCode]
  const targetRate = demoRates[targetCode]

  assertPositiveNumber(sourceRate, `A taxa demonstrativa de ${sourceCode}`)
  assertPositiveNumber(targetRate, `A taxa demonstrativa de ${targetCode}`)

  return amount * (sourceRate / targetRate)
}
