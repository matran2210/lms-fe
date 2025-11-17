import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import {
  IWeeklyReport,
  IOverProgress,
  ILearningResult,
  ITopicProgress,
  IExamPrediction,
  IMockTestResult,
} from '@lms/core'

export class DashboardAPI {
  static getOverProgress(id: string): Promise<IResponse<IOverProgress>> {
    return fetcher(`report/${id}/overall`)
  }

  static getTopicProgress(id: string): Promise<IResponse<ITopicProgress[]>> {
    return fetcher(`report/${id}/topic`)
  }

  static getWeeklyReport(id: string): Promise<IResponse<IWeeklyReport>> {
    return fetcher(`report/${id}/weekly`)
  }

  static getLearningResults(id: string): Promise<IResponse<ILearningResult[]>> {
    return fetcher(`report/${id}/learning-result`)
  }

  static getMockTestResults(id: string): Promise<IResponse<IMockTestResult>> {
    return fetcher(`report/${id}/mock-test-result`)
  }

  static getExamPrediction(id: string): Promise<IResponse<IExamPrediction>> {
    return fetcher(`report/${id}/exam-prediction`)
  }
}
