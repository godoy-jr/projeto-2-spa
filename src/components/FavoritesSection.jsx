import { Icon } from './Icons'
import styles from './FavoritesSection.module.css'

function FavoritesSection({ favorites, onSelect, onRemove }) {
  return (
    <section className={styles.section} id="favoritos" aria-labelledby="favorites-title">
      <div className={styles.heading}>
        <p>Lista pessoal</p>
        <h2 id="favorites-title">Meus favoritos</h2>
        <span>Acompanhe os pares que você consulta com frequência.</span>
      </div>
      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <Icon name="star" />
          <strong>Nenhum par salvo</strong>
          <span>Use a estrela ao lado do par no conversor para salvar o primeiro.</span>
        </div>
      ) : (
        <ul className={styles.list}>
          {favorites.map(({ source, target }) => (
            <li key={`${source}/${target}`}>
              <button className={styles.pair} type="button" onClick={() => onSelect(source, target)}>
                <span>{source}</span><span aria-hidden="true">→</span><span>{target}</span>
                <small>Selecionar no conversor</small>
              </button>
              <button className={styles.remove} type="button" onClick={() => onRemove(source, target)} aria-label={`Remover ${source} para ${target} dos favoritos`}>
                <Icon name="star" filled />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoritesSection
