import styles from './Header.module.css'

function Header({ brandName, navigationItems }) {
  return (
    <header className={styles.siteHeader}>
      <a className={styles.brand} href="#inicio" aria-label={`${brandName} — início`}>
        <span className={styles.brandMark} aria-hidden="true">$</span>
        <span>{brandName}</span>
      </a>

      <nav className={styles.navigation} aria-label="Navegação principal">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
    </header>
  )
}

export default Header
