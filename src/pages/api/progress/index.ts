import { fetcher } from '@services/requestV2'
import { IQueryParams, IResponse } from 'src/type'
import { IProgressList } from '../../../type/progress'

export class ProgressAPI {
  static getProgress({
    page_index,
    page_size,
    otherParams,
  }: IQueryParams): Promise<IResponse<IProgressList>> {
    return fetcher('/request-schedules', {
      params: {
        page_index,
        page_size,
        ...otherParams,
      },
    })
  }
}
