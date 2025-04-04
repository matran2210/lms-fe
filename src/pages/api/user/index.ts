import { UserExamInformation } from '@components/profile/ExamInformation/type'
import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class UserApi {
  static getExamination(
    page_index: number,
    page_size: number,
  ): Promise<UserExamInformation> {
    return fetcher(
      `${apiURL}/users/examination?page_index=${page_index}&page_size=${page_size}`,
    )
  }

  static getUserPrograms(course_category_id: string | undefined): Promise<any> {
    return fetcher(`users/programs?course_category_id=${course_category_id}`)
  }
}
