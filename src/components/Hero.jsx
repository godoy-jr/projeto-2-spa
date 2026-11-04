import styles from './Hero.module.css'

function Hero({ title, description }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div>
        <p className={styles.eyebrow}>Câmbio Fácil</p>
        <h1 id="hero-title">{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  )
}

export default Hero
