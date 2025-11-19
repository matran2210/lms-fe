import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import loginReducer from './slice/Login/Login'
import userReducer from './slice/User/User'
import confirmDialogReducer from './slice/ConfirmDialog/ConfirmDialogSlice'
import courseActivityReducer from './slice/Course/MyCourse/Activity/Activity'
import notificationReducer from './slice/Notification/Notification'
import courseActivityQuizReducer from './slice/Course/MyCourse/Activity/ActivityQuiz'
import userGuideReducer from './slice/Course/UserGuide'
import caseStudyTestReducer from './slice/Course/MyCourse/Case-study/CaseStudy'
import entranceTestReducer from './slice/EntranceTest/EntranceTest'
import eventTestReducer from './slice/EventTest/EventTest'
import notesListReducer from './slice/Course/NotesList'
import popupReducer from './slice/Popup/Result-test'

export const store = configureStore({
  reducer: {
    loginReducer,
    userReducer,
    confirmDialogReducer,
    courseActivityReducer,
    notificationReducer,
    popupReducer,
    courseActivityQuizReducer,
    userGuideReducer,
    caseStudyTestReducer,
    entranceTestReducer,
    eventTestReducer,
    notesListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const makeStore = () => store
export const wrapper = createWrapper(makeStore)
