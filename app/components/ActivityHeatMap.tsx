import { useEffect, useState } from 'react'
import { format, getMonth, getDate, getDaysInMonth } from 'date-fns'

interface Activity {
    type: string
    createdAt: string
    data: any
}

interface ActivityResponse {
    activities: Activity[]
    pagination: {
        currentPage: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

interface ActivityHeatMapProps {
    userId?: string | undefined
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getMonthSpan(year: number, monthIndex: number): { start: number; span: number } {
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const daysInMonth = getDaysInMonth(firstDayOfMonth);
    
    // Calculate which column this month starts in
    let startColumn = 0;
    for (let m = 0; m < monthIndex; m++) {
        const prevMonth = new Date(year, m, 1);
        startColumn += Math.ceil(getDaysInMonth(prevMonth) / 7);
    }
    
    // Calculate how many columns this month spans
    const span = Math.ceil(daysInMonth / 7);
    
    return { start: startColumn, span };
}

export default function ActivityHeatMap({ userId }: ActivityHeatMapProps) {
    const currentYear = new Date().getFullYear();
    const monthSpans = MONTHS.map((_, index) => getMonthSpan(currentYear, index));
    const totalColumns = monthSpans.reduce((sum, span) => sum + span.span, 0);

    const [activityMap, setActivityMap] = useState<any[][]>(
        Array(7).fill(null).map(() =>
            Array(totalColumns).fill(null).map(() => ({ count: 0, date: null }))
        )
    );
    

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                let response;
                if (userId) {
                    response = await fetch(`/api/activity?userId=${userId}&size=1000`)
                } else {
                    response = await fetch(`/api/activity?size=1000`)
                }
                const data: ActivityResponse = await response.json()
                
                // Initialize the map with proper dates
                const newActivityMap = Array(7).fill(null).map(() =>
                    Array(totalColumns).fill(null).map(() => ({ count: 0, date: '' }))
                )

                // First, populate all dates
                const year = new Date().getFullYear()
                for (let month = 0; month < 12; month++) {
                    const daysInMonth = getDaysInMonth(new Date(year, month))
                    
                    // Calculate starting column for this month
                    let startColumn = 0
                    for (let m = 0; m < month; m++) {
                        const prevMonth = new Date(year, m, 1)
                        startColumn += Math.ceil(getDaysInMonth(prevMonth) / 7)
                    }

                    // Populate dates for this month
                    for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day)
                        const dayOfMonth = day - 1 // 0-based
                        const columnInMonth = Math.floor(dayOfMonth / 7)
                        const column = startColumn + columnInMonth
                        const row = dayOfMonth % 7

                        if (column < totalColumns && row < 7) {
                            const dateStr = format(date, 'd MMM')
                            newActivityMap[row][column].date = dateStr
                        }
                    }
                }
                
                // Then, add activity counts
                data.activities.forEach(activity => {
                    const date = new Date(activity.createdAt)
                    const month = getMonth(date)
                    const dayOfMonth = getDate(date) - 1 // 0-based
                    
                    // Calculate the starting column for this month
                    let startColumn = 0
                    for (let m = 0; m < month; m++) {
                        const prevMonth = new Date(date.getFullYear(), m, 1)
                        startColumn += Math.ceil(getDaysInMonth(prevMonth) / 7)
                    }
                    
                    // Calculate column within the month
                    const columnInMonth = Math.floor(dayOfMonth / 7)
                    const column = startColumn + columnInMonth
                    const row = dayOfMonth % 7
                    
                    if (column < totalColumns && row < 7) {
                        newActivityMap[row][column].count++
                    }
                })
                
                setActivityMap(newActivityMap)
            } catch (error) {
                console.error('Error fetching activities:', error)
            }
        }

        fetchActivities()
    }, [userId])

    return (
        <div className="w-full overflow-x-auto md:overflow-x-visible">
            <div className="min-w-[800px] md:min-w-0">
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="p-1 w-8"></th>
                            {MONTHS.map((month, monthIndex) => {
                                const span = monthSpans[monthIndex].span;
                                return (
                                    <th 
                                        key={month} 
                                        colSpan={span}
                                        className="text-xs text-gray-500 font-normal p-1"
                                    >
                                        {month}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map((day, rowIndex) => (
                            <tr key={day}>
                                <td className="text-xs text-gray-500 pr-2">{day}</td>
                                {Array(totalColumns).fill(null).map((_, colIndex) => (
                                    <td 
                                        key={colIndex}
                                        className="p-[1px] relative group"
                                    >
                                        {activityMap[rowIndex][colIndex].date && (
                                            <>
                                                <div 
                                                    className={`w-3 h-3 rounded-sm ${getActivityColor(activityMap[rowIndex][colIndex].count)}`}
                                                >
                                                </div>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                    {activityMap[rowIndex][colIndex].count} activities on: {activityMap[rowIndex][colIndex].date}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function getActivityColor(count: number): string {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 5) return 'bg-green-300'
    if (count <= 10) return 'bg-green-400'
    return 'bg-green-500'
} 