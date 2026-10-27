import { useEffect, useState } from 'react'
import styles from './App.module.css'
import ConverterForm from './components/ConverterForm'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import HistorySection from './components/HistorySection'
import { getCurrencies } from './services/frankfurter'

const navigationItems = [
  { label: 'Conversor', href: '#conversor' },
  { label: 'Histórico', href: '#historico' },
]

function App() {
  const [sourceCode, setSourceCode] = useState('EUR')
  const [targetCode, setTargetCode] = useState('BRL')
  const [pairRevision, setPairRevision] = useState(0)
  const [currencies, setCurrencies] = useState([])
  const [currenciesStatus, setCurrenciesStatus] = useState('loading')
  const [currenciesError, setCurrenciesError] = useState('')
  const [currenciesRequest, setCurrenciesRequest] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadCurrencies() {
      setCurrenciesStatus('loading')
      setCurrenciesError('')

      try {
        const data = await getCurrencies({ signal: controller.signal })
        if (!active) return

        const availableCurrencies = data
          .map(({ iso_code: code, name }) => ({ code, name }))
          .sort((left, right) => left.code.localeCompare(right.code))

        setCurrencies(availableCurrencies)
        setCurrenciesStatus('success')
      } catch (error) {
        if (!active || error.name === 'AbortError') return
        setCurrencies([])
        setCurrenciesStatus('error')
        setCurrenciesError('Não foi possível carregar as moedas. Tente novamente.')
      }
    }

    loadCurrencies()

    return () => {
      active = false
      controller.abort()
    }
  }, [currenciesRequest])

  function handleInvertCurrencies() {
    setSourceCode(targetCode)
    setTargetCode(sourceCode)
    setPairRevision((current) => current + 1)
  }

  function handleSourceChange(code) {
    setSourceCode(code)
    setPairRevision((current) => current + 1)
  }

  function handleTargetChange(code) {
    setTargetCode(code)
    setPairRevision((current) => current + 1)
  }

  return (
    <div className={styles.appShell}>
      <Header brandName="Câmbio Fácil" navigationItems={navigationItems} />

      <main className={styles.main} id="inicio">
        <Hero
          title="Entenda o câmbio sem complicação."
          description="Converta valores e acompanhe a variação das moedas em uma experiência simples e direta."
        />
        <ConverterForm
          currencies={currencies}
          currenciesStatus={currenciesStatus}
          currenciesError={currenciesError}
          onRetryCurrencies={() => setCurrenciesRequest((current) => current + 1)}
          sourceCode={sourceCode}
          targetCode={targetCode}
          pairRevision={pairRevision}
          onSourceChange={handleSourceChange}
          onTargetChange={handleTargetChange}
          onInvertCurrencies={handleInvertCurrencies}
        />
        <HistorySection sourceCode={sourceCode} targetCode={targetCode} />
      </main>

      <Footer dataSource="API Frankfurter" />
    </div>
  )
}

export default App
