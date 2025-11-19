import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ICourseSectionNoteItem } from '@lms/core'

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
  isViewOnly: boolean
  setIsViewOnly: (flag: boolean) => void
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
  isViewOnly: false,
  setIsViewOnly: () => {},
}

const CourseNoteContext = createContext<Context>(initContext)

export function CourseNoteProvider(props: PropsWithChildren<{
  router: any
  api: {
    getNoteDetail: (course_section_id: string | number, course_id?: string | number | undefined) => Promise<any>
  }
}>) {
  const { api, router } = props
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

  const [isViewOnly, setIsViewOnly] = useState<boolean>(false)

  const refetchNotesList = async () => {
    if (!activityId) return
    try {
      const res = await api.getNoteDetail(activityId as string)
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
        isViewOnly,
        setIsViewOnly,
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
