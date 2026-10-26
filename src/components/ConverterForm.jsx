import { useState } from 'react'

function ConverterForm({ currencies, demoRates }) {
  const [amount, setAmount] = useState('')
  const [sourceCode, setSourceCode] = useState('EUR')
  const [targetCode, setTargetCode] = useState('BRL')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

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

  function handleCurrencyChange(setCurrency, value) {
    setCurrency(value)
    setResult(null)
  }

  return (
    <section className="converter-section" id="conversor" aria-labelledby="converter-title">
      <div className="section-heading">
        <p className="eyebrow">Conversor</p>
        <h2 id="converter-title">Simule uma conversão</h2>
        <p>Pratique eventos e estado usando valores demonstrativos.</p>
      </div>

      <form className="converter-card" onSubmit={handleSubmit} noValidate>
        <div className="field amount-field">
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
              setResult(null)
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="from-currency">Moeda de origem</label>
          <select
            id="from-currency"
            name="from-currency"
            value={sourceCode}
            onChange={(event) => handleCurrencyChange(setSourceCode, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <span className="exchange-icon" aria-hidden="true">→</span>

        <div className="field">
          <label htmlFor="to-currency">Moeda de destino</label>
          <select
            id="to-currency"
            name="to-currency"
            value={targetCode}
            onChange={(event) => handleCurrencyChange(setTargetCode, event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Converter</button>

        <div className="form-feedback" aria-live="polite">
          <p className="form-note">Taxas fictícias para fins didáticos — não representam a cotação atual.</p>
          {error && <p className="error-message">{error}</p>}
          {result !== null && (
            <p className="conversion-result">
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
