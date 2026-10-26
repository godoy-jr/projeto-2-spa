function Header({ brandName, navigationItems }) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label={`${brandName} — início`}>
        <span className="brand-mark" aria-hidden="true">$</span>
        <span>{brandName}</span>
      </a>

      <nav aria-label="Navegação principal">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
    </header>
  )
}

export default Header
