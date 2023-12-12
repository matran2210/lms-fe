import axios from 'axios'
import { IResponse } from 'src/redux/types'
import { apiURL, httpService } from '../../../httpService'
import url from './url'

const CourseTestApi = {
  getQuestionTabsById: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getQuestionTabs}/${id}/shuffle`,
      {
        headers,
      },
    )
    return response.data?.data
  },
  getQuestionsDetail: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getQuestionDetail
    const response = await httpService.GET<any, any>({
      uri,
      params: {
        question_ids: id,
      },
    })
    return response
  },
  getQuestionAnswer: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getQuestionResult
    const response = await httpService.GET<any, any>({
      uri,
      params: {
        question_ids: id,
      },
    })
    return response
  },
}

export default CourseTestApi
