import styles from './Hero.module.css'

function Hero({ title, description }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div>
        <p className={styles.eyebrow}>Conversão e análise de moedas</p>
        <h1 id="hero-title">{title}</h1>
        <p className={styles.description}>{description}</p>
        <a className={styles.primaryLink} href="#conversor">Começar conversão</a>
      </div>

      <aside className={styles.previewCard} aria-label="Fonte das cotações">
        <span className={styles.dataBadge}>Dados de referência</span>
        <p className={styles.previewLabel}>Fonte das cotações</p>
        <strong>Frankfurter API</strong>
        <p>Taxas e datas efetivas carregadas diretamente do serviço.</p>
      </aside>
    </section>
  )
}

export default Hero
