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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={28} stroke="var(--chart-axis)" />
          <YAxis domain={['auto', 'auto']} tickFormatter={formatRate} width={76} stroke="var(--chart-axis)" />
          <Tooltip labelFormatter={formatDate} formatter={(value) => [formatRate(value), 'Cotação']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
          <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryChart
