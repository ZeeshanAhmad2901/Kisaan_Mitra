import { useRef, useState, type KeyboardEvent } from 'react'

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  error?: string
}

function OTPInput({ length = 6, onComplete, error }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    const otp = newValues.join('')
    if (otp.length === length) {
      onComplete(otp)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted.length === 0) return

    const newValues = [...values]
    pasted.split('').forEach((char, i) => {
      if (i < length) newValues[i] = char
    })
    setValues(newValues)

    const nextIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[nextIndex]?.focus()

    if (pasted.length >= length) {
      onComplete(pasted.slice(0, length))
    }
  }

  return (
    <div>
      <div className="flex justify-center gap-2">
        {values.map((val, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-center text-red-500">{error}</p>}
    </div>
  )
}

export default OTPInput