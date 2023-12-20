import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { RootState } from 'src/redux/store'

export interface ICaseStudyTest {
  loading: boolean
  loadingTest: boolean
  topics: any
  page_size: number
  pageIndex: number
  listFullQuestions: any
  listQuestions: any
  meta: any
  topicsShow: any
}
const initialState: ICaseStudyTest = {
  loading: false,
  loadingTest: false,
  topics: [],
  page_size: 5,
  pageIndex: 1,
  listFullQuestions: [],
  listQuestions: [],
  meta: undefined,
  topicsShow: [],
}
export const getTopicsCaseStudy = createAsyncThunk(
  'caseStudyTestReducer/getTopicsCaseStudy',
  async ({ id, page_index, page_size }: any, thunkAPI) => {
    try {
      const res = await CourseTestApi.getQuestionCaseStudiesById(
        id,
        page_index,
        page_size,
      )
      //   let arr = [] as any
      let arr2 = [] as any
      for (let i in res.data.topics) {
        // const question_topic = {
        //   ...res.data.topics[i].question_topic,
        //   description: await mergeImageToEditor(
        //     res.data.topics[i].question_topic.description,
        //   ),
        // }
        // res.data.topics[i] = {
        //   ...res.data.topics[i],
        //   question_topic,
        // }

        for (let j = 0; j < res.data.topics[i].questions.length; j++) {
          // if (i <= 5) {
          arr2.push({
            [res.data.topics[i].question_topic.id]:
              res.data.topics[i].questions[j],
          })
          // }
        }
      }
      return {
        data: { ...res.data },
        page_index: page_index,
        page_size: page_size,
        listFullQuestions: arr2,
        listQuestions: arr2.slice(0, 25),
        // topics: [...arr2],
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)
export const loadMoreTopic = createAsyncThunk(
  'caseStudyTestReducer/loadMoreTopic',
  async ({ id, page_index, page_size }: any, thunkAPI) => {
    try {
      const res = await CourseTestApi.getQuestionCaseStudiesById(
        id,
        page_index,
        page_size,
      )
      return {
        data: { ...res.data },
        page_index: page_index,
        page_size: page_size,
        // topics: [...arr2],
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)
export const caseStudyTestSlice = createSlice({
  name: 'caseStudyTestReducer',
  initialState,
  reducers: {
    loadMoreQuestion: (state, action) => {
      if (state.listQuestions.length < state.listFullQuestions.length) {
        const arr = [...state.listQuestions]
        for (
          let j = state.listQuestions.length;
          j < state.listFullQuestions.length;
          j++
        ) {
          if (j <= 5 + state.listQuestions.length) {
            arr.push(state.listFullQuestions[j])
          }
        }
        return {
          ...state,
          listQuestions: [...arr],
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTopicsCaseStudy.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTopicsCaseStudy.fulfilled, (state, action) => {
      state.loading = false
      state.topics = action.payload?.data.topics
      state.meta = action.payload?.data.meta
      state.pageIndex = action.payload?.page_index
      state.page_size = action.payload?.page_size
      state.listFullQuestions = action.payload?.listFullQuestions
      state.listQuestions = action.payload?.listQuestions
    })
    builder.addCase(getTopicsCaseStudy.rejected, (state) => {
      state.loading = true
    })
    builder.addCase(loadMoreTopic.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loadMoreTopic.fulfilled, (state, action) => {
      state.loading = false
      const arr = [...state.topics]
      const arrQuest = [...state.listFullQuestions]
      // let arr2 = [] as any
      let listQuestNew = [] as any
      for (let e of action.payload?.data.topics) {
        // arr2 = [...arr2]
        arr.push(e)
        // arr2 = arrQuest.concat(e.questions)
        for (let j = 0; j < e.questions.length; j++) {
          // if (i <= 5) {
          listQuestNew.push({
            [e.question_topic.id]: e.questions[j],
          })
          arrQuest.push({
            [e.question_topic.id]: e.questions[j],
          })
          // }
        }
      }
      // if (state.listQuestions.length === state.listFullQuestions.length) {
      const newArr = state.listFullQuestions.concat(listQuestNew.slice(0, 5))
      state.listQuestions = newArr
      // }
      state.listFullQuestions = arrQuest
      state.topics = arr
      state.meta = action.payload?.data.meta
      state.pageIndex = action.payload?.page_index
      state.page_size = action.payload?.page_size
    })
    builder.addCase(loadMoreTopic.rejected, (state) => {
      state.loading = true
    })
  },
})
export const caseStudyTestReducer = (state: RootState) =>
  state.caseStudyTestReducer
export const caseStudyTestAction = caseStudyTestSlice.actions
export const { loadMoreQuestion } = caseStudyTestSlice.actions
export default caseStudyTestSlice.reducer
