import { ICourse, IResponse } from '@lms/core'
import { fetcher } from '@services/requestV2'

export class CoursesActivationAPI {
  static get(
    params: Object,
    page_index?: number,
    page_size?: number,
  ): Promise<IResponse<any[]>> {
    return fetcher(
      `course-activations/subjects-waiting-activation?page_index=${1}&page_size=${10}`,
      {
        params: params,
      },
    )
  }

  static getSubjectByProgram(
    program_name: string | null | undefined,
  ): Promise<IResponse<any[]>> {
    return fetcher(`subjects/program-name?program_name=${program_name}`)
  }

  static getSubjectWaitingActivation(params: {
    page_index: number
    page_size: number
    program_name?: string
    subject_name?: string
  }): Promise<IResponse<any[]>> {
    return fetcher(`course-activations/subjects-waiting-activation`, {
      params: params,
    })
  }

  static getSubjectClassForActivateSubject(
    subject_id: string,
  ): Promise<IResponse<any[]>> {
    return fetcher(`course-activations/suggest-class-for-activate-subject`, {
      params: { subject_id },
    })
  }

  static activateClass(class_id: string): Promise<IResponse<ICourse>> {
    return fetcher(`course-activations/activate-class`, {
      method: 'POST',
      data: { class_id },
    })
  }
}
