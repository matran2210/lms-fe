import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class EntranceTestAPI {
  static get(params: Object): Promise<any> {
    return fetcher(`${apiURL}/entrance-test`, {
      params: params,
    })
  }
}

export const getEntranceTest = () => {
  return fetcher(`entrance-test`)
}
