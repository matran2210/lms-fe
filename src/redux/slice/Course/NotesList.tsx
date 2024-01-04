import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface NotesListState {
  status: boolean
  note_data: any[]
}

const initialState: NotesListState = {
  status: false,
  note_data: [],
}

export const notesListSlice = createSlice({
  name: 'notesListReducer',
  initialState,
  reducers: {
    activeNotesList: (state) => {
      // Active khi action 'active' được gọi
      state.status = true
    },
    resetNotesList: (state) => {
      // Đặt giá trị khi action 'reset' được gọi
      state.status = false
    },
    pushNotes: (state, action) => {
      // Thêm dữ liệu mới vào mảng note_data khi gọi action pushNotes
      state.note_data.push(action.payload) // Assumed action.payload is the new data to be added
    },
    closeNote: (state, action) => {
      const indexToDelete = action.payload // Chỉ mục cần xóa, truyền từ payload
      // Xóa phần tử tại chỉ mục indexToDelete từ mảng note_data
      state.note_data.splice(indexToDelete, 1)
    },
  },
})

export const { activeNotesList, resetNotesList, pushNotes, closeNote } =
  notesListSlice.actions
export const notesListReducer = (state: RootState) => state.notesListReducer
export default notesListSlice.reducer
