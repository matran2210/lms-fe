import { fetcher } from '@services/requestV2'
import { IQueryParams, IResponse } from 'src/type'
import { IProgressList, IRequestCreateProgress } from 'src/type/progress'

export class ProgressAPI {
  static getProgressList({
    page_index,
    page_size,
    params,
  }: {
    page_index: number
    page_size: number
    params?: Object
  }): Promise<IResponse<IProgressList>> {
    return fetcher(`class-teaching-progress`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...params,
      },
    })
  }

  static getProgressDetail(id: string) {
    return fetcher(`class-teaching-progress/${id}`)
  }

  static getListLesson(classId: string) {
    return fetcher(`class-teaching-progress/get-lesson/${classId}`)
  }

  static getListSection(
    classId: string,
    scheduleId: string,
    params?: Record<string, any>,
  ) {
    return fetcher(
      `class-teaching-progress/${classId}/get-course-section/${scheduleId}`,
      {
        params,
      },
    )
  }
  static createProgress(data: IRequestCreateProgress) {
    return fetcher(`class-teaching-progress`, { method: 'POST', data: data })
  }

  static updateProgress(id: string, data: IRequestCreateProgress) {
    return fetcher(`class-teaching-progress/${id}`, {
      method: 'PUT',
      data: data,
    })
  }
}
