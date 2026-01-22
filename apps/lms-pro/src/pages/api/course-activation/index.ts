import { fetcher } from '@services/requestV2'

export class CoursesActivationAPI {
  static get(
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `course-activations/subjects-waiting-activation?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getSubjectByProgram(
    program_name: string | null | undefined,
  ): Promise<any> {
    return fetcher(`subjects/program-name?program_name=${program_name}`)
  }
}
