import { Slice, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FieldValues } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { RootState } from 'src/redux/store'
import { IQuestion } from 'src/type/course/Question'

/**
 * Interface mô tả thông tin về câu hỏi trong trạng thái Redux.
 * @interface
 */
export interface IActivityStateQuestion extends IQuestion {
  confirmed?: boolean
  myAnswers?: any
  corrects?: any
  quiz_position_mapping?: any
  defaultValue?: any
}

/**
 * Interface mô tả trạng thái của một bài kiểm tra trong Redux.
 * @interface
 */
interface QuizState {
  questions: IActivityStateQuestion[]
}

/**
 * Interface mô tả trạng thái của một tab trong Redux.
 * @interface
 */
interface TabState {
  [tabId: string]: {
    [quizId: string]: QuizState
  }
}

/**
 * Interface mô tả trạng thái tổng cảu hoạt động của bài kiểm tra trong Redux.
 * @interface
 */
export interface ActivityQuizRootState {
  [activityId: string]: TabState
}

/**
 * Async thunk để fetch thông tin câu hỏi dựa trên ID.
 * @type {AsyncThunk}
 */
const fetchQuestionById = createAsyncThunk(
  'quiz/fetchQuestionById',
  async (
    {
      activityId,
      tabId,
      quizId,
      questionId,
    }: {
      activityId: string
      tabId: string
      quizId: string
      questionId: string
    },
    { rejectWithValue, getState },
  ) => {
    const state = getState() as {
      courseActivityQuizReducer: ActivityQuizRootState
    }

    const existingQuestion = (
      state['courseActivityQuizReducer']?.[activityId]?.[tabId]?.[quizId]
        ?.questions || []
    ).find((question: IActivityStateQuestion) => question.id === questionId)

    const result = {
      activityId,
      tabId,
      quizId,
    }

    if (existingQuestion) {
      return { ...result, question: existingQuestion }
    }

    try {
      const response = await CourseActivityApi.getQuestionsById([questionId])
      if (response.success) {
        // Đảm bảo đối tượng trả về khớp với kiểu hành động đã được fulfill dự kiến
        return { ...result, question: response.data?.[0] }
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

/**
 * Async thunk để xác nhận một câu hỏi trong bài kiểm tra.
 * @type {AsyncThunk}
 */
const confirmQuestion = createAsyncThunk(
  'quiz/confirmQuestion',
  async (
    {
      activityId,
      tabId,
      quizId,
      questionId,
      myAnswers,
    }: {
      activityId: string
      tabId: string
      quizId: string
      questionId: string
      myAnswers: FieldValues
    },
    { rejectWithValue },
  ) => {
    try {
      const result = {
        activityId,
        tabId,
        quizId,
        myAnswers,
      }
      const question = await CourseActivityApi.getQuestionResults(questionId)
      if (question?.data?.[0]) {
        return { ...result, question: question.data[0] }
      }
      // Thêm logic để xác nhận câu hỏi
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

/**
 * Async thunk để xác nhận một câu hỏi trong bài kiểm tra.
 * @type {AsyncThunk}
 */
const submitQuestion = createAsyncThunk(
  'quiz/submitQuestion',
  async (
    {
      id,
      data,
    }: { id: string; data: { answers: any[]; quiz_position_mapping: any } },

    { rejectWithValue },
  ) => {
    try {
      const result = await CourseActivityApi.submitQuiz(id, {
        ...data,
        answers: data.answers?.filter((obj) => {
          const keys = Object.keys(obj)
          return !(keys.length === 1 && keys[0] === 'question_answer_id')
        }),
      })
      if (result.success) {
        return { ...result }
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

/**
 * Selector để lấy ra danh sách câu hỏi từ Redux state.
 * @function
 * @param {ActivityQuizRootState} state - Trạng thái toàn bộ Redux store.
 * @param {string} activityId - ID của hoạt động.
 * @param {string} tabId - ID của tab.
 * @param {string} quizId - ID của bài kiểm tra.
 * @returns {IActivityStateQuestion[]} - Danh sách câu hỏi.
 */
export const selectQuestions = (
  state: ActivityQuizRootState,
  activityId: string,
  tabId: string,
  quizId: string,
): IActivityStateQuestion[] | undefined => {
  return state?.[activityId]?.[tabId]?.[quizId]?.questions
}

/**
 * Redux slice để xử lý các câu hỏi trong Redux store.
 * @type {Slice}
 */
const quizSlice: Slice = createSlice({
  name: 'quiz',
  initialState: {} as ActivityQuizRootState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchQuestionById.fulfilled,
        /**
         * Reducer cho trường hợp câu hỏi đã được fetch thành công.
         * @param {ActivityQuizRootState} state - Trạng thái Redux hiện tại.
         * @param {ReturnType<typeof fetchQuestionById.fulfilled>} action - Hành động được kích hoạt khi fetch thành công.
         */
        (state, action) => {
          const { activityId, tabId, quizId, question } =
            action.payload as unknown as {
              activityId: string
              tabId: string
              quizId: string
              question: IActivityStateQuestion
            }

          state[activityId] = state[activityId] || {}
          state[activityId][tabId] = state[activityId][tabId] || {}
          state[activityId][tabId][quizId] = state[activityId][tabId][
            quizId
          ] || {
            questions: [],
          }

          const existingQuestion = state[activityId][tabId][
            quizId
          ].questions.find((q) => q.id === question.id)

          if (!existingQuestion) {
            state[activityId][tabId][quizId].questions.push(question)
          }
        },
      )

      .addCase(
        confirmQuestion.fulfilled,
        /**
         * Reducer cho trường hợp câu hỏi đã được xác nhận thành công.
         * @param {ActivityQuizRootState} state - Trạng thái Redux hiện tại.
         * @param {ReturnType<typeof confirmQuestion.fulfilled>} action - Hành động được kích hoạt khi xác nhận thành công.
         */
        (
          state: ActivityQuizRootState,
          action: ReturnType<typeof confirmQuestion.fulfilled>,
        ) => {
          // Sử dụng action.payload để lấy kết quả của hàm thunk
          const payload = action.payload as unknown as {
            activityId: string
            tabId: string
            quizId: string
            question: IActivityStateQuestion
            myAnswers: any
          }
          const questions =
            state[payload.activityId]?.[payload.tabId]?.[payload.quizId]
              ?.questions

          if (questions) {
            const questionToUpdate = questions.find(
              (question) => question.id === payload.question.id,
            )

            if (questionToUpdate) {
              questionToUpdate.confirmed = true
              questionToUpdate.solution = payload.question.solution
              questionToUpdate.defaultValue = payload.myAnswers

              switch (payload.question.qType as QUESTION_TYPES) {
                case QUESTION_TYPES.ONE_CHOICE:
                case QUESTION_TYPES.TRUE_FALSE:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      question_answer_id: payload.myAnswers,
                    },
                  ]

                  questionToUpdate.corrects = Object.fromEntries(
                    (payload.question.answers || []).map((originalAnswer) => [
                      originalAnswer.id,
                      originalAnswer.is_correct,
                    ]),
                  )

                  break

                case QUESTION_TYPES.MULTIPLE_CHOICE:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      answer: payload.myAnswers?.map((e: string) => ({
                        answer_id: e,
                      })),
                    },
                  ]

                  questionToUpdate.corrects = Object.fromEntries(
                    (payload.question.answers || []).map((originalAnswer) => [
                      originalAnswer.id,
                      originalAnswer.is_correct,
                    ]),
                  )
                  break

                case QUESTION_TYPES.FILL_WORD:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      answer: payload.myAnswers?.map(
                        (e: string, i: number) => ({
                          answer_text: e,
                          answer_position: i + 1,
                        }),
                      ),
                    },
                  ]
                  questionToUpdate.corrects = payload.question.answers
                  break

                case QUESTION_TYPES.SELECT_WORD:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      answer: payload.myAnswers?.map(
                        (e: string, i: number) => ({
                          answer_id: e,
                          answer_position: i + 1,
                        }),
                      ),
                    },
                  ]
                  questionToUpdate.corrects = payload.question.answers
                  break

                case QUESTION_TYPES.MATCHING:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      answer: payload.myAnswers?.map(
                        (e: { question_id: string; answer_id: string }) => ({
                          question_id: e.question_id,
                          answer_id: e.answer_id,
                        }),
                      ),
                    },
                  ]
                  questionToUpdate.corrects =
                    payload.question.question_matchings
                  break

                case QUESTION_TYPES.DRAG_DROP:
                  questionToUpdate.myAnswers = [
                    ...(questionToUpdate.myAnswers || []),
                    {
                      question_id: payload.question.id,
                      answer: payload.myAnswers?.map((e: any, i: number) => ({
                        answer_id: e.idAnswer,
                        answer_position: i + 1,
                      })),
                    },
                  ]
                  questionToUpdate.quiz_position_mapping = [
                    ...(questionToUpdate.quiz_position_mapping || []),
                    {
                      question_id: payload.question.id,
                      answers: payload.question.answers?.map((e) => {
                        return {
                          answer_id: e.id,
                          answer_position: e.answer_position,
                        }
                      }),
                    },
                  ]

                  questionToUpdate.corrects = payload.question.answers
                  break
                default:
                  break
              }
            }
          }
        },
      )

    builder.addCase(submitQuestion.pending, (state) => {
      // state.loading = true
    })
    builder.addCase(submitQuestion.fulfilled, (state, action) => {
      // state.loading = false
      return state
    })
    builder.addCase(submitQuestion.rejected, (state) => {
      // state.loading = false
    })
  },
})

export default quizSlice.reducer

/**
 * Selector để lấy trạng thái `courseActivityQuizReducer` từ Redux store.
 * @function
 * @param {RootState} state - Trạng thái toàn bộ Redux store.
 * @returns {ActivityQuizRootState} - Trạng thái của `courseActivityQuizReducer`.
 */
export const courseActivityQuizReducer = (state: RootState) =>
  state.courseActivityQuizReducer

export { confirmQuestion, fetchQuestionById, submitQuestion }
