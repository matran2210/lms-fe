import { fetcher } from '@services/request'
import { IResponse } from 'src/redux/types'
import { IQuestion } from 'src/type/course/Question'
import { IActivity, ITab } from 'src/type/course/my-course/Activity'
import { httpService } from '../../../httpService'

const CourseActivityApi = {
  getActivityById: async (
    id: string,
    accessToken: string,
  ): Promise<IActivity> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const responseActivity = await fetcher<IResponse<IActivity>>(
      `course-sections/activity/${id}`,
      {
        headers,
      },
    )
    const responseTabs = await fetcher<IResponse<ITab[]>>(
      `course-sections/activity/${id}/tabs`,
      {
        headers,
      },
    )
    if (responseActivity.data && responseTabs.data?.[0]) {
      responseActivity.data.tabs = responseTabs.data

      const responseTab = await fetcher<IResponse<ITab>>(
        `course-sections/tab/${responseTabs.data?.[0].id}`,
        {
          headers,
        },
      )
      if (responseTab.data) {
        responseActivity.data.tabs[0] = responseTab.data
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
  getQuizById: async (id: string): Promise<IResponse<IQuestion>> => {
    const response = await httpService.GET<any, any>({ uri: `question/${id}` })
    return response
  },
}

export default CourseActivityApi
