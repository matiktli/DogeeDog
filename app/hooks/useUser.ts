import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  imageUrl?: string
}

export function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, loading }
} 