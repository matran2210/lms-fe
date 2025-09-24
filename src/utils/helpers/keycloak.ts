/* eslint-disable react-hooks/rules-of-hooks */
import { UserApi } from '@/api/user'
import { fetcher } from '@/services/request'
import { getMessagingToken } from '@/utils/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Keycloak from 'keycloak-js'
import { COOKIE_INFO } from 'src/constants'
import { deleteCookie, getCookie, getSessionIdFromToken, setCookie } from '../index'

const handleFirebaseToken = async () => {
  const accessDeviceToken = await AsyncStorage.getItem('firebaseDeviceToken')
  if (!accessDeviceToken) {
    if (window?.Notification?.permission !== 'denied') {
      const token = ((await getMessagingToken()) as string) ?? ''
      if (token !== '') {
        await AsyncStorage.setItem('firebaseDeviceToken', token)
        await setDeviceFirebaseToSession(token ?? '')
      }
    }
    return
  }
}
export class AuthenticationManager {
  keyCloak: Keycloak = null as any

  constructor() {
    if (AuthenticationManager.instance) {
      return AuthenticationManager.instance
    }

    this.initKeyCloakConnect()
    AuthenticationManager.instance = this
  }

  async initKeyCloakConnect() {
    if (typeof window === 'undefined') return // Chạy client-side thôi

    const keycloakConfig: Keycloak.KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }

    const existingToken = getCookie('keycloakToken')
    const existingRefreshToken = getCookie('keycloakRefreshToken')

    this.keyCloak = new Keycloak(keycloakConfig)

    if (existingToken && existingRefreshToken) {
      this.keyCloak.token = existingToken
      this.keyCloak.refreshToken = existingRefreshToken
      return
    }

    const authenticated = await this.keyCloak.init({
      onLoad: 'login-required',
    })

    if (authenticated) {
      const token = this.keyCloak.token
      const refreshToken = this.keyCloak.refreshToken
      setCookie(COOKIE_INFO.KEYCLOAK_TOKEN, token ?? '')
      setCookie(COOKIE_INFO.KEYCLOAK_REFRESH_TOKEN, refreshToken ?? '')
      setCookie(COOKIE_INFO.SESSION_ID, this.keyCloak.sessionId ?? '')

      await handleFirebaseToken()
    }
  }

  getToken(): string {
    return this.keyCloak?.token ?? ''
  }

  /**
   * Làm mới token nếu token còn dưới 30s
   *
   * @returns {Promise<string | null>} - Token mới, nếu không thể làm mới sẽ trả về null
   */
  async refreshToken(): Promise<string | null> {
    try {
      // Kiểm tra token còn dưới 30s, nếu có, làm mới token
      if (this.keyCloak?.token) {
        const refreshed = await this.keyCloak?.updateToken(30)
        if (refreshed) {
          return this.keyCloak.token
        }
      }
    } catch (error) {
      // Nếu xảy ra lỗi, thử lại bằng cách login
      await this.keyCloak?.login()
    }
    return null
  }

  async logout() {
    const sessionId = getSessionIdFromToken(getCookie(COOKIE_INFO.KEYCLOAK_TOKEN) ?? '')
    const res = await UserApi.logout(
      sessionId ?? getCookie(COOKIE_INFO.SESSION_ID) ?? '',
      getCookie(COOKIE_INFO.KEYCLOAK_USER_ID) ?? ''
    )
    if (res?.success) {
      localStorage.clear()
      deleteCookie(COOKIE_INFO.KEYCLOAK_TOKEN)
      deleteCookie(COOKIE_INFO.KEYCLOAK_REFRESH_TOKEN)
      deleteCookie(COOKIE_INFO.SESSION_ID)
      deleteCookie(COOKIE_INFO.KEYCLOAK_USER_ID)
      window.location.reload()
    }
  }

  static instance: AuthenticationManager
}

export async function setDeviceFirebaseToSession(token: string): Promise<void> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/user-session-provider/sessions/device`,
    {
      method: 'POST',
      data: {
        device_id: token,
      },
    }
  )
}
