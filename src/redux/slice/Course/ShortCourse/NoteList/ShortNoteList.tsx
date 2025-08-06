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

export const shortNotesListSlice = createSlice({
  name: 'shortNotesListReducer',
  initialState,
  reducers: {
    activeNotesList: (state) => {
      console.log('state', state)
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
      const indexToDelete = action.payload

      // Filter out the note with the matching index or ID
      const updatedNoteData = state.note_data.filter(
        (item) => item.uuid !== indexToDelete,
      )

      // Update the state with the modified note_data array
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
} = shortNotesListSlice.actions
export const shortNotesListReducer = (state: RootState) =>
  state.shortNotesListReducer
export default shortNotesListSlice.reducer
