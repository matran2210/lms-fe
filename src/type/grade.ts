export interface IQuizAttemptInfo {
  gradeId: string
  quizName: string
  multipleChoiceScores: number
  essayScores?: number
  comment?: string | null
  recommendation?: string | null
  status?: string
}
