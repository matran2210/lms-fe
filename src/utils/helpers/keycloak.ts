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
    if (typeof window === 'undefined') return
  
    const keycloakConfig: KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }
  
    const existingToken = localStorage.getItem('keycloakToken')
    const existingRefreshToken = localStorage.getItem('keycloakRefreshToken')
  
    this.keyCloak = new Keycloak(keycloakConfig)
  
    // Nếu đã có token => không init lại
    if (existingToken && existingRefreshToken) {
      this.keyCloak.token = existingToken
      this.keyCloak.refreshToken = existingRefreshToken
      return
    }
  
    // Chưa có token => init Keycloak
    const authenticated = await this.keyCloak.init({
      onLoad: 'login-required',
    })
  
    if (authenticated) {
      const token = this.keyCloak.token
      const refreshToken = this.keyCloak.refreshToken
  
      localStorage.setItem('keycloakToken', token ?? '')
      localStorage.setItem('keycloakRefreshToken', refreshToken ?? '')
  
      // Xử lý lần đầu login
      const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore')
      if (!hasLoggedInBefore) {
        localStorage.setItem('hasLoggedInBefore', 'true')
  
        const res = await EntranceTestAPI.getEntranceCount()
  
        localStorage.setItem('enstranceTest', 'true')
        if (res?.data?.count > 0) {
          window.location.href = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}${PageLink.ENTRANCE_TEST}`
        } else {
          window.location.href = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}${PageLink.COURSES}`
        }
      }
    }
  }
  
  

  getToken(): string {
    return this.keyCloak?.token ?? ''
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
