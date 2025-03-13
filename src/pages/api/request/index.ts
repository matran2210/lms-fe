import { fetcher } from '@services/requestV2'
import { IQueryParams, IRequestList, IResponse } from 'src/type'

export class RequestAPI {
  static getRequests({
    page_index,
    page_size,
    otherParams,
  }: IQueryParams): Promise<IResponse<IRequestList>> {
    return fetcher('/request-schedules', {
      params: {
        page_index,
        page_size,
        ...otherParams,
      },
    })
  }
}
