import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface NotesListState {
  status: boolean
}

const initialState: NotesListState = {
  status: false,
}

export const notesListSlice = createSlice({
  name: 'notesListReducer',
  initialState,
  reducers: {
    activeNotesList: (state) => {
      // Active khi action 'active' được gọi
      state.status = true
    },
    resetNotesList: () => {
      // Đặt giá trị khi action 'reset' được gọi
      return initialState
    },
  },
})

export const { activeNotesList, resetNotesList } = notesListSlice.actions
export const notesListReducer = (state: RootState) => state.notesListReducer
export default notesListSlice.reducer
