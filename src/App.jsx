import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Câmbio Fácil — início">
          <span className="brand-mark" aria-hidden="true">$</span>
          <span>Câmbio Fácil</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#conversor">Conversor</a>
          <a href="#historico">Histórico</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Conversão e análise de moedas</p>
            <h1 id="hero-title">Entenda o câmbio sem complicação.</h1>
            <p className="hero-description">
              Converta valores e acompanhe a variação das moedas em uma
              experiência simples e direta.
            </p>
            <a className="primary-link" href="#conversor">Começar conversão</a>
          </div>

          <aside className="preview-card" aria-label="Exemplo visual de cotação">
            <span className="demo-badge">Dados demonstrativos</span>
            <p className="preview-label">Exemplo de conversão</p>
            <strong>1 EUR = 6,20 BRL</strong>
            <p>Valor ilustrativo — ainda sem conexão com a API.</p>
          </aside>
        </section>

        <section className="converter-section" id="conversor" aria-labelledby="converter-title">
          <div className="section-heading">
            <p className="eyebrow">Conversor</p>
            <h2 id="converter-title">Simule uma conversão</h2>
            <p>A funcionalidade será ativada em uma próxima etapa.</p>
          </div>

          <form className="converter-card">
            <div className="field amount-field">
              <label htmlFor="amount">Valor</label>
              <input id="amount" name="amount" type="number" placeholder="100,00" disabled />
            </div>
            <div className="field">
              <label htmlFor="from-currency">Moeda de origem</label>
              <select id="from-currency" name="from-currency" disabled defaultValue="EUR">
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
            <span className="exchange-icon" aria-hidden="true">→</span>
            <div className="field">
              <label htmlFor="to-currency">Moeda de destino</label>
              <select id="to-currency" name="to-currency" disabled defaultValue="BRL">
                <option value="BRL">BRL — Real brasileiro</option>
              </select>
            </div>
            <button type="button" disabled>Converter</button>
            <p className="form-note">Interface estática: os campos serão habilitados quando adicionarmos estado e eventos.</p>
          </form>
        </section>

        <section className="history-section" id="historico" aria-labelledby="history-title">
          <div>
            <p className="eyebrow">Próximas etapas</p>
            <h2 id="history-title">Histórico e análise</h2>
          </div>
          <p>
            O gráfico, os filtros, a ordenação e a exportação CSV serão
            construídos progressivamente e testados em etapas próprias.
          </p>
        </section>
      </main>

      <footer>
        <p>Projeto acadêmico desenvolvido com React e Vite.</p>
        <p>As cotações reais serão fornecidas pela API Frankfurter.</p>
      </footer>
    </div>
  )
}

export default App
