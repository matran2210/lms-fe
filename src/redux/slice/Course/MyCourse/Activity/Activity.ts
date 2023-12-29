import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { RootState } from 'src/redux/store'
import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IActivity } from 'src/type/course/my-course/Activity'

// Tạo một đối tượng activity với giá trị mặc định
export interface ICourseActivityState extends IActivity {
  loading: boolean
  loadingDiscussion: boolean
  currentTabId?: string
  discussion?: IDiscussion[]
}

const initialState: ICourseActivityState = {
  loading: false,
  loadingDiscussion: false,
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
  discussion: undefined,
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

export const getDiscussion = createAsyncThunk(
  'courseActivityReducer/getDiscussion',
  async ({ id, sectionId }: any, thunkAPI) => {
    try {
      const res = await CourseActivityApi.getDiscussion(id, sectionId)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const createDiscussion = createAsyncThunk(
  'courseActivityReducer/createDiscussion',
  async (data: ICreateDiscussionRequest, thunkAPI) => {
    try {
      const res = await CourseActivityApi.createDiscussion(data)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const reactDiscussion = createAsyncThunk(
  'courseActivityReducer/reactDiscussion',
  async (data: ICreateDiscussionResReact, thunkAPI) => {
    try {
      const res = await CourseActivityApi.reactDiscussion(data)
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
      state.loading = false
      state.currentTabId = action.payload?.id
      state.tabs = state.tabs?.map((e) => {
        if (e.id === action.payload?.id) {
          return action.payload
        }
        return e
      })
    })
    builder.addCase(getCourseActivityTapById.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(createDiscussion.pending, (state) => {
      state.loadingDiscussion = true
    })
    builder.addCase(createDiscussion.fulfilled, (state, action) => {
      state.loadingDiscussion = false
    })
    builder.addCase(createDiscussion.rejected, (state) => {
      state.loadingDiscussion = false
    })

    builder.addCase(getDiscussion.pending, (state) => {
      state.loadingDiscussion = true
    })
    builder.addCase(getDiscussion.fulfilled, (state, action) => {
      state.loadingDiscussion = false
      state.discussion = action.payload?.discussions
    })
    builder.addCase(getDiscussion.rejected, (state) => {
      state.loadingDiscussion = false
    })

    builder.addCase(reactDiscussion.pending, (state) => {
      state.loadingDiscussion = true
    })
    builder.addCase(reactDiscussion.fulfilled, (state, action) => {
      state.loadingDiscussion = false
    })

    builder.addCase(reactDiscussion.rejected, (state) => {
      state.loadingDiscussion = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const courseActivityReducer = (state: RootState) =>
  state.courseActivityReducer

export const courseActivityAction = courseActivitySlice.actions

export default courseActivitySlice.reducer
