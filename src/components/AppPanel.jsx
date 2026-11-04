import { useEffect, useRef } from 'react'
import { Icon } from './Icons'
import styles from './AppPanel.module.css'

function AppPanel({ type, sourceCode, targetCode, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    function closeOnEscape(event) { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const query = encodeURIComponent(`câmbio ${sourceCode} ${targetCode}`)
  const currencyQuery = encodeURIComponent(`${sourceCode} ${targetCode} moedas`)

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <button ref={closeRef} className={styles.close} type="button" onClick={onClose} aria-label="Fechar painel"><Icon name="close" /></button>
        {type === 'news' ? (
          <>
            <p className={styles.eyebrow}>Notícias</p>
            <h2 id="panel-title">Acompanhe {sourceCode}/{targetCode}</h2>
            <p>Abra uma busca contextual no Google Notícias. Os resultados e as fontes são exibidos pelo serviço externo.</p>
            <div className={styles.links}>
              <a href={`https://news.google.com/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`} target="_blank" rel="noreferrer">Notícias sobre o par {sourceCode}/{targetCode}<Icon name="external" /></a>
              <a href={`https://news.google.com/search?q=${currencyQuery}&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`} target="_blank" rel="noreferrer">Notícias sobre as moedas selecionadas<Icon name="external" /></a>
            </div>
            <small>Links externos · Google Notícias</small>
          </>
        ) : (
          <>
            <p className={styles.eyebrow}>Conta</p>
            <h2 id="panel-title">Entre no Câmbio Fácil</h2>
            <p>O conversor, o histórico e os favoritos locais continuam disponíveis sem login.</p>
            <div className={styles.accountState}>
              <Icon name="account" />
              <div><strong>Você está usando como visitante</strong><span>Seus favoritos estão salvos somente neste navegador.</span></div>
            </div>
            <button className={styles.disabledLogin} type="button" disabled>Entrar — disponível após configurar autenticação</button>
            <small>Nenhuma credencial ou dado de conta é enviado nesta versão.</small>
          </>
        )}
      </section>
    </div>
  )
}

export default AppPanel
