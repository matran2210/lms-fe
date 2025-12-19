import { ITestServiceAPI } from '@lms/core'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'

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
  "caseStudyTestReducer/getTopicsCaseStudy",
  async (
    {
      api,
      id,
      quiz_id,
    }: {
      api: ITestServiceAPI;
      id: any;
      quiz_id: any;
    },
    thunkAPI,
  ) => {
    try {
      const res = await api.getTopicDescription(id, quiz_id, undefined, false, true);
      const arr2 = [] as any;
      for (let j = 0; j < res.data.questions.length; j++) {
        arr2.push({
          [res.data.id]: res.data.questions[j],
        });
      }
      return {
        data: { ...res.data },
        listFullQuestions: arr2,
        listQuestions: arr2.slice(0, 25),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);
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
    saveFileEssayCaseStudy: (state, action) => {
      const { question_id, file, topic_id, requirement_id } = action.payload
      const arr = [...state.listQuestions]
      const newData = [] as any
      for (const item of arr) {
        if (question_id === item[topic_id].id) {
          if (requirement_id) {
            const newItem = {
              [topic_id]: {
                ...item[topic_id],
                requirements: (item[topic_id].requirements || []).map(
                  (req: any, idx: number) => {
                    if (req.id === requirement_id) {
                      return {
                        ...req,
                        answer_file: {
                          file_key: file?.file_key,
                          file_name: file?.name,
                        },
                      }
                    }
                    return req
                  },
                ),
              },
            }
            newData.push(newItem)
          } else {
            const newItem = {
              [topic_id]: {
                ...item[topic_id],
                answer_file: {
                  file_key: file?.file_key,
                  file_name: file?.name,
                },
              },
            }
            newData.push(newItem)
          }
        } else {
          newData.push(item)
        }
      }
      return {
        ...state,
        listQuestions: [...newData],
      }
    },
    clearFileEssayCaseStudy: (state, action) => {
      const { question_id, topic_id, requirement_id } = action.payload
      const arr = [...state.listQuestions]
      const newData = [] as any
      for (const item of arr) {
        if (question_id === item[topic_id]?.id) {
          if (requirement_id) {
            const newItem = {
              [topic_id]: {
                ...item[topic_id],
                requirements: (item[topic_id].requirements || []).map(
                  (req: any, idx: number) => {
                    if (req.id === requirement_id) {
                      return {
                        ...req,
                        answer_file: undefined,
                      }
                    }
                    return req
                  },
                ),
              },
            }
            newData.push(newItem)
          } else {
            const newItem = {
              [topic_id]: {
                ...item[topic_id],
                answer_file: undefined,
              },
            }
            newData.push(newItem)
          }
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
export const { loadMoreQuestion, saveFileEssayCaseStudy, clearFileEssayCaseStudy } =
  caseStudyTestSlice.actions;
export default caseStudyTestSlice.reducer
