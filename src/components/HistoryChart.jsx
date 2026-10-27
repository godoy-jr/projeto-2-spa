import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './HistorySection.module.css'

function HistoryChart({ data, sourceCode, targetCode, formatDate, formatRate }) {
  return (
    <div className={styles.chart} role="img" aria-label={`Gráfico de ${sourceCode} para ${targetCode}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 18, left: 8, bottom: 8 }} accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" stroke="#d6e4df" />
          <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={28} />
          <YAxis domain={['auto', 'auto']} tickFormatter={formatRate} width={76} />
          <Tooltip labelFormatter={formatDate} formatter={(value) => [formatRate(value), 'Cotação']} />
          <Line type="monotone" dataKey="rate" stroke="#176f49" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryChart
