import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IClassForActivation,
  ICourse,
  IResponse,
  ISubjectByProgram,
  ISubjectWaitingActivation,
} from '@lms/core'
import { fetcher } from '@services/requestV2'

export class CoursesActivationAPI {
  static get(
    params: Record<string, any>,
    page_index: number = DEFAULT_PAGE_NUMBER,
    page_size: number = DEFAULT_PAGE_SIZE,
  ): Promise<IResponse<ISubjectWaitingActivation[]>> {
    return fetcher(
      `course-activations/subjects-waiting-activation?page_index=${page_index}&page_size=${page_size}`,
      {
        params,
      },
    )
  }

  static getSubjectByProgram(
    program_name: string | null | undefined,
  ): Promise<IResponse<ISubjectByProgram[]>> {
    return fetcher(`subjects/program-name?program_name=${program_name}`)
  }

  static getSubjectClassForActivateSubject(
    subject_id: string,
  ): Promise<IResponse<IClassForActivation[]>> {
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
