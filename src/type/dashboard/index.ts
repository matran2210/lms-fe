interface IReport {
  completed_activities: number
  total_learning_time: number
}

export interface IOverProgress {
  completed_activities: number
  uncompleted_activities: number
  total_activities: number
}

export interface IWeeklyReport {
  last_week: IReport
  current_week: IReport
}

export interface ITopicProgress {
  id: string
  name: string
  short_name: string
  completed_activities: number
  total_activities: number
}

export interface ILearningResult {
  id: string
  name: string
  short_name: string
  score: number
}
