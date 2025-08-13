import { fetcher, getBaseUrl } from '@/services/request'

export class UserApi {
  static async getMe() {
    return fetcher('me', {
      baseURL: getBaseUrl('lms'),
    })
  }

  static async logout(session_id: string, keycloak_user_id: string): Promise<{ success: boolean }> {
    return fetcher('auth/logout', {
      baseURL: getBaseUrl('lms'),
      method: 'POST',
      data: {
        session_id,
        keycloak_user_id,
      },
    })
  }
}
