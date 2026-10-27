import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHistoryCsv, createHistoryCsvFilename, downloadHistoryCsv } from '../src/utils/csv.js'

const records = [
  { date: '2026-10-27', base: 'EUR', quote: 'BRL', rate: 5.9427 },
  { date: '2026-10-26', base: 'EUR', quote: 'BRL', rate: 5.9 },
]

test('CSV contém cabeçalhos e preserva a ordem recebida', () => {
  const lines = createHistoryCsv(records).replace(/^\uFEFF/, '').split('\r\n')
  assert.deepEqual(lines, [
    'Data;Origem;Destino;Cotação',
    '2026-10-27;EUR;BRL;5,9427',
    '2026-10-26;EUR;BRL;5,9000',
  ])
})

test('CSV escapa separador, aspas e quebra de linha', () => {
  const content = createHistoryCsv([{ date: '2026-10-27', base: 'E;"UR', quote: 'B\nRL', rate: 1 }])
  assert.match(content, /"E;""UR"/)
  assert.match(content, /"B\nRL"/)
})

test('CSV usa BOM para preservar caracteres e rejeita exportação vazia', () => {
  assert.equal(createHistoryCsv(records).startsWith('\uFEFF'), true)
  assert.throws(() => createHistoryCsv([]), /Não há registros/)
})

test('nome do CSV identifica par e intervalo', () => {
  assert.equal(
    createHistoryCsvFilename('EUR', 'BRL', '2026-10-21', '2026-10-27'),
    'cambio-facil_EUR-BRL_2026-10-21_2026-10-27.csv',
  )
})

test('download cria o arquivo e revoga a URL temporária', () => {
  let clicked = false
  let revoked
  let receivedBlob
  const link = { href: '', download: '', click: () => { clicked = true } }
  class FakeBlob {
    constructor(parts, options) {
      this.parts = parts
      this.type = options.type
    }
  }
  const urlImpl = {
    createObjectURL(blob) { receivedBlob = blob; return 'blob:teste' },
    revokeObjectURL(url) { revoked = url },
  }
  const documentImpl = { createElement: (tag) => {
    assert.equal(tag, 'a')
    return link
  } }

  downloadHistoryCsv(records, 'historico.csv', { documentImpl, urlImpl, BlobImpl: FakeBlob })

  assert.equal(clicked, true)
  assert.equal(link.href, 'blob:teste')
  assert.equal(link.download, 'historico.csv')
  assert.equal(receivedBlob.type, 'text/csv;charset=utf-8')
  assert.equal(revoked, 'blob:teste')
})
