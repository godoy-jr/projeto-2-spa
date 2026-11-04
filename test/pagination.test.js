import assert from 'node:assert/strict'
import test from 'node:test'
import { paginate } from '../src/utils/pagination.js'

const records = Array.from({ length: 25 }, (_, index) => index + 1)

test('paginate divide registros em várias páginas', () => {
  assert.deepEqual(paginate(records, 1, 10), {
    rows: records.slice(0, 10), currentPage: 1, totalPages: 3, from: 1, to: 10,
  })
  assert.deepEqual(paginate(records, 3, 10), {
    rows: records.slice(20), currentPage: 3, totalPages: 3, from: 21, to: 25,
  })
})

test('paginate limita páginas além do total e trata lista vazia', () => {
  assert.equal(paginate(records, 10, 20).currentPage, 2)
  assert.deepEqual(paginate([], 1, 10), {
    rows: [], currentPage: 1, totalPages: 1, from: 0, to: 0,
  })
})

test('paginate rejeita parâmetros inválidos', () => {
  assert.throws(() => paginate({}, 1, 10), TypeError)
  assert.throws(() => paginate(records, 0, 10), RangeError)
  assert.throws(() => paginate(records, 1, 0), RangeError)
})
