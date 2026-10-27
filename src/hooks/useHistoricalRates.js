import { useCallback, useEffect, useRef, useState } from 'react'
import { getHistoricalRates } from '../services/frankfurter.js'
import { calculateHistoricalInterval } from '../utils/periods.js'

const initialState = {
  requestToken: '',
  status: 'idle',
  data: [],
  error: '',
}

export function useHistoricalRates({
  sourceCode,
  targetCode,
  pairRevision,
  period,
  enabled = true,
  referenceDate,
  requestHistory = getHistoricalRates,
}) {
  const [historyState, setHistoryState] = useState(initialState)
  const [attempt, setAttempt] = useState(0)
  const [today] = useState(() => new Date())
  const latestRequest = useRef(0)
  const interval = calculateHistoricalInterval(period, referenceDate ?? today)
  const requestToken = `${sourceCode}/${targetCode}/${pairRevision}/${period}/${interval.from}/${interval.to}/${attempt}`

  useEffect(() => {
    const requestId = latestRequest.current + 1
    latestRequest.current = requestId
    const controller = new AbortController()
    let active = true

    if (!enabled || !sourceCode || !targetCode || sourceCode === targetCode) {
      return () => controller.abort()
    }

    async function loadHistory() {
      try {
        const data = await requestHistory(sourceCode, targetCode, interval.from, interval.to, {
          signal: controller.signal,
        })
        if (!active || latestRequest.current !== requestId) return

        setHistoryState({
          requestToken,
          status: data.length === 0 ? 'empty' : 'success',
          data,
          error: '',
        })
      } catch (requestError) {
        if (!active || latestRequest.current !== requestId || requestError.name === 'AbortError') return

        setHistoryState({
          requestToken,
          status: requestError.status === 404 ? 'empty' : 'error',
          data: [],
          error: requestError.status === 404 ? '' : 'Não foi possível carregar o histórico. Tente novamente.',
        })
      }
    }

    loadHistory()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, interval.from, interval.to, requestHistory, requestToken, sourceCode, targetCode])

  let status = historyState.status
  if (!enabled || !sourceCode || !targetCode) {
    status = 'idle'
  } else if (sourceCode === targetCode) {
    status = 'identity'
  } else if (historyState.requestToken !== requestToken) {
    status = 'loading'
  }

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  return {
    data: status === 'success' ? historyState.data : [],
    status,
    error: status === 'error' ? historyState.error : '',
    interval,
    retry,
  }
}
