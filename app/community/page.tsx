'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import SearchableList from '@/app/components/SearchableList'
import UserCard from '@/app/components/UserCard'
import Loading from '@/app/components/Loading'
import { User } from '@/app/types/user'
import { Pagination } from '@/app/types/pagination'

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0
  })
  const [isLoading, setIsLoading] = useState(true)
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
      updatePagination(data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [searchParams])

  // Initial load and search
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        await fetchUsers(pagination.currentPage)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [pagination.currentPage, fetchUsers])

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

  const updatePagination = (data: any) => {
    setPagination({
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      pageSize: data.pageSize || 10,
      totalItems: data.totalItems || 0
    })
  }

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