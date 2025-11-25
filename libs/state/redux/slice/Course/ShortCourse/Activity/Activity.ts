import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IActivity3Level, IBreadcrumb, ICourseOutcomes, ICoursesAPI } from '@lms/core';
import { RootState } from "../../../../store";

// Tạo một đối tượng activity với giá trị mặc định
export interface ICourseActivityState3Level extends IActivity3Level {
  loading: boolean;
  currentTabId?: string;
  calculator_status?: boolean;
}

const initialState: ICourseActivityState3Level = {
  loading: false,
  currentTabId: "",
  calculator_status: false,
  id: "",
  created_at: "",
  updated_at: "",
  deleted_at: null,
  course_id: "",
  name: "",
  code: "",
  description: "",
  status: "",
  is_public: false,
  duration: 0,
  is_peer_review: false,
  is_graded: false,
  course_section_type: "ACTIVITY",
  course_section_notes: [],
  activity_type: "",
  position: "",
  parent_id: "",
  display_icon: "TEXT",
  total_activity: 0,
  course_outcomes: [] as ICourseOutcomes[],
  files: [] as File[],
  breadcumb: [] as IBreadcrumb[],
  user_course_section_progress: [],
  activity_count: 0,
  learning_progress: {
    duration: 0,
    time_spent: 0,
    total_course_sections: 0,
    total_course_sections_completed: 0,
  },
  type: "text",
  quiz: {
    id: "",
    attempt: [],
    quiz_timed: 0,
    required_percent_score: 0,
    is_limited: false,
    limit_count: 0,
    grading_method: "",
    is_graded: false,
  },
  course_tab_documents: [],
  next_activity: {
    id: "",
    display_icon: "",
    name: "",
    is_preview_locked: false,
  },
  previous_activity: {
    id: "",
    display_icon: "",
    name: "",
    is_preview_locked: false,
  },
  course_section_link_parents: [],
  children: [],
  section_root: {
    id: "",
    name: "",
  },
  course: {
    name: "",
  },
};

export const getCourseActivityTapById3Level = createAsyncThunk(
  'shortCourseActivityReducer/getTapById',
  async ({courseApi, courseId, id }: { courseApi: ICoursesAPI; courseId: string; id: string }, thunkAPI) => {
    try {
      const res = await courseApi.getCourseActivityTapById(courseId, id);
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const courseActivitySlice3Level = createSlice({
  name: "shortCourseActivityReducer",
  initialState,
  reducers: {
    setActivityState3Level: (state, action: PayloadAction<IActivity3Level>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetActivity3Level: () => {
      return {
        ...initialState,
      };
    },
    openCalculator3Level: (state) => {
      state.calculator_status = true;
    },
    closeCalculator3Level: (state) => {
      state.calculator_status = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCourseActivityTapById3Level.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCourseActivityTapById3Level.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTabId = action.payload?.id;
    });
    builder.addCase(getCourseActivityTapById3Level.rejected, (state) => {
      state.loading = false;
    });
  },
});

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const shortCourseActivityReducer = (state: RootState) =>
  state.shortCourseActivityReducer

export const courseActivityAction3Level = courseActivitySlice3Level.actions;
export const { openCalculator3Level, closeCalculator3Level } =
  courseActivitySlice3Level.actions;

export default courseActivitySlice3Level.reducer;
