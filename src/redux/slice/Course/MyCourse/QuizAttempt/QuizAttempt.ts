import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface quizAttemptIdType {
  quizAttempt: {
    id: string
    number_of_attempts: number
    is_limited: boolean
    quiz_timed?: number
    created_at?: string
  }
}

const initialState: quizAttemptIdType = {
  quizAttempt: {
    id: '',
    number_of_attempts: 0,
    is_limited: false,
    quiz_timed: 0,
    created_at: '',
  },
}

export const quizAttempt = createSlice({
  name: 'quizAttemptReducer',
  initialState,
  reducers: {
    setQuizAttempt: (state, action) => {
      state.quizAttempt = action.payload
    },
  },
})

export const { setQuizAttempt } = quizAttempt.actions
export default quizAttempt.reducer
