export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}