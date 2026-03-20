import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface ActivatedCourseState {
  openActive: boolean;
  timeActive: number;
  classId: string;
  courseType: string;
}

const initialState: ActivatedCourseState = {
  openActive: false,
  timeActive: 0,
  classId: "",
  courseType: "",
};

//
// ✅ THUNK (xử lý async + side effects)
//
export const activeCourseThunk = createAsyncThunk(
  "popupActivateCourse/activeCourse",
  async (
    payload: {
      courseType: string;
      timeActive: number;
      classId: number;
      courseApi: any;
    },
    { rejectWithValue },
  ) => {
    const { courseType, timeActive, classId, courseApi } = payload;
    
    // ⚠️ tránh lỗi khi chạy SSR (Next.js)
    if (typeof window !== "undefined") {
      if (courseType === "TRIAL_COURSE") {
        localStorage.setItem("daysDifference", String(timeActive));
        localStorage.setItem("showPinTrial", "true");
      } else {
        localStorage.removeItem("daysDifference");
        localStorage.removeItem("showPinTrial");
      }
    }

    try {
      console.log("Activating course with classId:");
      const res = await courseApi.activeCourse({ classId });

      if (res?.success) {
        return res;
      }

      return rejectWithValue("Active failed");
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//
// ✅ SLICE
//
export const popupSlice = createSlice({
  name: "popupActivateCourse",
  initialState,
  reducers: {
    showPopupActivatedCourse: (
      state,
      action: PayloadAction<{
        timeActive: number;
        classId: string;
        courseType: string;
      }>,
    ) => {
      const { timeActive, classId, courseType } = action.payload;

      state.openActive = true;
      state.timeActive = timeActive;
      state.classId = classId;
      state.courseType = courseType;
    },

    hidePopupActivatedCourse: (state) => {
      return initialState; // 🔥 clean hơn reset từng field
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(activeCourseThunk.fulfilled, (state) => {
        toast.success("Active thành công!");
        state.openActive = false; // 👉 optional: auto close popup
      })
      .addCase(activeCourseThunk.rejected, () => {
        toast.error("Active thất bại!");
      });
  },
});

//
// ✅ ACTIONS
//
export const { showPopupActivatedCourse, hidePopupActivatedCourse } =
  popupSlice.actions;

//
// ✅ SELECTOR
//
export const selectPopupActivateCourse = <
  T extends { popupActivateCourse: ActivatedCourseState },
>(
  state: T,
) => state.popupActivateCourse;

//
// ✅ REDUCER
//
export default popupSlice.reducer;
