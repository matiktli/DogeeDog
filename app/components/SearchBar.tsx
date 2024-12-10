'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/app/hooks/useDebounce'

interface SearchField {
  key: string
  label: string
  placeholder: string
}

interface SearchBarProps {
  fields: SearchField[]
  onSearch: (searchParams: Record<string, string>) => void
  className?: string
}

export default function SearchBar({ fields, onSearch, className = '' }: SearchBarProps) {
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const debouncedSearchValues = useDebounce(searchValues, 300)

  useEffect(() => {
    onSearch(debouncedSearchValues)
  }, [debouncedSearchValues, onSearch])

  const handleSearchChange = (key: string, value: string) => {
    setSearchValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {fields.map((field) => (
        <div key={field.key} className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--foreground)]/10 
                bg-[var(--background)] focus:outline-none focus:border-[var(--accent)]
                transition-colors"
              onChange={(e) => handleSearchChange(field.key, e.target.value)}
              value={searchValues[field.key] || ''}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)]/40" />
          </div>
        </div>
      ))}
    </div>
  )
} 