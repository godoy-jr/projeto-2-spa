import { useState } from 'react'
import styles from './ConverterForm.module.css'

function ConverterForm({
  currencies,
  demoRates,
  sourceCode,
  targetCode,
  onSourceChange,
  onTargetChange,
  onInvertCurrencies,
}) {
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function resetFeedback() {
    setResult(null)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!amount || numericAmount <= 0) {
      setError('Informe um valor maior que zero.')
      setResult(null)
      return
    }

    const convertedAmount = numericAmount * (demoRates[sourceCode] / demoRates[targetCode])

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

  return (
    <section className={styles.converterSection} id="conversor" aria-labelledby="converter-title">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Conversor</p>
        <h2 id="converter-title">Simule uma conversão</h2>
        <p>Pratique eventos e estado usando valores demonstrativos.</p>
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
            onChange={(event) => handleCurrencyChange(onSourceChange, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.invertButton} type="button" onClick={handleInvert}>
          <span aria-hidden="true">⇄</span>
          <span>Inverter moedas</span>
        </button>

        <div className={styles.field}>
          <label htmlFor="to-currency">Moeda de destino</label>
          <select
            id="to-currency"
            name="to-currency"
            value={targetCode}
            onChange={(event) => handleCurrencyChange(onTargetChange, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.submitButton} type="submit">Converter</button>

        <div className={styles.formFeedback} aria-live="polite">
          <p className={styles.formNote}>Taxas fictícias para fins didáticos — não representam a cotação atual.</p>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {result !== null && (
            <p className={styles.conversionResult}>
              {Number(amount).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {sourceCode} ={' '}
              <strong>{result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetCode}</strong>
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

export default ConverterForm
