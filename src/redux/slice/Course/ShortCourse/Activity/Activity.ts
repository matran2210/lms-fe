import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'
import {
  IActivity,
  IBreadcrumb,
  ICourseOutcomes,
  IFile,
  ICourseTabDocument,
} from 'src/type/courses-3-level'
import { CoursesAPI } from '../../../../../pages/api/courses/index'

// Tạo một đối tượng activity với giá trị mặc định
export interface ICourseActivityState extends IActivity {
  loading: boolean
  currentTabId?: string
  calculator_status?: boolean
}

const initialState: ICourseActivityState = {
  loading: false,
  currentTabId: '',
  calculator_status: false,
  id: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
  course_id: '',
  name: '',
  code: '',
  description: '',
  status: '',
  is_public: false,
  duration: 0,
  is_peer_review: false,
  is_graded: false,
  course_section_type: 'ACTIVITY',
  course_section_notes: [],
  activity_type: '',
  position: '',
  parent_id: '',
  display_icon: 'TEXT',
  total_activity: 0,
  course_outcomes: [] as ICourseOutcomes[],
  files: [] as IFile[],
  breadcumb: [] as IBreadcrumb[],
  user_course_section_progress: [],
  activity_count: 0,
  learning_progress: {
    duration: 0,
    time_spent: 0,
    total_course_sections: 0,
    total_course_sections_completed: 0,
  },
  type: 'text',
  quiz: {
    id: '',
    attempt: [],
    quiz_timed: 0,
    required_percent_score: 0,
    is_limited: false,
    limit_count: 0,
    grading_method: '',
    is_graded: false,
  },
  course_tab_documents: [],
  next_activity: {
    id: '',
    display_icon: '',
    name: '',
  },
  previous_activity: {
    id: '',
    display_icon: '',
    name: '',
  },
}

export const getCourseActivityTapById = createAsyncThunk(
  'shortCourseActivityReducer/getTapById',
  async ({ courseId, id }: { courseId: string; id: string }, thunkAPI) => {
    try {
      const res = await CoursesAPI.getCourseActivityTapById(courseId, id)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const courseActivitySlice = createSlice({
  name: 'shortCourseActivityReducer',
  initialState,
  reducers: {
    setActivityState: (state, action: PayloadAction<IActivity>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    resetActivity: () => {
      return {
        ...initialState,
      }
    },
    openCalculator: (state) => {
      state.calculator_status = true
    },
    closeCalculator: (state) => {
      state.calculator_status = false
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCourseActivityTapById.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCourseActivityTapById.fulfilled, (state, action) => {
      state.loading = false
      state.currentTabId = action.payload?.id
    })
    builder.addCase(getCourseActivityTapById.rejected, (state) => {
      state.loading = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const shortCourseActivityReducer = (state: RootState) =>
  state.shortCourseActivityReducer

export const courseActivityAction = courseActivitySlice.actions
export const { openCalculator, closeCalculator } = courseActivitySlice.actions

export default courseActivitySlice.reducer
