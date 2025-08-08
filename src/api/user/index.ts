import { fetcher } from '@/services/request'

export class UserApi {
  static async logout(session_id: string, keycloak_user_id: string): Promise<{ success: boolean }> {
    return fetcher('auth/logout', {
      baseURL: 'https://lms-be-sc3.sapp.merket.io/api/v1/',
      method: 'POST',
      data: {
        session_id,
        keycloak_user_id,
      },
    })
  }
}
