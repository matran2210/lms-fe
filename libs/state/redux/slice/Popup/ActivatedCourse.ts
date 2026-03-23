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
// ✅ TYPE DEFINITIONS
//
interface ActiveCoursePayload {
  courseType: string;
  timeActive: number;
  classId: string;
  courseApi: {
    activeCourse: (params: { classId: string }) => Promise<{ success: boolean }>;
  };
  router: {
    refresh: () => void;
    push: (path: string) => void;
  };
  pageLink: string;
}

//
// ✅ THUNK
//
export const activeCourseThunk = createAsyncThunk<
  void,
  ActiveCoursePayload
>("activateCourseReducer/activeCourse", async (payload, { rejectWithValue }) => {
  const { courseType, timeActive, classId, courseApi, router, pageLink } =
    payload;

  // ✅ handle localStorage
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
    const res = await courseApi.activeCourse({ classId });

    if (res?.success) {
      router.refresh();
    }
  } catch (error) {
    router.push(pageLink);
    return rejectWithValue(error);
  }
});

//
// ✅ SLICE
//
export const popupSlice = createSlice({
  name: "activateCourseReducer",
  initialState,
  reducers: {
    showPopupActivatedCourse: (
      state,
      { payload }: PayloadAction<{
        timeActive: number;
        classId: string;
        courseType: string;
      }>,
    ) => {
      Object.assign(state, {
        openActive: true,
        ...payload,
      });
    },

    hidePopupActivatedCourse: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(activeCourseThunk.fulfilled, (state) => {
        toast.success("Active thành công!");
        Object.assign(state, initialState);
      })
      .addCase(activeCourseThunk.rejected, (state) => {
        toast.error("Active thất bại!");
        Object.assign(state, initialState);
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
export const selectPopupActivateCourse = (state: {
  activateCourseReducer: ActivatedCourseState;
}) => state.activateCourseReducer;

//
// ✅ REDUCER
//
export default popupSlice.reducer;