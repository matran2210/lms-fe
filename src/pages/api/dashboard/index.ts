import { fetcher } from '@services/requestV2'

export class DashboardAPI {
  static getOverProgress(id: string): Promise<any> {
    return fetcher(`report/${id}/overall`)
  }

  static getTopicProgress(id: string): Promise<any> {
    return fetcher(`report/${id}/topic`)
  }

  static getWeeklyReport(id: string): Promise<any> {
    return fetcher(`report/${id}/weekly`)
  }

  static getLearningResults(id: string): Promise<any> {
    return fetcher(`report/${id}/learning-result`)
  }
}
