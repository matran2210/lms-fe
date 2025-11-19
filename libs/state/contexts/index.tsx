import { IPopupFormState } from '@components/mycourses/hubspot/PopupLockContent'
import { useRouter } from 'next/router'
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  CERTIFICATE_DETAIL,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
} from '@lms/core'
import { EventTestAPI } from 'src/pages/api/event-test'

// type for context
type Context = {
  openPopupCongrats: boolean
  setOpenPopupCongrats: React.Dispatch<React.SetStateAction<boolean>>
  courseType: string
  setCourseType: React.Dispatch<React.SetStateAction<string>>
  scoreQuestion: number
  setScoreQuestion: React.Dispatch<React.SetStateAction<number>>
  submitTest: boolean
  setSubmitTest: React.Dispatch<React.SetStateAction<boolean>>
  submitEventTest: boolean
  setSubmitEventTest: React.Dispatch<React.SetStateAction<boolean>>
  showPinnedTrial: boolean
  setShowPinnedTrial: React.Dispatch<React.SetStateAction<boolean>>
  openPopupCTA: IPopupFormState
  setOpenPopupCTA: React.Dispatch<React.SetStateAction<IPopupFormState>>
  isOpenSidebar: boolean
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

// initContext
const initContext: Context = {
  openPopupCongrats: false,
  setOpenPopupCongrats: () => {},
  courseType: '',
  setCourseType: () => {},
  scoreQuestion: 0,
  setScoreQuestion: () => {},
  submitTest: false,
  setSubmitTest: () => {},
  submitEventTest: false,
  setSubmitEventTest: () => {},
  showPinnedTrial: false,
  setShowPinnedTrial: () => {},
  openPopupCTA: {
    lockSection: false,
    ctaUpgrade: false,
    thankYou: false,
    thankYouLater: false,
  },
  setOpenPopupCTA: () => {},
  isOpenSidebar: false,
  setOpenSidebar: () => {},
}

const CourseContext = createContext<Context>(initContext)

export function CourseProvider(props: PropsWithChildren<{}>) {
  /**
   * @description state này để xác định mở popup khi làm xong bài Final Test
   */
  const [openPopupCongrats, setOpenPopupCongrats] = useState(false)

  /**
   * @description state này để xác định type của khóa học
   */
  const [courseType, setCourseType] = useState('')

  /**
   * @description state này lưu điểm của của bài Final Test
   */
  const [scoreQuestion, setScoreQuestion] = useState(0)

  /**
   * @description state này bằng true khi submit bài test
   */
  const [submitTest, setSubmitTest] = useState(false)

  /**
   * @description state này bằng true khi submit bài test
   */
  const [submitEventTest, setSubmitEventTest] = useState(false)

  /**
   * @description state này bằng true khi hiển thị form hubspot
   */
  const [showPinnedTrial, setShowPinnedTrial] = useState(false)

  /**
   * @description state này bằng true khi hiển thị form hubspot
   */
  const [openPopupCTA, setOpenPopupCTA] = useState<IPopupFormState>({
    lockSection: false,
    ctaUpgrade: false,
    thankYou: false,
    thankYouLater: false,
  })
  /**
   * @description state này bằng true khi hiển thị sidebar
   */
  const [isOpenSidebar, setOpenSidebar] = useState(false)

  /**
   * @description state này bằng true khi hiển thị form hubspot
   */
  const router = useRouter()

  async function fetchEventTest() {
    const res = await EventTestAPI.get({})
    if (res.success) {
      localStorage.setItem('countEvent', res?.data?.length)
    }
  }

  useEffect(() => {
    if (
      ![
        ENTRANCE_TEST_RESULT,
        CERTIFICATE_DETAIL,
        ENTRANCE_TEST_TABLE_RESULT,
      ].includes(router.pathname)
    ) {
      fetchEventTest()
    }
  }, [])

  const contextValue = React.useMemo(
    () => ({
      openPopupCongrats,
      setOpenPopupCongrats,
      setCourseType,
      courseType,
      scoreQuestion,
      setScoreQuestion,
      setSubmitTest,
      submitTest,
      submitEventTest,
      setSubmitEventTest,
      setShowPinnedTrial,
      showPinnedTrial,
      openPopupCTA,
      setOpenPopupCTA,
      isOpenSidebar,
      setOpenSidebar,
    }),
    [
      openPopupCongrats,
      setOpenPopupCongrats,
      setCourseType,
      courseType,
      scoreQuestion,
      setScoreQuestion,
      setSubmitTest,
      submitTest,
      submitEventTest,
      setSubmitEventTest,
      setShowPinnedTrial,
      showPinnedTrial,
      openPopupCTA,
      setOpenPopupCTA,
      isOpenSidebar,
      setOpenSidebar,
    ],
  )

  return <CourseContext.Provider value={contextValue} {...props} />
}

export function useCourseContext(): Context {
  const context = useContext(CourseContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
