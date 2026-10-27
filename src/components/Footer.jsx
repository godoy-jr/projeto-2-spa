import styles from './Footer.module.css'

function Footer({ dataSource }) {
  return (
    <footer className={styles.footer}>
      <p>Projeto acadêmico desenvolvido com React e Vite.</p>
      <p>As cotações reais serão fornecidas pela {dataSource}.</p>
    </footer>
  )
}

export default Footer
