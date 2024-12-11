'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import SearchableList from '@/app/components/SearchableList'
import UserCard from '@/app/components/UserCard'
import Loading from '@/app/components/Loading'
import { User } from '@/app/types/user'

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 4,
    totalItems: 0,
    totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<Record<string, string>>({})
  const loadingRef = useRef(false)

  const fetchUsers = useCallback(async (page: number, isLoadMore: boolean = false) => {
    // Prevent duplicate fetches
    if (loadingRef.current) return
    
    try {
      setIsLoading(true)
      loadingRef.current = true
      
      const params = new URLSearchParams({
        ...searchParams,
        page: page.toString()
      })
      
      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()
      
      setUsers(prev => isLoadMore ? [...prev, ...data.users] : data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [searchParams])

  // Initial load and search
  useEffect(() => {
    setUsers([]) // Clear users when search params change
    fetchUsers(1)
  }, [searchParams, fetchUsers])

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    try {
      if (pagination.currentPage < pagination.totalPages && !loadingRef.current) {
        fetchUsers(pagination.currentPage + 1, true)
      }
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination.currentPage, pagination.totalPages, fetchUsers])

  const handleSearch = useCallback(async (newSearchParams: Record<string, string>) => {
    setIsLoading(true)
    try {
      setSearchParams(newSearchParams)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchFields = [
    {
      key: 'name',
      label: 'Name',
      placeholder: 'Search by name...'
    }
  ]

  const hasMore = pagination.currentPage < pagination.totalPages

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community</h1>
      
      <SearchableList
        fields={searchFields}
        onSearch={handleSearch}
        pagination={pagination}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      >
        {isLoading && users.length === 0 ? (
          <Loading height="h-[50vh]" />
        ) : (
          <>
            {users.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
            {isLoading && users.length > 0 && (
              <Loading height="h-32" />
            )}
          </>
        )}
      </SearchableList>
    </div>
  )
} 