import { CoursesAPI } from '@pages/api/courses'
import { CERTIFICATE_DETAIL } from '@utils/constants'
import { convertUTCToLocalTime } from '@utils/helpers'
import { getLocalStorageItem, setLocalStorageItem } from '@utils/index'
import { useRouter } from 'next/router'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ENTRANCE_TEST_RESULT, ENTRANCE_TEST_TABLE_RESULT } from 'src/constants'
import UserApi from 'src/redux/services/User/user'
import { PinnedNotifications } from 'src/type'
import { ICourseSectionNoteItem } from 'src/type/course/activity'

// type for context
type Context = {
  openNote: boolean
  setOpenNote: (open: boolean) => void
  noteData: ICourseSectionNoteItem | undefined
  setNoteData: (data: ICourseSectionNoteItem | undefined) => void
  modalPosition: { top: number; left: number } | null
  setModalPosition: (pos: { top: number; left: number } | null) => void
  noteInput: string
  setNoteInput: (data: string) => void
  notesListData: ICourseSectionNoteItem[] | undefined
  refetchNotesList: () => void
}

// initContext
const initContext: Context = {
  openNote: false,
  setOpenNote: () => {},
  noteData: undefined,
  setNoteData: () => {},
  modalPosition: null,
  setModalPosition: () => {},
  noteInput: '',
  setNoteInput: () => {},
  notesListData: undefined,
  refetchNotesList: () => {},
}

const CourseNoteContext = createContext<Context>(initContext)

export function CourseNoteProvider(props: PropsWithChildren<{}>) {
  const router = useRouter()
  const activityId = router.query.activityId
  const [openNote, setOpenNote] = useState(false)
  const [noteData, setNoteData] = useState<ICourseSectionNoteItem | undefined>(
    undefined,
  )
  const [modalPosition, setModalPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const [noteInput, setNoteInput] = useState<string>('')
  const [notesListData, setNotesListData] = useState<
    ICourseSectionNoteItem[] | undefined
  >()

  const refetchNotesList = async () => {
    if (!activityId) return
    try {
      const res = await CoursesAPI.getNoteDetail(activityId as string)
      setNotesListData(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (activityId) {
      refetchNotesList()
    }
  }, [activityId])

  return (
    <CourseNoteContext.Provider
      value={{
        openNote,
        setOpenNote,
        noteData,
        setNoteData,
        modalPosition,
        setModalPosition,
        noteInput,
        setNoteInput,
        notesListData,
        refetchNotesList,
      }}
      {...props}
    />
  )
}

export function useCourseNoteContext(): Context {
  const context = useContext(CourseNoteContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
