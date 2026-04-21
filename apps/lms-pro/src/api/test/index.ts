import { fetcher } from '@services/request'

export class TestAPI {
  static getResource(id: string) {
    return fetcher(`resource/${id}`)
  }
}
