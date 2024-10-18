import Keycloak, { KeycloakConfig } from 'keycloak-js'
import { setActToken, setRefreshToken } from '..'
import { fetcher } from '@services/requestV2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMessagingToken } from '@utils/firebase'
import Cookies from 'js-cookie'
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
let keycloakInstance: Keycloak | null = null
export const getKeycloakInstance = async (): Promise<Keycloak> => {
  if (!keycloakInstance) {
    const keycloakConfig: KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }
    keycloakInstance = new Keycloak(keycloakConfig)
    await keycloakInstance.init({ onLoad: 'login-required' }).then((value) => {
      handleFirebaseToken()
    })
    if (!keycloakInstance.authenticated) {
      await keycloakInstance.login()
    }
    setActToken(keycloakInstance?.token ?? '')
    setRefreshToken(keycloakInstance?.refreshToken ?? '')
    Cookies.set('accessToken', keycloakInstance?.token ?? '')
    Cookies.set('refreshToken', keycloakInstance?.refreshToken ?? '')
  }
  return keycloakInstance
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
