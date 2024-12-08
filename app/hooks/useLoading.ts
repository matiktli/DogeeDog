import { useState, useCallback } from 'react'

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true)
    try {
      const result = await fn()
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, withLoading }
} 