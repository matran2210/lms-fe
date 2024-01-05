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

      // Tạo một bản sao của mảng note_data và loại bỏ phần tử tại chỉ mục indexToDelete
      const updatedNoteData = state.note_data.filter(
        (item, index) => index !== indexToDelete,
      )

      // Trả về một phiên bản mới của state với mảng note_data đã được cập nhật
      state.note_data = updatedNoteData
    },
    clearNote: () => {
      // Đặt giá trị khi action 'clearNote' được gọi
      return initialState
    },
  },
})

export const {
  activeNotesList,
  resetNotesList,
  pushNotes,
  closeNote,
  clearNote,
} = notesListSlice.actions
export const notesListReducer = (state: RootState) => state.notesListReducer
export default notesListSlice.reducer
