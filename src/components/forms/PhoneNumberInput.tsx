import { useState } from 'react'
import FormField from './FormField'

interface PhoneNumberInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  error?: string
  placeholder?: string
}

function PhoneNumberInput({ value, onChange, label = 'Phone Number', required = false, error, placeholder = '9876543210' }: PhoneNumberInputProps) {
  const [focused, setFocused] = useState(false)

  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(raw)
  }

  const displayValue = focused ? formatPhone(value) : value.replace(/(\d{5})(\d+)/, '$1 $2')

  return (
    <FormField label={label} required={required} error={error}>
      <div className="relative">
        <span className="absolute text-sm text-gray-400 -translate-y-1/2 left-3 top-1/2">+91</span>
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </FormField>
  )
}

export default PhoneNumberInput