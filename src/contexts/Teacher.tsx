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
} from 'src/constants'
import { EventTestAPI } from 'src/pages/api/event-test'

// type for context
type Context = {
  openPopupCongrats: any[]
  setOpenPopupCongrats: React.Dispatch<React.SetStateAction<any[]>>
}

// initContext
const initContext: Context = {
  openPopupCongrats: [],
  setOpenPopupCongrats: () => {},
}

export const TeacherContext = createContext<Context>(initContext)

// export function TeacherProvider(props: PropsWithChildren<{}>) {
//   /**
//    * @description state này để xác định mở popup khi làm xong bài Final Test
//    */
//   const [openPopupCongrats, setOpenPopupCongrats] = useState<any[]>([])

//   return (
//     <CourseContext.Provider
//       value={{
//         openPopupCongrats,
//         setOpenPopupCongrats,
//       }}
//       {...props}
//     />
//   )
// }

// export function useTeacherContext(): Context {
//   const context = useContext(CourseContext)

//   if (!context) {
//     throw new Error('Error!')
//   }

//   return context
// }
