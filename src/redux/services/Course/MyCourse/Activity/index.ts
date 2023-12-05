import { fetcher } from '@services/request'
import { IResponse } from 'src/redux/types'
import { IQuestion } from 'src/type/course/Question'
import { IActivity, ITab } from 'src/type/course/my-course/Activity'
import { apiURL, httpService } from '../../../httpService'
import axios from 'axios'

const CourseActivityApi = {
  getActivityById: async (
    id: string,
    accessToken: string,
  ): Promise<IActivity> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }

    const responseActivity = await axios.get<{}, IResponse<IActivity>>(
      `${apiURL}/course-sections/activity/${id}`,
      {
        headers,
      },
    )

    const responseTabs = await axios.get<{}, IResponse<{ data: ITab[] }>>(
      `${apiURL}/course-sections/activity/${id}/tabs`,
      {
        headers,
      },
    )

    if (responseActivity.data && responseTabs.data?.data?.[0]) {
      responseActivity.data.tabs = responseTabs.data.data

      const responseTab = await axios.get<{}, IResponse<{ data: ITab }>>(
        `${apiURL}/course-sections/tab/${responseTabs.data.data?.[0].id}`,
        {
          headers,
        },
      )
      if (responseTab.data) {
        responseActivity.data.tabs[0] = responseTab.data.data
      }
    }
    return responseActivity.data
  },
  getCourseActivityTapById: async (id: string): Promise<IResponse<ITab>> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/tab/${id}`,
    })
    return response
  },
  getQuestions: async (
    id: string,
  ): Promise<IResponse<{ questions: IQuestion[] }>> => {
    const response = await httpService.GET<any, any>({
      uri: `quiz/${id}/questions?page_index=1&page_size=99999 `,
    })
    return response
  },
  getQuestionResults: async (id: string): Promise<IResponse<IQuestion[]>> => {
    const response = await httpService.GET<any, any>({
      uri: `question/results?question_ids=${id}`,
    })
    return response
  },
}

export default CourseActivityApi
