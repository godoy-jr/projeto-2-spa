import { useState } from 'react'
import { Icon } from './Icons'
import styles from './FloatingNav.module.css'

const items = [
  { id: 'conversor', label: 'Conversor', icon: 'converter' },
  { id: 'historico', label: 'Histórico', icon: 'history' },
  { id: 'favoritos', label: 'Favoritos', icon: 'star' },
  { id: 'noticias', label: 'Notícias', icon: 'news', panel: 'news' },
  { id: 'conta', label: 'Conta', icon: 'account', panel: 'account' },
]

const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
]

function FloatingNav({ active, onNavigate, theme, resolvedTheme, onThemeChange }) {
  const [themeOpen, setThemeOpen] = useState(false)
  return (
    <div className={styles.wrapper}>
      {themeOpen && (
        <div className={styles.themeMenu} role="radiogroup" aria-label="Escolher tema">
          {themeOptions.map((option) => (
            <button key={option.value} type="button" role="radio" aria-checked={theme === option.value} className={theme === option.value ? styles.selectedTheme : ''} onClick={() => { onThemeChange(option.value); setThemeOpen(false) }}>
              {option.label}{option.value === 'system' && <small> ({resolvedTheme === 'dark' ? 'escuro' : 'claro'})</small>}
            </button>
          ))}
        </div>
      )}
      <nav className={styles.nav} aria-label="Atalhos principais">
        {items.map((item) => (
          <button key={item.id} type="button" className={active === item.id ? styles.active : ''} onClick={() => onNavigate(item)} aria-label={item.label} aria-current={active === item.id ? 'page' : undefined}>
            <Icon name={item.icon} filled={item.id === 'favoritos' && active === item.id} />
            <span>{item.label}</span>
          </button>
        ))}
        <button type="button" className={themeOpen ? styles.themeActive : ''} onClick={() => setThemeOpen((current) => !current)} aria-label={`Tema: ${themeOptions.find((option) => option.value === theme)?.label}`} aria-expanded={themeOpen}>
          <Icon name="theme" />
          <span>Tema</span>
        </button>
      </nav>
    </div>
  )
}

export default FloatingNav
