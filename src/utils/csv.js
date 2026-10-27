const CSV_HEADERS = ['Data', 'Origem', 'Destino', 'Cotação']

function escapeCsvField(value) {
  const text = String(value)
  return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function createHistoryCsv(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new RangeError('Não há registros para exportar.')
  }

  const lines = records.map((record) => [
    record.date,
    record.base,
    record.quote,
    record.rate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 6 }),
  ].map(escapeCsvField).join(';'))

  return `\uFEFF${[CSV_HEADERS.join(';'), ...lines].join('\r\n')}`
}

export function createHistoryCsvFilename(sourceCode, targetCode, from, to) {
  return `cambio-facil_${sourceCode}-${targetCode}_${from}_${to}.csv`
}

export function downloadHistoryCsv(records, filename, {
  documentImpl = globalThis.document,
  urlImpl = globalThis.URL,
  BlobImpl = globalThis.Blob,
} = {}) {
  const content = createHistoryCsv(records)
  const blob = new BlobImpl([content], { type: 'text/csv;charset=utf-8' })
  const url = urlImpl.createObjectURL(blob)
  const link = documentImpl.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  urlImpl.revokeObjectURL(url)
}
