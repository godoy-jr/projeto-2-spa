import { useCallback, useEffect, useRef, useState } from 'react'
import { getLatestRate } from '../services/frankfurter.js'

const initialState = {
  pairKey: '',
  requestToken: '',
  status: 'idle',
  data: null,
  error: '',
}

export function useExchangeRate({
  sourceCode,
  targetCode,
  pairRevision,
  enabled = true,
  requestRate = getLatestRate,
}) {
  const [quoteState, setQuoteState] = useState(initialState)
  const [attempt, setAttempt] = useState(0)
  const latestRequest = useRef(0)
  const pairKey = `${sourceCode}/${targetCode}`
  const requestToken = `${pairRevision}/${attempt}`

  useEffect(() => {
    const requestId = latestRequest.current + 1
    latestRequest.current = requestId
    const controller = new AbortController()
    let active = true

    if (!enabled || !sourceCode || !targetCode || sourceCode === targetCode) {
      return () => controller.abort()
    }

    async function loadQuote() {
      try {
        const data = await requestRate(sourceCode, targetCode, { signal: controller.signal })
        if (!active || latestRequest.current !== requestId) return

        if (data === null) {
          setQuoteState({ pairKey, requestToken, status: 'empty', data: null, error: '' })
          return
        }

        setQuoteState({ pairKey, requestToken, status: 'success', data, error: '' })
      } catch (requestError) {
        if (!active || latestRequest.current !== requestId || requestError.name === 'AbortError') return

        if (requestError.status === 404) {
          setQuoteState({ pairKey, requestToken, status: 'empty', data: null, error: '' })
          return
        }

        setQuoteState({
          pairKey,
          requestToken,
          status: 'error',
          data: null,
          error: 'Não foi possível carregar a cotação. Tente novamente.',
        })
      }
    }

    loadQuote()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, pairKey, requestRate, requestToken, sourceCode, targetCode])

  let status = quoteState.status
  if (!enabled || !sourceCode || !targetCode) {
    status = 'idle'
  } else if (sourceCode === targetCode) {
    status = 'identity'
  } else if (quoteState.pairKey !== pairKey || quoteState.requestToken !== requestToken) {
    status = 'loading'
  }

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  return {
    quote: status === 'success' ? quoteState.data : null,
    status,
    error: status === 'error' ? quoteState.error : '',
    retry,
  }
}
