function Hero({ title, description, exampleRate }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Conversão e análise de moedas</p>
        <h1 id="hero-title">{title}</h1>
        <p className="hero-description">{description}</p>
        <a className="primary-link" href="#conversor">Começar conversão</a>
      </div>

      <aside className="preview-card" aria-label="Exemplo visual de cotação">
        <span className="demo-badge">Dados demonstrativos</span>
        <p className="preview-label">Exemplo de conversão</p>
        <strong>{exampleRate}</strong>
        <p>Valor ilustrativo — ainda sem conexão com a API.</p>
      </aside>
    </section>
  )
}

export default Hero
