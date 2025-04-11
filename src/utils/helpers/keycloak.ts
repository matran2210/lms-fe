/* eslint-disable react-hooks/rules-of-hooks */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetcher } from '@services/requestV2'
import { CERTIFICATE } from '@utils/constants'
import { getMessagingToken } from '@utils/firebase'
import Keycloak, { KeycloakConfig } from 'keycloak-js'
import { PageLink } from 'src/constants'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'

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

  if (
    window.location.pathname?.split('/')?.[1] !== CERTIFICATE &&
    window.location.pathname?.split('test-result/')?.[0] !==
      '/entrance-test/' &&
    window.location.pathname?.split('table-result/')?.[0] !== '/entrance-test/'
  ) {
    await setDeviceFirebaseToSession(accessDeviceToken ?? '')
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
    if (typeof window === 'undefined') {
      return
    }

    const keycloakConfig: KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }

    // Kiểm tra trạng thái login lần đầu tiên
    let isFirstLogin = false
    if (
      window.location.pathname?.split('/')?.[1] !== CERTIFICATE &&
      window.location.pathname?.split('test-result/')?.[0] !==
        '/entrance-test/' &&
      window.location.pathname?.split('table-result/')?.[0] !==
        '/entrance-test/'
    ) {
      this.keyCloak = new Keycloak(keycloakConfig)
      const authenticated = await this.keyCloak.init({
        onLoad: 'login-required',
      })

      if (authenticated) {
        // Kiểm tra lần login đầu tiên
        if (!localStorage.getItem('hasLoggedInBefore')) {
          isFirstLogin = true // Lần đầu tiên login
          localStorage.setItem('hasLoggedInBefore', 'true') // Đánh dấu đã login lần đầu
          const res = await EntranceTestAPI.getEntranceCount()
          if (isFirstLogin) {
            localStorage.setItem('enstranceTest', 'true')
            if (res?.data?.count > 0) {
              window.location.href = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}${PageLink.ENTRANCE_TEST}`
            } else {
              window.location.href = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}${PageLink.COURSES}`
            }
          }
        } else {
          isFirstLogin = false // Các lần login tiếp theo
        }
      } else {
      }
    }

    await handleFirebaseToken()
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

  async logout(redirectUri: string) {
    await this.keyCloak?.logout({ redirectUri: redirectUri })
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
    },
  )
}
