import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class EntranceTestAPI {
  static get(params: Object): Promise<any> {
    return fetcher(`${apiURL}/entrance-test`, {
      params: params,
    })
  }

  static getListUnivers(): Promise<any> {
    return fetcher(`${apiURL}/universities`)
  }

  static getListUniversProgram(): Promise<any> {
    return fetcher(`${apiURL}/university-programs`)
  }

  static getListMajors(): Promise<any> {
    return fetcher(`${apiURL}/majors`)
  }

  static getListEngLevel(): Promise<any> {
    return fetcher(`${apiURL}/english-levels`)
  }

  static getEntranceCount(): Promise<any> {
    return fetcher(`${apiURL}/users/entrance-test/count`)
  }

  static getListEntranceTestLogin(): Promise<any> {
    return fetcher(`${apiURL}/entrance-test`)
  }

  static putLevel(data: any) {
    return fetcher(`${apiURL}/users/input-level`, {
      method: 'PUT',
      data: data,
    })
  }
}
