import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { RootState } from 'src/redux/store'

export interface ICaseStudyTest {
  loading: boolean
  loadingTest: boolean
  topics: any
  listFullQuestions: any
  listQuestions: any
  topicsShow: any
}
const initialState: ICaseStudyTest = {
  loading: false,
  loadingTest: false,
  topics: [],
  listFullQuestions: [],
  listQuestions: [],
  topicsShow: [],
}
export const getTopicsCaseStudy = createAsyncThunk(
  'caseStudyTestReducer/getTopicsCaseStudy',
  async ({ id }: any, thunkAPI) => {
    try {
      const res = await CourseTestApi.getTopicQuiz(id)
      let arr2 = [] as any
      for (let j = 0; j < res.data.questions.length; j++) {
        arr2.push({
          [res.data.id]: res.data.questions[j],
        })
      }
      return {
        data: { ...res.data },
        listFullQuestions: arr2,
        listQuestions: arr2.slice(0, 25),
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
    saveFileEssay: (state, action) => {
      const { question_id, file, topic_id } = action.payload
      const arr = [...state.listQuestions]
      let newData = [] as any
      for (let item of arr) {
        if (question_id === item[topic_id].id) {
          var newItem = {
            topic_id: {
              ...item[topic_id],
              answer_file: {
                file_key: file.file_key,
                file_name: file.name,
              },
            },
          }
          newData.push(newItem)
        } else {
          newData.push(item)
        }
      }
      return {
        ...state,
        listQuestions: [...newData],
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTopicsCaseStudy.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTopicsCaseStudy.fulfilled, (state, action) => {
      state.loading = false
      state.topics = action.payload?.data
      state.listFullQuestions = action.payload?.listFullQuestions
      state.listQuestions = action.payload?.listQuestions
    })
    builder.addCase(getTopicsCaseStudy.rejected, (state) => {
      state.loading = false
    })
  },
})
export const caseStudyTestReducer = (state: RootState) =>
  state.caseStudyTestReducer
export const caseStudyTestAction = caseStudyTestSlice.actions
export const { loadMoreQuestion, saveFileEssay } = caseStudyTestSlice.actions
export default caseStudyTestSlice.reducer
