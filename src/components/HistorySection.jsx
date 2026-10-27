import styles from './HistorySection.module.css'

function HistorySection({ description }) {
  return (
    <section className={styles.historySection} id="historico" aria-labelledby="history-title">
      <div>
        <p className={styles.eyebrow}>Próximas etapas</p>
        <h2 id="history-title">Histórico e análise</h2>
      </div>
      <p>{description}</p>
    </section>
  )
}

export default HistorySection
