import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useFeature } from "../../../contexts";
import toast from "react-hot-toast";
const { courseApi, pageLink, router } = useFeature();
export interface ActivatedCourseState {
  openActive: boolean;
  timeActive: number;
}

const initialState: ActivatedCourseState = {
  openActive: false,
  timeActive: 0,
};

export const popupSlice = createSlice({
  name: "popupActivateCourse",
  initialState,
  reducers: {
    showPopupActivatedCourse: (state, action: PayloadAction<number>) => {
      state.openActive = true;
      state.timeActive = action.payload;
    },
    hidePopupActivatedCourse: (state) => {
      state.openActive = false;
      state.timeActive = initialState.timeActive;
    },
    activeCourse: async (
      state,
      { payload: { courseType, timeActive, classId } },
    ) => {
      if (courseType === "TRIAL_COURSE") {
        localStorage.setItem("daysDifference", timeActive);
        localStorage.setItem("showPinTrial", "true");
      } else {
        localStorage.removeItem("daysDifference");
        localStorage.removeItem("showPinTrial");
      }
      try {
        const params = {
          classId: classId,
        };
        const res = (await courseApi.activeCourse(params)) as {
          success: boolean;
        };
        if (res?.success) {
          toast.success("Active thành công!");
        }
      } catch {}
    },
  },
});
export const { showPopupActivatedCourse, hidePopupActivatedCourse } =
  popupSlice.actions;
export const popupReducer = <
  T extends {
    popupActivateCourse: ActivatedCourseState;
  },
>(
  state: T,
) => state.popupActivateCourse;

export default popupSlice.reducer;
