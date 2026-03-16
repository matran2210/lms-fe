import { fetcher } from '@services/request'

export class EventTestAPI {
  static get(params: Object): Promise<any> {
    return fetcher(`event-tests`, {
      params: params,
    })
  }

  static getCount(): Promise<any> {
    return fetcher(`event-tests/count`)
  }
}
