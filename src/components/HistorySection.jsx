function HistorySection({ description }) {
  return (
    <section className="history-section" id="historico" aria-labelledby="history-title">
      <div>
        <p className="eyebrow">Próximas etapas</p>
        <h2 id="history-title">Histórico e análise</h2>
      </div>
      <p>{description}</p>
    </section>
  )
}

export default HistorySection
