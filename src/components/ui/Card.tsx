import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  border?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

function Card({ children, className, padding = 'md', hover = false, border = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg',
        border ? 'border border-gray-200' : 'shadow-sm',
        paddingMap[padding],
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between pb-3 mb-1', className)}>
      {children}
    </div>
  )
}

function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('font-bold text-gray-900', className)}>{children}</h3>
}

export { Card, CardHeader, CardTitle }
export default Card