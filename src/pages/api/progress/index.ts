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
    return fetcher(`class_teaching_progress`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...params,
      },
    })
  }

  static getProgressDetail(id: string): Promise<any> {
    return fetcher(`class_teaching_progress/${id}`)
  }

  static getListLesson(classId: string): Promise<IResponse<any>> {
    return fetcher(`class_teaching_progress/get-lesson/${classId}`)
  }

  static getListSection(
    classId: string,
    scheduleId: string,
  ): Promise<IResponse<any>> {
    return fetcher(
      `class_teaching_progress/get-course-section/${classId}/${scheduleId}`,
    )
  }
  static createProgress(data: IRequestCreateProgress): Promise<IResponse<any>> {
    return fetcher(`class_teaching_progress`, { method: 'POST', data: data })
  }

  static updateProgress(
    id: string,
    data: IRequestCreateProgress,
  ): Promise<IResponse<any>> {
    return fetcher(`class_teaching_progress/${id}`, {
      method: 'PUT',
      data: data,
    })
  }
}
