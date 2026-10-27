import { lazy, Suspense, useState } from 'react'
import { useHistoricalRates } from '../hooks/useHistoricalRates'
import styles from './HistorySection.module.css'

const HistoryChart = lazy(() => import('./HistoryChart'))

const periods = [
  { value: '7d', label: '7 dias' },
  { value: '15d', label: '15 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1y', label: '1 ano' },
  { value: '5y', label: '5 anos' },
  { value: '10y', label: '10 anos' },
]

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day))
}

function formatRate(value) {
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

function HistorySection({ sourceCode, targetCode, pairRevision, enabled }) {
  const [period, setPeriod] = useState('30d')
  const { data, status, error, interval, retry } = useHistoricalRates({
    sourceCode,
    targetCode,
    pairRevision,
    period,
    enabled,
  })

  return (
    <section className={styles.historySection} id="historico" aria-labelledby="history-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Dados históricos</p>
          <h2 id="history-title">Histórico de {sourceCode} para {targetCode}</h2>
          <p>Período inclusivo de {formatDate(interval.from)} a {formatDate(interval.to)}.</p>
        </div>

        <label className={styles.periodField}>
          Período
          <select value={period} onChange={(event) => setPeriod(event.target.value)} disabled={!enabled}>
            {periods.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.periodButtons} aria-label="Períodos históricos">
        {periods.map((option) => (
          <button
            className={period === option.value ? styles.activePeriod : ''}
            type="button"
            key={option.value}
            onClick={() => setPeriod(option.value)}
            disabled={!enabled}
            aria-pressed={period === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className={styles.chartCard} aria-live="polite">
        {status === 'idle' && <p className={styles.statusMessage}>Aguardando o catálogo de moedas…</p>}
        {status === 'loading' && <p className={styles.statusMessage}>Carregando histórico…</p>}
        {status === 'identity' && (
          <p className={styles.statusMessage}>Selecione moedas diferentes para consultar o histórico.</p>
        )}
        {status === 'empty' && (
          <div className={styles.statePanel}>
            <p>Nenhum dado publicado para este par e período.</p>
            <button type="button" onClick={retry}>Consultar novamente</button>
          </div>
        )}
        {status === 'error' && (
          <div className={`${styles.statePanel} ${styles.errorPanel}`} role="alert">
            <p>{error}</p>
            <button type="button" onClick={retry}>Tentar novamente</button>
          </div>
        )}
        {status === 'success' && (
          <>
            <p className={styles.chartSummary}>{data.length} cotações publicadas no período.</p>
            <Suspense fallback={<p className={styles.statusMessage}>Preparando gráfico…</p>}>
              <HistoryChart
                data={data}
                sourceCode={sourceCode}
                targetCode={targetCode}
                formatDate={formatDate}
                formatRate={formatRate}
              />
            </Suspense>
          </>
        )}
      </div>
    </section>
  )
}

export default HistorySection
