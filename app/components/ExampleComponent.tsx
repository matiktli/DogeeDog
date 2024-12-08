'use client'

import { useLoading } from '@/app/hooks/useLoading'
import LoadingScreen from '@/app/components/LoadingScreen'

export default function ExampleComponent() {
  const { isLoading, withLoading } = useLoading()

  const handleSomeAsyncAction = async () => {
    await withLoading(async () => {
      // Your async code here
      await new Promise(resolve => setTimeout(resolve, 2000))
    })
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <button onClick={handleSomeAsyncAction}>
        Do Something
      </button>
    </>
  )
} 