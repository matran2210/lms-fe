import Keycloak, { KeycloakConfig } from 'keycloak-js'

let keycloakInstance: Keycloak | null = null

export const getKeycloakInstance = (): Keycloak => {
  if (!keycloakInstance) {
    const keycloakConfig: KeycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    }
    keycloakInstance = new Keycloak(keycloakConfig)
  }
  return keycloakInstance
}
