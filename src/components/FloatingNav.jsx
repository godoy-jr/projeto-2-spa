import { Icon } from './Icons'
import styles from './FloatingNav.module.css'

const items = [
  { id: 'conversor', label: 'Conversor', icon: 'converter' },
  { id: 'historico', label: 'Histórico', icon: 'history' },
  { id: 'favoritos', label: 'Favoritos', icon: 'star' },
  { id: 'noticias', label: 'Notícias', icon: 'news', panel: 'news' },
  { id: 'conta', label: 'Conta', icon: 'account', panel: 'account' },
]

function FloatingNav({ active, onNavigate }) {
  return (
    <nav className={styles.nav} aria-label="Atalhos principais">
      {items.map((item) => (
        <button key={item.id} type="button" className={active === item.id ? styles.active : ''} onClick={() => onNavigate(item)} aria-label={item.label} aria-current={active === item.id ? 'page' : undefined}>
          <Icon name={item.icon} filled={item.id === 'favoritos' && active === item.id} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default FloatingNav
