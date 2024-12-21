import { FC } from 'react'

interface UpdateEntryProps {
  title: string
  date: string
  description: React.ReactNode
}

const UpdateEntry: FC<UpdateEntryProps> = ({ title, date, description }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-[var(--foreground)]/60">• {date}</span>
      </div>
      <div className="text-[var(--foreground)]/80 space-y-2">
        {description}
      </div>
    </div>
  )
}

export default UpdateEntry 