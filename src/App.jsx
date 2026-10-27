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
  return (
    <div className={styles.appShell}>
      <Header brandName="Câmbio Fácil" navigationItems={navigationItems} />

      <main className={styles.main} id="inicio">
        <Hero
          title="Entenda o câmbio sem complicação."
          description="Converta valores e acompanhe a variação das moedas em uma experiência simples e direta."
          exampleRate="1 EUR = 6,20 BRL"
        />
        <ConverterForm currencies={currencies} demoRates={demoRates} />
        <HistorySection description="O gráfico, os filtros, a ordenação e a exportação CSV serão construídos progressivamente e testados em etapas próprias." />
      </main>

      <Footer dataSource="API Frankfurter" />
    </div>
  )
}

export default App
