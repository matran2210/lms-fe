import { fetcher } from '@services/requestV2'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import { apiURL } from 'src/redux/services/httpService'
import { IScoreDetails } from 'src/type'

export class TeacherAPI {
  static getListClass(
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/classes/teacher?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getClassById(id: string): Promise<any> {
    return fetcher(`${apiURL}/classes/${id}/teacher`)
  }
}
