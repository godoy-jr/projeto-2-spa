import { useState } from 'react'
import styles from './App.module.css'
import ConverterForm from './components/ConverterForm'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import HistorySection from './components/HistorySection'

const navigationItems = [
  { label: 'Conversor', href: '#conversor' },
  { label: 'Histórico', href: '#historico' },
]

const currencies = [
  { code: 'BRL', name: 'Real brasileiro' },
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'Dólar americano' },
]

const demoRates = {
  BRL: 1,
  EUR: 6.2,
  USD: 5.7,
}

function App() {
  const [sourceCode, setSourceCode] = useState('EUR')
  const [targetCode, setTargetCode] = useState('BRL')

  function handleInvertCurrencies() {
    setSourceCode(targetCode)
    setTargetCode(sourceCode)
  }

  return (
    <div className={styles.appShell}>
      <Header brandName="Câmbio Fácil" navigationItems={navigationItems} />

      <main className={styles.main} id="inicio">
        <Hero
          title="Entenda o câmbio sem complicação."
          description="Converta valores e acompanhe a variação das moedas em uma experiência simples e direta."
          exampleRate="1 EUR = 6,20 BRL"
        />
        <ConverterForm
          currencies={currencies}
          demoRates={demoRates}
          sourceCode={sourceCode}
          targetCode={targetCode}
          onSourceChange={setSourceCode}
          onTargetChange={setTargetCode}
          onInvertCurrencies={handleInvertCurrencies}
        />
        <HistorySection sourceCode={sourceCode} targetCode={targetCode} />
      </main>

      <Footer dataSource="API Frankfurter" />
    </div>
  )
}

export default App
