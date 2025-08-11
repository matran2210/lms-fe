import { TOKEN_STORAGE_KEY } from '@/constants'
import { ZOOM_CONFIG } from '@/constants/zoom'

export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

function parseJwt<T extends object = Record<string, unknown>>(token: string): T | null {
  try {
    if (!token) return null
    const base64Payload = token.split('.')[1] || ''
    const payload = atob(base64Payload) // decode base64
    return JSON.parse(payload) as T
  } catch (error) {
    return null
  }
}

export function getSessionIdFromToken(token: string): string | null {
  const decoded = parseJwt(token)
  return typeof decoded?.session_state === 'string' ? decoded.session_state : null
}

export function toggleMeetingContainer(display: 'block' | 'none') {
  const zoomContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID)
  if (zoomContainer) {
    zoomContainer.style.display = display
  }
}

export const getToken = (tokenFromParams: string | null): string | null => {
  if (typeof window === 'undefined') return null

  if (tokenFromParams) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenFromParams)
    return tokenFromParams
  }

  return sessionStorage.getItem(TOKEN_STORAGE_KEY)
}
