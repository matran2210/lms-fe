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
}

// initContext
const initContext: Context = {
  openPopupCongrats: false,
  setOpenPopupCongrats: () => {},
  courseType: '',
  setCourseType: () => {},
  scoreQuestion: 0,
  setScoreQuestion: () => {},
}

const CourseContext = createContext<Context>(initContext)

export function CourseProvider(props: PropsWithChildren<{}>) {
  const [openPopupCongrats, setOpenPopupCongrats] = useState(false)

  const [courseType, setCourseType] = useState('')

  const [scoreQuestion, setScoreQuestion] = useState(0)

  return (
    <CourseContext.Provider
      value={{
        openPopupCongrats,
        setOpenPopupCongrats,
        setCourseType,
        courseType,
        scoreQuestion,
        setScoreQuestion,
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
