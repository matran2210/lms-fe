import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { RootState } from 'src/redux/store'
import { IActivity } from 'src/type/course/my-course/Activity'

// Tạo một đối tượng activity với giá trị mặc định
export interface ICourseActivityState extends IActivity {
  loading: boolean
  currentTabId?: string
}

const initialState: ICourseActivityState = {
  loading: false,
  currentTabId: '',

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
  course_section_type: '',
  activity_type: '',
  position: '',
  parent_id: '',
  display_icon: '',
  course_outcomes: [] as any[],
  course_learning_outcome: {
    id: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    name: '',
    description: '',
  },
  files: [] as any[],
}

export const getCourseActivityTapById = createAsyncThunk(
  'courseActivityReducer/getTapById',
  async ({ id }: { id: string }, thunkAPI) => {
    try {
      const res = await CourseActivityApi.getCourseActivityTapById(id)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const courseActivitySlice = createSlice({
  name: 'courseActivityReducer',
  initialState,
  reducers: {
    setActivityState: (state, action: PayloadAction<IActivity>) => {
      return {
        ...state,
        ...action.payload,
        currentTabId: action.payload?.tabs?.[0]?.id,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCourseActivityTapById.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCourseActivityTapById.fulfilled, (state, action) => {
      return (state = {
        ...state,
        loading: false,
        currentTabId: action.payload?.id,
        tabs: state.tabs?.map((e) => {
          if (e.id === action.payload?.id) {
            return action.payload
          }
          return e
        }),
      })
    })
    builder.addCase(getCourseActivityTapById.rejected, (state) => {
      state.loading = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const courseActivityReducer = (state: RootState) =>
  state.courseActivityReducer

export const courseActivityAction = courseActivitySlice.actions

export default courseActivitySlice.reducer
