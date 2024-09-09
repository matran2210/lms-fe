import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class EventTestAPI {
  static get(params: Object): Promise<any> {
    return fetcher(`${apiURL}/event-tests`, {
      params: params,
    })
  }

  static getCount(): Promise<any> {
    return fetcher(`${apiURL}/event-tests/count`)
  }
}
