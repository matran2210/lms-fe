import { DeleteIcon, EllipsisIconV2, PencilV2Icon } from '@assets/icons'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import { cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import {
  backTypeMap,
  IOpenChooseItem,
  ISection,
  SectionDropdownFormValues,
  SectionField,
} from 'src/type/courses'
import { getTypeName } from 'src/type'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { isEmpty } from 'lodash'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { FormProvider, useForm } from 'react-hook-form'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import { useCourseNoteContext } from '@contexts/CourseNoteContext'
import {
  ICourseSectionNoteItem,
  INotesListResponse,
} from 'src/type/course/activity'
import NoDataV2 from 'src/common/NodataV2'
import SortBy from '@components/common/SortBy'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import ListFilterMobile from '@components/common/ListFilterMobile'
import ActionCellV2 from '@components/base/action/ActionCellV2'
import { userReducer } from 'src/redux/slice/User/User'
import { UserType } from 'src/redux/types/User/urser'
import { DEFAULT_PAGE_NUMBER, PageLink } from 'src/constants'
import clsx from 'clsx'

const DEFAULT_PAGESIZE = 20

const LearningNotesList = () => {
  const { isMobileView, isAlwaysShowSidebar } = useTailwindBreakpoint()
  const notesListStatus = useAppSelector(
    (state) => state.notesListReducer?.status,
  )
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
  const [openChooseItem, setOpenChooseItem] = useState<IOpenChooseItem>({
    isOpen: false,
    type: 'section',
    name: '',
    params: '',
  })
  const userType = useAppSelector(userReducer).user.type

  const [listSection, setListSection] = useState<ISection[]>([])
  const [listSubsection, setListSubsection] = useState<ISection[]>([])
  const [listUnit, setListUnit] = useState<ISection[]>([])
  const [listActivity, setListActivity] = useState<ISection[]>([])

  const {
    setOpenNote,
    setNoteData,
    setModalPosition,
    setNoteInput,
    refetchNotesList,
    setIsViewOnly,
  } = useCourseNoteContext()
  const dispatch = useAppDispatch()
  const [notesListData, setNotesListData] = useState<
    INotesListResponse | undefined
  >()

  const router = useRouter()
  //Tạo các biến để lấy id trên thanh url
  const isCourseDetail = PageLink.COURSE_DETAIL === router.pathname
  const isCoursePartDetail = router.pathname.includes('/section')
  const isActivityDetail = router.pathname.includes('/activity')
  const courseId = router.query?.courseId
  const queryId = router.query?.id
  const activityId = router.query?.activityId
  const chapterId = router.query?.chapter
  const unitId = router.query?.unit
  const courseSectionId = router.query.course_section_id

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_NUMBER)
  const [isFirstCallApi, setIsFirstCallApi] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState<string[]>([])
  const [noteHeights, setNoteHeights] = useState<{
    [key: string]: { full: number; collapsed: number }
  }>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [paramsCourseSectionId, setCourseSectionId] = useState<string>('')
  const [isPageStateVariables, setIsPageStateVariables] =
    useState<boolean>(false)
  const methods = useForm<SectionDropdownFormValues>({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })
  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => methods.setValue(field, null))
  }
  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prevExpanded: string[]) => {
      if (prevExpanded.includes(noteId)) {
        // Nếu noteId đã trong mảng, loại bỏ nó
        return prevExpanded.filter((id: string) => id !== noteId)
      } else {
        // Nếu noteId chưa có trong mảng, thêm nó vào
        return [...prevExpanded, noteId]
      }
    })
  }

  const measureNoteHeight = (noteId: string, element: HTMLDivElement) => {
    if (noteHeights[noteId]) return

    // Lấy computed styles của element gốc
    const computedStyles = window.getComputedStyle(element)
    const spanElement = element.querySelector('span')
    const spanStyles = spanElement ? window.getComputedStyle(spanElement) : null

    // Tạo element tạm để đo chiều cao full
    const tempElement = element.cloneNode(true) as HTMLDivElement
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.height = 'auto'
    tempElement.style.maxHeight = 'none'
    tempElement.style.overflow = 'visible'
    tempElement.style.webkitLineClamp = 'unset'

    // Copy các styles quan trọng từ element gốc
    tempElement.style.width = computedStyles.width
    tempElement.style.padding = computedStyles.padding
    tempElement.style.margin = computedStyles.margin
    tempElement.style.fontSize = computedStyles.fontSize
    tempElement.style.lineHeight = computedStyles.lineHeight
    tempElement.style.fontFamily = computedStyles.fontFamily

    // Tìm span chứa text trong tempElement và copy styles
    const tempSpan = tempElement.querySelector('span')
    if (tempSpan && spanStyles) {
      tempSpan.style.webkitLineClamp = 'unset'
      tempSpan.style.display = 'block'
      tempSpan.style.whiteSpace = spanStyles.whiteSpace
      tempSpan.style.wordBreak = spanStyles.wordBreak
      tempSpan.style.fontSize = spanStyles.fontSize
      tempSpan.style.lineHeight = spanStyles.lineHeight
    }

    document.body.appendChild(tempElement)
    const fullHeight = tempElement.offsetHeight

    // Đo chiều cao collapsed (3 dòng) - đảm bảo element đang ở trạng thái collapsed
    const collapsedHeight = element.offsetHeight

    document.body.removeChild(tempElement)

    setNoteHeights((prev) => ({
      ...prev,
      [noteId]: {
        full: fullHeight + 10,
        collapsed: collapsedHeight,
      },
    }))
  }

  const params = cleanParamsAPI({
    class_id: courseId || queryId,
    course_section_id: isFirstCallApi
      ? paramsCourseSectionId
      : activityId || chapterId || courseSectionId || '',
  })

  // Thêm cờ để tránh call duplicate api
  const isFetchingRef = useRef(false)

  useEffect(() => {
    if (
      !(params.course_section_id || params.class_id) ||
      !notesListStatus ||
      isFetchingRef.current
    )
      return

    isFetchingRef.current = true
    setLoading(true)

    CoursesAPI.getCourseNotesList(DEFAULT_PAGE_NUMBER, DEFAULT_PAGESIZE, params)
      .then((res) => {
        setNotesListData(res?.data)
        // Các điều kiện không auto fill filter
        if (isFirstCallApi && !paramsCourseSectionId) return
        if (isCourseDetail || paramsCourseSectionId) return

        // Logic auto fill filter
        const fieldMap: Record<string, any> = {
          section: courseSectionId,
          subsection: chapterId,
          unit: unitId,
          activity: activityId,
        }
        const fieldsToSet = isActivityDetail // Đối với màn activity fill all
          ? ['section', 'subsection', 'unit', 'activity']
          : isCoursePartDetail // Đối với màn course part detail fill section và subsection
            ? ['section', 'subsection']
            : [] // Đối với màn course detail không fill
        fieldsToSet.forEach((field) => {
          const value = fieldMap[field]
          methods.setValue(
            field as 'section' | 'subsection' | 'unit' | 'activity',
            Array.isArray(value) ? (value?.[0] ?? null) : (value ?? null),
          )
        })
      })
      .catch(() => {})
      .finally(() => {
        setIsFirstCallApi(true)
        isFetchingRef.current = false
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }, [notesListStatus, router, paramsCourseSectionId])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEmpty(notesListData)) return

    const scrollEl = scrollRef.current
    if (!scrollEl || !notesListStatus) return

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      if (
        scrollTop + clientHeight + 200 >= scrollHeight &&
        !isFetchingRef.current &&
        (notesListData?.meta?.total_pages ?? 0) > pageIndex
      ) {
        isFetchingRef.current = true
        await fetchData(pageIndex + 1, params)
      }
    }

    scrollEl.addEventListener('scroll', handleScroll)
    return () => scrollEl.removeEventListener('scroll', handleScroll)
  }, [notesListData, pageIndex, notesListStatus])

  const onClose = () => {
    document.body.style.overflow = 'auto'
    dispatch(resetNotesList())
    resetFormFields(['section', 'subsection', 'unit', 'activity'])
    setIsPageStateVariables(true)
  }
  const fetchData = async (pageIndexNext: number, params?: Object) => {
    setLoading(true)
    try {
      const res = await CoursesAPI.getCourseNotesList(
        pageIndexNext,
        DEFAULT_PAGESIZE,
        params,
      )
      setNotesListData((prevResources) => ({
        ...prevResources,
        notes: [...(prevResources?.notes ?? []), ...(res?.data?.notes ?? [])],
        meta: res?.data?.meta ?? prevResources?.meta,
      }))
      setPageIndex(pageIndexNext)
    } catch (error) {
    } finally {
      isFetchingRef.current = false
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await CoursesAPI.deleteCourseNoteList(id)
      fetchData(pageIndex, params)
      refetchNotesList()
      toast.success('Xóa thành công!')
    } catch (error) {}
  }
  const handleEditNote = (id: string, description: string, index: number) => {
    const note = {
      uuid: uuidv4(),
      id: id,
      name: 'Note',
      description: description,
    }
    const isExist = getNotesData.find((item) => item.id === note.id)
    if (!isExist) {
      dispatch(pushNotes(note))
    }
  }

  const handleOpenNote = (
    note: ICourseSectionNoteItem,
    isViewOnly: boolean,
  ) => {
    setOpenNote(true)
    setNoteData(note)
    setModalPosition({ top: 300, left: 0 })
    setNoteInput(note?.description)
    setIsViewOnly(isViewOnly)
  }
  const title = !openChooseItem.isOpen
    ? isOpenFilter
      ? 'Filter'
      : 'Note List'
    : openChooseItem.name
  const classNameHeader = openChooseItem.isOpen
    ? 'pb-4 border-b border-gray-200'
    : 'mb-6'

  const handleBack = () => {
    if (openChooseItem.isOpen && openChooseItem.type !== 'section') {
      const type = backTypeMap[openChooseItem.type]
      setOpenChooseItem({
        ...openChooseItem,
        type: type,
        name: getTypeName[type],
      })
    } else {
      setIsOpenFilter(false)
      setOpenChooseItem({
        ...openChooseItem,
        isOpen: false,
      })
    }
  }

  const handleSubmit = () => {
    setIsOpenFilter(false)
    setCourseSectionId(openChooseItem.params || '')
    setOpenChooseItem({
      ...openChooseItem,
      isOpen: false,
    })
  }

  useEffect(() => {
    if (!notesListStatus) {
      setIsFirstCallApi(false)
      setNotesListData(undefined)
    }
  }, [notesListStatus])

  return (
    <SappDrawerV3
      open={notesListStatus}
      handleCancel={onClose}
      isShowBtnClose
      title={title}
      isShowBtnBack={isOpenFilter}
      handleBack={handleBack}
      isShowFooter={isOpenFilter}
      handleSubmit={handleSubmit}
      classNameHeader={classNameHeader}
      rootClassName={'responsive-drawer-base'}
      submitButtonClassName="w-full h-10"
      btnSubmitTile="Confirm"
      placement={!isAlwaysShowSidebar ? 'bottom' : 'right'}
      titleClassName={isOpenFilter ? 'w-full pr-8 text-center' : ''}
    >
      <FormProvider {...methods}>
        {!isOpenFilter ? (
          <>
            {isMobileView ? (
              <SortBy action={() => setIsOpenFilter(true)} />
            ) : (
              <FilterCourseSection
                setParams={setCourseSectionId}
                heightCustom="h-10"
                isPageStateVariables={isPageStateVariables}
              />
            )}

            <div
              ref={scrollRef}
              className={clsx(
                'result-scroll mt-6 flex h-[250px] flex-col gap-6 md:mt-4 md:h-[510px] md:gap-0 lg:h-[700px]',
                {
                  'overflow-y-auto': !isEmpty(notesListData?.notes),
                },
              )}
            >
              {!isEmpty(notesListData?.notes) ? (
                <>
                  {notesListData?.notes?.map(
                    (note: ICourseSectionNoteItem, index) => {
                      const isExpanded = expandedNotes.includes(note?.id)
                      const isEdit = activityId === note?.course_section_id
                      const handleEdit = () => {
                        if (
                          !getNotesData.some((item) =>
                            item.id.includes(note?.id),
                          )
                        ) {
                          handleOpenNote(note, false)
                          handleEditNote(note?.id, note?.description, index)
                          onClose()
                        }
                      }
                      const handleView = async () => {
                        await router.push({
                          pathname: `/courses/${queryId || courseId}/activity/${note?.course_section_id}`,
                          query: {
                            note_id: note?.id,
                          },
                        })
                        handleOpenNote(note, true)
                        handleEditNote(note?.id, note?.description, index)
                        onClose()
                      }

                      const listAction = [
                        ...(isEdit
                          ? [
                              {
                                icon: <PencilV2Icon className="h-5 w-5" />,
                                nameAction: 'Edit',
                                action: handleEdit,
                              },
                            ]
                          : []),
                        {
                          icon: <DeleteIcon />,
                          nameAction: 'Delete',
                          action: () => handleDelete(note?.id),
                        },
                      ]

                      return (
                        <div
                          className="cursor-pointer rounded-2xl hover:bg-primary-50 md:p-4"
                          key={note?.id}
                          onClick={handleView}
                        >
                          <div className="flex justify-between">
                            <div className="text-sm font-semibold text-gray-800 md:text-base">
                              {note?.course_section_path[0]?.name}
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <ActionCellV2
                                icon={<EllipsisIconV2 />}
                                listAction={listAction}
                              />
                            </div>
                          </div>
                          <div
                            className="mt-1 hidden items-center text-sm font-normal text-gray-400 md:flex "
                            onClick={() => onClose()}
                          >
                            <SappBreadcrumbNotLink
                              isTeacher={userType === UserType.TEACHER}
                              paths={[...note?.course_section_path].reverse()}
                            />
                          </div>
                          <div className="mt-1 text-sm font-normal text-gray-800 md:mt-4 md:text-base">
                            <div
                              ref={(el) => {
                                if (
                                  el &&
                                  note?.description?.length > 230 &&
                                  !noteHeights[note?.id]
                                ) {
                                  // Đo chiều cao ngay khi component mount
                                  setTimeout(() => {
                                    measureNoteHeight(note?.id, el)
                                  }, 0)
                                }
                              }}
                              className="overflow-hidden transition-all duration-300 ease-in-out"
                              style={{
                                maxHeight:
                                  note?.description?.length > 230
                                    ? isExpanded
                                      ? noteHeights[note?.id]?.full
                                        ? `${noteHeights[note?.id].full}px`
                                        : 'none'
                                      : noteHeights[note?.id]?.collapsed
                                        ? `${noteHeights[note?.id].collapsed}px`
                                        : '4.5rem'
                                    : undefined,
                              }}
                            >
                              <span
                                className={`whitespace-pre-wrap break-all ${
                                  !isExpanded &&
                                  note?.description?.length > 230 &&
                                  !noteHeights[note?.id]
                                    ? 'line-clamp-3'
                                    : ''
                                }`}
                              >
                                {note?.description}
                              </span>
                            </div>
                            {note?.description?.length > 230 && (
                              <button
                                className="block text-sm font-normal text-gray-400 transition-colors duration-200 hover:text-gray-600 md:text-base"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpand(note?.id)
                                }}
                              >
                                {isExpanded ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </div>
                          <div className="mt-2 flex md:mt-4">
                            <div className="text-sm font-normal text-gray-400">
                              {format(note?.updated_at, 'dd/MM/yyyy HH:mm')}
                            </div>
                          </div>
                        </div>
                      )
                    },
                  )}
                </>
              ) : (
                <div className="flex min-h-[calc(100vh-42rem)] items-center justify-center lg:min-h-[calc(100vh-12rem)]">
                  <NoDataV2 />
                </div>
              )}
            </div>
          </>
        ) : !openChooseItem.isOpen ? (
          <ListFilterMobile
            setOpenChooseItem={setOpenChooseItem}
            listSection={listSection}
            listSubsection={listSubsection}
            listUnit={listUnit}
            listActivity={listActivity}
            setListSection={setListSection}
            setListSubsection={setListSubsection}
            setListUnit={setListUnit}
            setListActivity={setListActivity}
          />
        ) : (
          <ListItemFilterMobile
            setOpenChooseItem={setOpenChooseItem}
            openChooseItem={openChooseItem}
            listSection={listSection}
            listSubsection={listSubsection}
            listUnit={listUnit}
            listActivity={listActivity}
            setListSection={setListSection}
            setListSubsection={setListSubsection}
            setListUnit={setListUnit}
            setListActivity={setListActivity}
          />
        )}
      </FormProvider>
    </SappDrawerV3>
  )
}

export default LearningNotesList
