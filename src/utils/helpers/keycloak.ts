/* eslint-disable react-hooks/rules-of-hooks */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetcher } from '@services/requestV2'
import { CERTIFICATE_DETAIL } from '@utils/constants'
import { getMessagingToken } from '@utils/firebase'
import Keycloak, { KeycloakConfig } from 'keycloak-js'
import { NextRouter, useRouter } from 'next/router'

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
  await setDeviceFirebaseToSession(accessDeviceToken ?? '')
}
export class AuthenticationManager {
  keyCloak: Keycloak = null as any
  router: NextRouter | null = null

  constructor() {
    if (AuthenticationManager.instance) {
      return AuthenticationManager.instance
    }

    this.initKeyCloakConnect()
    AuthenticationManager.instance = this
  }

  async initKeyCloakConnect() {
    this.router = useRouter()

    const keycloakConfig: KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }

    if (this.router.pathname !== CERTIFICATE_DETAIL) {
      this.keyCloak = new Keycloak(keycloakConfig)
      await this.keyCloak.init({ onLoad: 'login-required' })
      await handleFirebaseToken()
    }
  }

  getToken(): string {
    return this.keyCloak?.token ?? ''
  }

  async refreshToken() {
    const response = await this.keyCloak?.updateToken(30)
    if (!response) {
      await this.keyCloak.login()
    }
    return this.keyCloak?.token
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
