import axios from 'axios'
import { IResponse } from 'src/redux/types'
import { apiURL, httpService } from '../../../httpService'
import url from './url'

const CourseTestApi = {
  getQuestionCaseStudiesById: async (
    id: string,
    page_index: number,
    page_size: number,
  ): Promise<IResponse<any>> => {
    const uri = url.getCaseStudyQuizes + `/${id}` + '/shuffle'
    const response = await httpService.GET<any, any>({
      uri,
      params: {
        page_index,
        page_size,
      },
    })
    return response
  },
  createTopicAttempt: async (
    quiz_id: string,
    question_topic_id: string,
    class_user_id?: string,
  ): Promise<IResponse<any>> => {
    const uri = url.createTopicAttempt
    const response = await httpService.POST<any, any>({
      uri,
      request: {
        quiz_id,
        question_topic_id,
        class_user_id,
      },
    })
    return response
  },
  getQuestionCaseStudiesByIdServerSide: async (
    id: string,
    accessToken: string,
    page_index: number,
    page_size: number,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getCaseStudyQuizes}/${id}/shuffle`,
      {
        headers,
        params: {
          page_index,
          page_size,
        },
      },
    )
    return response?.data?.data
  },
  getQuestionsDetailServerSide: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getQuestionDetail}`,
      {
        headers,
        params: {
          question_ids: id,
        },
      },
    )
    return response.data?.data
  },
  getTopicDescriptionServerSide: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      apiURL + url.getTopicDescription + `/${id}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
  getQuizDetail: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getQuestionTabs + `/${id}`
    const response = await httpService.GET<any, any>({
      uri,
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
  submitQuestion: async (id: string, data: any): Promise<IResponse<any>> => {
    const uri = url.submitQuestion + `/${id}` + '/submit'
    const response = await httpService.POST<any, any>({
      uri,
      request: data,
    })
    return response
  },
  submitCaseStudy: async (id: string, data: any): Promise<IResponse<any>> => {
    const uri = url.submitCaseStudy + `/${id}` + '/submit'
    const response = await httpService.POST<any, any>({
      uri,
      request: data,
    })
    return response
  },
  getResource: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getResource + `/${id}`
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
  getQuizAttemptsTable: async (
    id: string,
    page_index: number,
    page_size: number,
  ): Promise<IResponse<any>> => {
    const uri =
      url.getQuizAttemptsTable +
      `/${id}?page_index=${page_index}&page_size=${page_size}`
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
  getCaseStudyAttemptsTable: async (
    id: string,
    page_index: number,
    page_size: number,
  ): Promise<IResponse<any>> => {
    const uri =
      url.getCaseStudyAttmptsTable +
      `/${id}?page_index=${page_index}&page_size=${page_size}`
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
  getTopicAttemptsDetail: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getTopicAttemptDetail + `${id}/score`
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
  getQuizAttempts: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getQuizAttempts}/${id}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
  getQuizAttemptsChartData: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getQuizAttemptsChartData}/${id}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
  getAnswerData: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}/${url.getAnswer}/${id}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
}

export default CourseTestApi
