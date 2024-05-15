import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

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

  return (
    <CourseContext.Provider
      value={{
        openPopupCongrats,
        setOpenPopupCongrats,
        setCourseType,
        courseType,
        scoreQuestion,
        setScoreQuestion,
        setSubmitTest,
        submitTest,
      }}
      {...props}
    />
  )
}

export function useCourseContext(): Context {
  const context = useContext(CourseContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
