import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}

function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('w-full', className)}>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default FormField