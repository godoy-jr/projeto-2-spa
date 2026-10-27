import { useMemo, useState } from 'react'
import { createHistoryCsvFilename, downloadHistoryCsv } from '../utils/csv'
import { filterHistory, sortHistory } from '../utils/history'
import styles from './HistorySection.module.css'

const initialFilters = { from: '', to: '', minRate: '', maxRate: '' }

function HistoryTable({ records, sourceCode, targetCode, interval }) {
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('date')
  const [direction, setDirection] = useState('asc')

  const processed = useMemo(() => {
    try {
      const filtered = filterHistory(records, {
        from: filters.from,
        to: filters.to,
        minRate: filters.minRate === '' ? undefined : Number(filters.minRate),
        maxRate: filters.maxRate === '' ? undefined : Number(filters.maxRate),
      })
      return { rows: sortHistory(filtered, sortBy, direction), error: '' }
    } catch (error) {
      return { rows: [], error: error.message }
    }
  }, [direction, filters, records, sortBy])

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function exportCsv() {
    const filename = createHistoryCsvFilename(sourceCode, targetCode, interval.from, interval.to)
    downloadHistoryCsv(processed.rows, filename)
  }

  return (
    <section className={styles.tableSection} aria-labelledby="history-table-title">
      <div className={styles.tableHeading}>
        <div>
          <h3 id="history-table-title">Tabela de cotações</h3>
          <p>{processed.rows.length} de {records.length} registros exibidos.</p>
        </div>
        <button type="button" className={styles.exportButton} onClick={exportCsv} disabled={processed.rows.length === 0 || Boolean(processed.error)}>
          Exportar CSV
        </button>
      </div>

      <div className={styles.filters}>
        <label>
          Data inicial
          <input type="date" value={filters.from} min={interval.from} max={interval.to} onChange={(event) => updateFilter('from', event.target.value)} />
        </label>
        <label>
          Data final
          <input type="date" value={filters.to} min={interval.from} max={interval.to} onChange={(event) => updateFilter('to', event.target.value)} />
        </label>
        <label>
          Cotação mínima
          <input type="number" min="0" step="any" value={filters.minRate} onChange={(event) => updateFilter('minRate', event.target.value)} />
        </label>
        <label>
          Cotação máxima
          <input type="number" min="0" step="any" value={filters.maxRate} onChange={(event) => updateFilter('maxRate', event.target.value)} />
        </label>
      </div>

      <div className={styles.tableActions}>
        <label>
          Ordenar por
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="date">Data</option>
            <option value="rate">Cotação</option>
          </select>
        </label>
        <label>
          Direção
          <select value={direction} onChange={(event) => setDirection(event.target.value)}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
        <button type="button" onClick={clearFilters}>Limpar filtros</button>
      </div>

      {processed.error && <p className={styles.filterError} role="alert">{processed.error}</p>}
      {!processed.error && processed.rows.length === 0 && (
        <p className={styles.noRows}>Nenhum registro corresponde aos filtros informados.</p>
      )}
      {!processed.error && processed.rows.length > 0 && (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Cotação</th>
              </tr>
            </thead>
            <tbody>
              {processed.rows.map((record) => (
                <tr key={`${record.date}-${record.base}-${record.quote}`}>
                  <td>{record.date}</td>
                  <td>{record.base}</td>
                  <td>{record.quote}</td>
                  <td>{record.rate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default HistoryTable
