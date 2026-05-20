import type { AuthData } from '@/shared/types'

const STORAGE_KEY = 'opkit.auth'

export function loadAuth(): AuthData | null {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return null
  }

  try {
    return JSON.parse(saved) as AuthData
  } catch {
    return null
  }
}

export function saveAuth(auth: AuthData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY)
}