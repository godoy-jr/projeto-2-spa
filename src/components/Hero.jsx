import styles from './Hero.module.css'

function Hero({ title, description, exampleRate }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div>
        <p className={styles.eyebrow}>Conversão e análise de moedas</p>
        <h1 id="hero-title">{title}</h1>
        <p className={styles.description}>{description}</p>
        <a className={styles.primaryLink} href="#conversor">Começar conversão</a>
      </div>

      <aside className={styles.previewCard} aria-label="Exemplo visual de cotação">
        <span className={styles.demoBadge}>Dados demonstrativos</span>
        <p className={styles.previewLabel}>Exemplo de conversão</p>
        <strong>{exampleRate}</strong>
        <p>Valor ilustrativo — ainda sem conexão com a API.</p>
      </aside>
    </section>
  )
}

export default Hero
