import { useEffect, useState } from 'react'
import styles from './App.module.css'
import ConverterForm from './components/ConverterForm'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import HistorySection from './components/HistorySection'
import FavoritesSection from './components/FavoritesSection'
import FloatingNav from './components/FloatingNav'
import AppPanel from './components/AppPanel'
import { useFavorites } from './hooks/useFavorites'
import { useTheme } from './hooks/useTheme'
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
  const [activeSection, setActiveSection] = useState('conversor')
  const [openPanel, setOpenPanel] = useState(null)
  const { favorites, toggleFavorite } = useFavorites()
  const { theme, resolvedTheme, setTheme } = useTheme()

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

  function selectPair(source, target) {
    setSourceCode(source)
    setTargetCode(target)
    setPairRevision((current) => current + 1)
    setActiveSection('conversor')
    document.getElementById('conversor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleNavigate(item) {
    setActiveSection(item.id)
    if (item.panel) {
      setOpenPanel(item.panel)
      return
    }
    setOpenPanel(null)
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isFavorite = favorites.some((item) => item.source === sourceCode && item.target === targetCode)

  return (
    <div className={styles.appShell}>
      <Header brandName="Câmbio Fácil" navigationItems={navigationItems} />

      <main className={styles.main} id="inicio">
        <Hero
          title="Conversor de moedas"
          description="Cotações de referência, histórico e favoritos em um só lugar."
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
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(sourceCode, targetCode)}
        />
        <HistorySection
          sourceCode={sourceCode}
          targetCode={targetCode}
          pairRevision={pairRevision}
          enabled={currenciesStatus === 'success'}
        />
        <FavoritesSection
          favorites={favorites}
          onSelect={selectPair}
          onRemove={toggleFavorite}
        />
      </main>

      <Footer dataSource="API Frankfurter" />
      <FloatingNav active={activeSection} onNavigate={handleNavigate} theme={theme} resolvedTheme={resolvedTheme} onThemeChange={setTheme} />
      {openPanel && (
        <AppPanel
          type={openPanel}
          sourceCode={sourceCode}
          targetCode={targetCode}
          onClose={() => setOpenPanel(null)}
        />
      )}
    </div>
  )
}

export default App
