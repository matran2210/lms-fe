import { fetcher } from '@services/requestV2'
import { IRequest, IRequestList, IResponse } from 'src/type'

export class RequestAPI {
  static getRequests({
    page_index,
    page_size,
    params,
  }: {
    page_index: number
    page_size: number
    params?: Object
  }): Promise<IResponse<IRequestList>> {
    return fetcher(
      `/request-schedules?page_index=${page_index}&page_size=${page_size}`,
      {
        params,
      },
    )
  }

  static updateRequestStatus(
    id: string,
    status: string,
  ): Promise<IResponse<IRequestList>> {
    return fetcher(`/requests/${id}/status`, {
      method: 'PUT',
      data: { status },
    })
  }

  static deleteRequest(data: any): Promise<IResponse<any>> {
    return fetcher(`requests`, {
      method: 'DELETE',
      data,
    })
  }

  static getTimeOffRequests({
    page_index,
    page_size,
    params,
  }: {
    page_index: number
    page_size: number
    params?: Object
  }): Promise<IResponse<IRequest>> {
    return fetcher(
      `/request-schedules?page_index=${page_index}&page_size=${page_size}&request_type=TEACHER_SCHEDULE_TIME_OFF`,
      {
        params,
      },
    )
  }
}
