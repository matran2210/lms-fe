import axios from 'axios'
import { IResponse } from 'src/redux/types'
import { apiURL, httpService } from '../../../httpService'
import url from './url'

const CourseTestApi = {
  // getQuestionCaseStudiesById: async (
  //   id: string,
  //   page_index: number,
  //   page_size: number,
  // ): Promise<IResponse<any>> => {
  //   const uri = url.getCaseStudyQuizes + `/${id}` + '/shuffle'
  //   const response = await httpService.GET<any, any>({
  //     uri,
  //     params: {
  //       page_index,
  //       page_size,
  //     },
  //   })
  //   return response
  // },
  // getQuestionCaseStudiesByIdServerSide: async (
  //   id: string,
  //   accessToken: string,
  //   page_index: number,
  //   page_size: number,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     `${apiURL}${url.getCaseStudyQuizes}/${id}/shuffle`,
  //     {
  //       headers,
  //       params: {
  //         page_index,
  //         page_size,
  //       },
  //     },
  //   )
  //   return response?.data?.data
  // },
  // getQuestionsDetailServerSide: async (
  //   id: string,
  //   accessToken: string,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     `${apiURL}${url.getQuestionDetail}`,
  //     {
  //       headers,
  //       params: {
  //         question_ids: id,
  //       },
  //     },
  //   )
  //   return response.data?.data
  // },
  // getTopicDescriptionServerSide: async (
  //   id: string,
  //   accessToken: string,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     apiURL + url.getTopicDescription + `/${id}`,
  //     {
  //       headers,
  //     },
  //   )
  //   return response.data?.data
  // },
  // getQuizDetail: async (id: string): Promise<IResponse<any>> => {
  //   const uri = url.getQuestionTabs + `/${id}`
  //   const response = await httpService.GET<any, any>({
  //     uri,
  //   })
  //   return response
  // },
  // getQuizAttempts: async (
  //   id: string,
  //   accessToken: string,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     `${apiURL}${url.getQuizAttempts}/${id}`,
  //     {
  //       headers,
  //     },
  //   )
  //   return response.data?.data
  // },
  // getQuizAttemptsChartData: async (
  //   id: string,
  //   accessToken: string,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     `${apiURL}${url.getQuizAttemptsChartData}/${id}`,
  //     {
  //       headers,
  //     },
  //   )
  //   return response.data?.data
  // },
  // getAnswerData: async (
  //   id: string,
  //   accessToken: string,
  // ): Promise<IResponse<any>> => {
  //   const headers = {
  //     Authorization: 'Bearer ' + accessToken,
  //   }
  //   const response = await axios.get<{}, IResponse<{ data: any }>>(
  //     `${apiURL}/${url.getAnswer}/${id}`,
  //     {
  //       headers,
  //     },
  //   )
  //   return response.data?.data
  // },
  getResource: async (id: string): Promise<IResponse<any>> => {
    const uri = url.getResource + `/${id}`
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
}

export default CourseTestApi
