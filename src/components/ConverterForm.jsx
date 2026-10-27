import { useState } from 'react'
import { useExchangeRate } from '../hooks/useExchangeRate'
import { convertWithDirectRate } from '../utils/conversion'
import styles from './ConverterForm.module.css'

function ConverterForm({
  currencies,
  currenciesStatus,
  currenciesError,
  onRetryCurrencies,
  sourceCode,
  targetCode,
  pairRevision,
  onSourceChange,
  onTargetChange,
  onInvertCurrencies,
}) {
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const {
    quote,
    status: quoteStatus,
    error: quoteError,
    retry: retryQuote,
  } = useExchangeRate({
    sourceCode,
    targetCode,
    pairRevision,
    enabled: currenciesStatus === 'success',
  })
  const formattedRate = quote?.rate.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })

  function resetFeedback() {
    setResult(null)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Informe um valor maior que zero.')
      setResult(null)
      return
    }

    if (sourceCode === targetCode) {
      setError('')
      setResult(numericAmount)
      return
    }

    if (quoteStatus !== 'success' || !quote) {
      setError('Aguarde uma cotação válida antes de converter.')
      setResult(null)
      return
    }

    const convertedAmount = convertWithDirectRate(numericAmount, quote.rate)

    setError('')
    setResult(convertedAmount)
  }

  function handleCurrencyChange(onChange, value) {
    onChange(value)
    resetFeedback()
  }

  function handleInvert() {
    onInvertCurrencies()
    resetFeedback()
  }

  const controlsDisabled = currenciesStatus !== 'success'
  const conversionDisabled = controlsDisabled || quoteStatus === 'loading'

  return (
    <section className={styles.converterSection} id="conversor" aria-labelledby="converter-title">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Conversor</p>
        <h2 id="converter-title">Converta com a cotação mais recente</h2>
        <p>Consulte taxas de referência e a data efetiva informada pela Frankfurter.</p>
      </div>

      <form className={styles.converterCard} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field} ${styles.amountField}`}>
          <label htmlFor="amount">Valor</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="100,00"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value)
              resetFeedback()
            }}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="from-currency">Moeda de origem</label>
          <select
            id="from-currency"
            name="from-currency"
            value={sourceCode}
            disabled={controlsDisabled}
            onChange={(event) => handleCurrencyChange(onSourceChange, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.invertButton} type="button" onClick={handleInvert} disabled={controlsDisabled}>
          <span aria-hidden="true">⇄</span>
          <span>Inverter moedas</span>
        </button>

        <div className={styles.field}>
          <label htmlFor="to-currency">Moeda de destino</label>
          <select
            id="to-currency"
            name="to-currency"
            value={targetCode}
            disabled={controlsDisabled}
            onChange={(event) => handleCurrencyChange(onTargetChange, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.submitButton} type="submit" disabled={conversionDisabled}>
          {quoteStatus === 'loading' ? 'Carregando taxa…' : 'Converter'}
        </button>

        <div className={styles.formFeedback} aria-live="polite">
          {currenciesStatus === 'loading' && <p className={styles.statusMessage}>Carregando moedas…</p>}
          {currenciesStatus === 'error' && (
            <div className={styles.errorPanel} role="alert">
              <p>{currenciesError}</p>
              <button type="button" onClick={onRetryCurrencies}>Tentar novamente</button>
            </div>
          )}
          {currenciesStatus === 'success' && quoteStatus === 'loading' && (
            <p className={styles.statusMessage}>Consultando cotação de {sourceCode} para {targetCode}…</p>
          )}
          {quoteStatus === 'identity' && (
            <p className={styles.statusMessage}>Mesma moeda — sem consulta de cotação ou data efetiva.</p>
          )}
          {quoteStatus === 'empty' && (
            <div className={styles.emptyPanel}>
              <p>Nenhuma cotação disponível para este par.</p>
              <button type="button" onClick={retryQuote}>Consultar novamente</button>
            </div>
          )}
          {quoteStatus === 'error' && (
            <div className={styles.errorPanel} role="alert">
              <p>{quoteError}</p>
              <button type="button" onClick={retryQuote}>Tentar novamente</button>
            </div>
          )}
          {quoteStatus === 'success' && quote && (
            <p className={styles.formNote}>
              Taxa: 1 {quote.base} = {formattedRate} {quote.quote}
              {' · '}Data efetiva: {quote.date}
            </p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {result !== null && (
            <p className={styles.conversionResult}>
              {Number(amount).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {sourceCode} ={' '}
              <strong>{result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetCode}</strong>
              {quote && sourceCode !== targetCode && (
                <span className={styles.resultDetails}>Taxa utilizada: {formattedRate} · Data efetiva: {quote.date}</span>
              )}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

export default ConverterForm
