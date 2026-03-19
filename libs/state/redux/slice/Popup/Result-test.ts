import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface ResultTestState {
  is_open: boolean;
  content: string;
}

const initialState: ResultTestState = {
  is_open: false,
  content: "",
};

export const popupSlice = createSlice({
  name: "popupReducer",
  initialState,
  reducers: {
    showPopupCompletedCourse: (state, action: PayloadAction<string>) => {
      state.is_open = true;
      state.content = action.payload;
    },
    hidePopup: (state) => {
      state.is_open = false;
    },
  },
});
export const { showPopupCompletedCourse, hidePopup } = popupSlice.actions;
export const popupReducer = <
  T extends {
    popupReducer: ResultTestState;
  },
>(
  state: T,
) => state.popupReducer;

export default popupSlice.reducer;
