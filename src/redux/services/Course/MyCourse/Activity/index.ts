import axios from 'axios'
import { IResponse, IResponseMeta } from 'src/redux/types'
import {
  ICreateDiscussionRepReact,
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IQuestion } from 'src/type/course/Question'
import { IActivity, ITab } from 'src/type/course/my-course/Activity'
import { apiURL, httpService } from '../../../httpService'
import url from './url'

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
  getDiscussion: async (
    id: string,
  ): Promise<IResponseMeta<IDiscussion, 'discussions'>> => {
    const uri = url.createDiscussion + `/${id}`
    const response = await httpService.GET<
      {},
      IResponseMeta<IDiscussion, 'discussions'>
    >({
      uri,
      params: {
        page_index: 1,
        page_size: 9999,
      },
    })
    return response
  },
  createDiscussion: async (
    request: ICreateDiscussionRequest,
  ): Promise<IResponse<IDiscussion>> => {
    const uri = url.createDiscussion
    const response = await httpService.POST<
      ICreateDiscussionRequest,
      IResponse<IDiscussion>
    >({
      uri, // Add a comma here
      request, // Assuming data is the request payload
    })
    return response
  },
  reactDiscussion: async (
    request: ICreateDiscussionResReact,
  ): Promise<IResponse<ICreateDiscussionRepReact>> => {
    const uri = url.reactDiscussion
    const response = await httpService.POST<
      ICreateDiscussionResReact,
      IResponse<ICreateDiscussionRepReact>
    >({
      uri, // Add a comma here
      request, // Assuming data is the request payload
    })
    return response
  },
}

export default CourseActivityApi
