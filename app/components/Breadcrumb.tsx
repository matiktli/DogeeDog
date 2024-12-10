import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link 
              href={item.href}
              className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)]">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-[var(--foreground)]/60" />
          )}
        </div>
      ))}
    </nav>
  )
} 