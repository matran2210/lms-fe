import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'
import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
  IDiscussion,
  IUserInDiscussion,
} from '../../../../types/Course/MyCourse/Activity/activity'
import { CourseActivityApi, IActivity, IActivityAPI, IActivityBreadcrumb, IBreadcrumb, ICoursesAPI } from '@lms/core'

// Tạo một đối tượng activity với giá trị mặc định
export interface ICourseActivityState extends IActivity {
  loading: boolean
  loadingDiscussion: boolean
  currentTabId?: string
  discussion?: IDiscussion[]
  userInDiscussion?: IUserInDiscussion
  calculator_status?: boolean
}

const initialState: ICourseActivityState = {
  loading: false,
  loadingDiscussion: false,
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
  course_section_type: "",
  course_section_notes: [],
  activity_type: "",
  position: "",
  parent_id: "",
  display_icon: "",
  total_activity: 0,
  course_outcomes: [] as any[],
  course_learning_outcome: {
    id: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    name: "",
    description: "",
  },
  files: [] as any[],
  discussion: undefined,
  breadcumb: [] as IActivityBreadcrumb[],
  user_course_section_progress: [],
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
  is_preview_locked: false,
};

export const getCourseActivityTapById = createAsyncThunk(
  'courseActivityReducer/getTapById',
  async ({ api, courseId, id }: {api: ICoursesAPI; courseId: string; id: string }, thunkAPI) => {
    try {
      const res = await api.getCourseActivityTapById(courseId, id)
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
  async ({api, id, sectionId }: {
    api: ICoursesAPI;
    id: string;
    sectionId: string
  }, thunkAPI) => {
    try {
      const res = await api.getDiscussion(id, sectionId)
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
  async ({api, data}: {api: IActivityAPI, data: ICreateDiscussionRequest}, thunkAPI) => {
    try {
      const res = await api.createDiscussionComment(data)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const uploadImagesDiscussion = createAsyncThunk(
  'courseActivityReducer/uploadImagesDiscussion',
  async ({api, data}: {api: CourseActivityApi; data: ICreateDiscussionUploadRequest}, thunkAPI) => {
    try {
      const res = await api.uploadImagesDiscussion(data)
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
  async ({api, data}: {api: IActivityAPI; data: ICreateDiscussionResReact}, thunkAPI) => {
    try {
      const res = await api.reactDiscussion(data)
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
        tabs: action?.payload?.tabs,
      }
    },
    setCurrentTabId: (state, action: PayloadAction<string>) => {
      state.currentTabId = action.payload
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
      state.userInDiscussion = action.payload?.user
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

    builder.addCase(uploadImagesDiscussion.pending, (state) => {
      state.loadingDiscussion = true
    })
    builder.addCase(uploadImagesDiscussion.fulfilled, (state, action) => {
      state.loadingDiscussion = false
    })

    builder.addCase(uploadImagesDiscussion.rejected, (state) => {
      state.loadingDiscussion = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const courseActivityReducer = (state: RootState) =>
  state.courseActivityReducer

export const courseActivityAction = courseActivitySlice.actions
export const { openCalculator, closeCalculator } = courseActivitySlice.actions

export default courseActivitySlice.reducer
