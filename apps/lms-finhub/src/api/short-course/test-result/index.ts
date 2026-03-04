import { fetcher } from '@services/request'
import { IScoreDetails, QuizAttemptChart, IQuizAttempt } from '@lms/core'
import url from 'src/redux/services/Course/MyCourse/Test/url'

export class ResultAPI {
  static getQuizAttemptsTable(
    id: string,
    { page_index, page_size }: { page_index: number; page_size: number },
  ): Promise<{
    success: boolean
    data: IScoreDetails
  }> {
    return fetcher(`/quiz-attempts/${id}/answers`, {
      params: {
        page_index: page_index || 1,
        page_size: page_size || 10,
      },
    })
  }

  static getQuizAttemptsChartData(
    id: string | string[] | undefined,
  ): Promise<{ success: boolean; data: QuizAttemptChart }> {
    return fetcher(`${url.getQuizAttemptsChartData}/${id}`)
  }

  static getQuizAttempts(
    id: string | string[] | undefined,
  ): Promise<IQuizAttempt> {
    return fetcher(`${url.getQuizAttempts}/${id}`)
  }
}
