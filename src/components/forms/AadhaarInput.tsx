import { useState } from 'react'
import FormField from './FormField'

interface AadhaarInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  error?: string
}

function AadhaarInput({ value, onChange, label = 'Aadhaar Number', required = false, error }: AadhaarInputProps) {
  const [focused, setFocused] = useState(false)

  const formatAadhaar = (num: string): string => {
    const digits = num.replace(/\D/g, '').slice(0, 12)
    if (digits.length <= 4) return digits
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12)
    onChange(raw)
  }

  const displayValue = focused ? formatAadhaar(value) : value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')

  return (
    <FormField label={label} required={required} error={error}>
      <div className="relative">
        <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 8zm-1-13h2v6h-2V7z" />
          </svg>
        </span>
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="XXXX XXXX XXXX"
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          maxLength={14}
        />
      </div>
    </FormField>
  )
}

export default AadhaarInput