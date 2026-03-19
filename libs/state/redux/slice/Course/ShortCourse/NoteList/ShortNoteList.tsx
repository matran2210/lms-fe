import { createSlice } from '@reduxjs/toolkit'

// Tạo một đối tượng Notification với giá trị mặc định
export interface NotesListState3Level {
  status: boolean
  note_data: any[]
}

const initialState: NotesListState3Level = {
  status: false,
  note_data: [],
}

export const shortNotesListSlice = createSlice({
  name: 'shortNotesListReducer',
  initialState,
  reducers: {
    activeNotesList3Level: (state) => {
      // Active khi action 'active' được gọi
      state.status = true
    },
    resetNotesList3Level: (state) => {
      // Đặt giá trị khi action 'reset' được gọi
      state.status = false
    },
    pushNotes3Level: (state, action) => {
      // Thêm dữ liệu mới vào mảng note_data khi gọi action pushNotes
      state.note_data.push(action.payload) // Assumed action.payload is the new data to be added
    },
    closeNote3Level: (state, action) => {
      const indexToDelete = action.payload

      // Filter out the note with the matching index or ID
      const updatedNoteData = state.note_data.filter(
        (item) => item.uuid !== indexToDelete,
      )

      // Update the state with the modified note_data array
      state.note_data = updatedNoteData
    },
    clearNote3Level: () => {
      // Đặt giá trị khi action 'clearNote' được gọi
      return initialState
    },
  },
})

export const {
  activeNotesList3Level,
  resetNotesList3Level,
  pushNotes3Level,
  closeNote3Level,
  clearNote3Level,
} = shortNotesListSlice.actions
export const shortNotesListReducer = <
  T extends {
    shortNotesListReducer: NotesListState3Level;
  },
>(
  state: T,
) =>
  state.shortNotesListReducer
export default shortNotesListSlice.reducer
