import styles from './HistorySection.module.css'

function HistorySection({ sourceCode, targetCode }) {
  return (
    <section className={styles.historySection} id="historico" aria-labelledby="history-title">
      <div>
        <p className={styles.eyebrow}>Próximas etapas</p>
        <h2 id="history-title">Histórico e análise</h2>
      </div>
      <p>Histórico de {sourceCode} para {targetCode} — em desenvolvimento.</p>
    </section>
  )
}

export default HistorySection
