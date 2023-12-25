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
  getDetailQuizById: async (
    id: string,
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getQuestionTabs}/${id}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
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
  getTopicDescription: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getTopicDescription + `/${id}`
    const response = await httpService.GET<any, any>({
      uri,
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
  createQuizAttempt: async (id: string): Promise<IResponse<any>> => {
    const uri = url.createQuizAttemp
    const response = await httpService.POST<any, any>({
      uri,
      request: {
        quiz_id: id,
      },
    })
    return response
  },
}

export default CourseTestApi
