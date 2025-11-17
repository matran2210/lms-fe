import { fetcher } from '@services/requestV2'
import { IResponse } from '@lms/core'
import { IEntranceTest } from '@lms/core'

export class EntranceTestAPI {
  static get(params: Object): Promise<IResponse<IEntranceTest[]>> {
    return fetcher(`entrance-test`, {
      params: params,
    })
  }

  static getListUnivers(): Promise<any> {
    return fetcher(`universities`)
  }

  static getListUniversProgram(): Promise<any> {
    return fetcher(`university-programs`)
  }

  static getListMajors(): Promise<any> {
    return fetcher(`majors`)
  }

  static getListEngLevel(): Promise<any> {
    return fetcher(`english-levels`)
  }

  static getEntranceCount(): Promise<any> {
    return fetcher(`users/entrance-test/count`)
  }

  static getListEntranceTestLogin(): Promise<any> {
    return fetcher(`entrance-test`)
  }

  static putLevel(data: any) {
    return fetcher(`users/input-level`, {
      method: 'PUT',
      data: data,
    })
  }
}
