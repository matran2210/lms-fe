import ListFilterMobile from '@components/common/ListFilterMobile'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import NoDataV2 from '@components/common/NodataV2'
import SortBy from '@components/common/SortBy'
import ActionCellV2 from '@components/courses/action/ActionCellV2'
import FilterCourseSection from '@components/courses/note-list/FilterCourseSection'
import BaseModal from '@components/courses/popup/BaseModal'
import {
  AltArrowLeft,
  DeleteIcon,
  EllipsisIconV2,
  PencilV2Icon,
} from '@lms/assets'
import {
  pushNotes3Level,
  resetNotesList3Level,
  useAppDispatch,
  useAppSelector,
  useCourseNoteContext,
} from '@lms/contexts'
import { DEFAULT_PAGESIZE, ISection } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { ButtonPrimary, SappBreadcrumbNotLink, SappDrawerV3 } from '@lms/ui'
import { cleanParamsAPI } from '@lms/utils'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageLink } from 'src/constants/routes'
import { CoursesAPI } from 'src/pages/api/courses'
import {
  ICourseSectionNoteItem,
  ICourseSectionPathItem,
  INotesListResponse,
} from 'src/type/courses-3-level/activity'
import {
  backTypeMap,
  getTypeName,
  IOpenChooseItem,
  SectionDropdownFormValues,
  SectionField,
} from 'src/type/courses-3-level/course'
import { v4 as uuidv4 } from 'uuid'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

export default function LearningNotesList({
  onClose,
}: {
  onClose?: () => void
}) {
  // Use the new slice for selectors
  const { isMobileView } = useTailwindBreakpoint()
  const notesListStatus = useAppSelector(
    (state) => state.shortNotesListReducer?.status,
  )
  const getNotesData = useAppSelector(
    (state) => state.shortNotesListReducer?.note_data,
  )
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
  const [openChooseItem, setOpenChooseItem] = useState<IOpenChooseItem>({
    isOpen: false,
    type: 'section',
    name: '',
    params: '',
  })

  const [listSection, setListSection] = useState<ISection[]>([])
  const [listSubsection, setListSubsection] = useState<ISection[]>([])
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
  const courseId = router.query.courseId
  const queryId = router.query.id
  const courseSectionId = router.query.course_section_id
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)
  const [firstLoadActity, setFirstLoadActity] = useState<boolean>(false)
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
    course_section_id: paramsCourseSectionId,
  })
  // Lấy danh sách notes và fill tự động activity khi lần đầu mở trong activity
  useEffect(() => {
    const objectParams = cleanParamsAPI({
      class_id: courseId || queryId,
      course_section_id: queryId || courseSectionId || '',
    })
    if (
      router?.query?.queryId ||
      (router?.query?.course_section_id && notesListStatus)
    ) {
      setLoading(true)
      CoursesAPI.getCourseNotesList(DEFAULT_PAGESIZE, objectParams)
        .then((res) => {
          setNotesListData(res?.data)
          const course_section_path = res?.data?.notes?.[0]?.course_section_path

          if (res && course_section_path?.length > 0) {
            methods.setValue(
              'section',
              defaultValueActivity(course_section_path, 'PART')?.value,
            )
            methods.setValue(
              'subsection',
              defaultValueActivity(course_section_path, 'CHAPTER')?.value,
            )
            // Hiệu ứng fill data vào ô select
            setTimeout(() => {
              methods.setValue(
                'activity',
                defaultValueActivity(course_section_path, 'ACTIVITY')?.value,
              )
              setFirstLoadActity(true)
            }, 1000)
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    } else if (notesListStatus) {
      setFirstLoadActity(true)
    }
  }, [notesListStatus])

  const handleEditNote = (id: string, description: string) => {
    const note = {
      uuid: uuidv4(),
      id: id,
      name: 'Note',
      description: description,
    }
    const isExist = getNotesData.find((item) => item.id === note.id)
    if (!isExist) {
      dispatch(pushNotes3Level(note))
    }
  }

  // Lấy danh sách notes khi có sự thay đổi trong notesListStatus, selectedSection, selectedSubsection, selectedActivity
  useEffect(() => {
    if (notesListStatus && (courseId || queryId) && firstLoadActity) {
      setLoading(true)
      CoursesAPI.getCourseNotesList(DEFAULT_PAGESIZE, params)
        .then((res) => {
          setNotesListData(res?.data)
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    }
  }, [notesListStatus, paramsCourseSectionId, firstLoadActity])

  // Attach a scroll event listener to fetch more data when scrolling to the bottom
  useEffect(() => {
    const containerDiv: any = document.getElementById('sapp-drawer-notes-list') // Replace 'your-container-id' with the actual ID of your container div

    const handleScroll = () => {
      if (
        containerDiv &&
        containerDiv.clientHeight + containerDiv.scrollTop ===
          containerDiv.scrollHeight &&
        (courseId || queryId) &&
        notesListStatus &&
        (notesListData?.meta?.total_records ?? 0) > pageIndex
      ) {
        fetchData(params)
      }
    }

    containerDiv?.addEventListener('scroll', handleScroll)

    return () => containerDiv?.removeEventListener('scroll', handleScroll)
  }, [pageIndex])

  // Use the new resetNotesList action and allow onClose override
  const handleDrawerClose = () => {
    if (onClose) {
      onClose?.()
      dispatch(resetNotesList3Level())
    } else {
      document.body.style.overflow = 'auto'
      dispatch(resetNotesList3Level())
      resetFormFields(['section', 'subsection', 'activity'])
      setIsPageStateVariables(true)
      setFirstLoadActity(false)
    }
  }

  const defaultValueActivity = (
    course_section_path: ICourseSectionPathItem[],
    type: string,
  ) => {
    const value = course_section_path.find((item) => item?.type === type)
    if (!value) return { value: '', label: '' }
    const responce = { value: value.id, label: value.name }
    return responce
  }

  const fetchData = async (params?: Object) => {
    setLoading(true)
    try {
      const res = await CoursesAPI.getCourseNotesList(pageIndex, params)
      setNotesListData(res?.data)
      setPageIndex((prevPageIndex) => prevPageIndex + DEFAULT_PAGESIZE)
    } catch (error) {
      // Handle error if needed
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await CoursesAPI.deleteCourseNoteList(id)
      fetchData(params)
      refetchNotesList()
      toast.success('Xóa thành công!')
    } catch (error) {}
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

  const renderTitle = (title: string) => {
    return (
      <div className="flex items-center justify-between">
        <div onClick={handleBack}>
          <AltArrowLeft />
        </div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <div className="invisible h-6 w-6" />
      </div>
    )
  }

  const getTitle = () => {
    if (openChooseItem.isOpen) return renderTitle(openChooseItem.name)

    return isOpenFilter ? renderTitle('Filter') : 'Note List'
  }

  const classNameHeader = openChooseItem.isOpen
    ? 'pb-4 border-b border-gray-200 '
    : 'mb-6'

  const handleBack = () => {
    if (openChooseItem.isOpen && openChooseItem.type === 'section') {
      setOpenChooseItem({
        ...openChooseItem,
        isOpen: false,
      })
    } else if (openChooseItem.isOpen) {
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

  const handleFilter = () => {
    if (openChooseItem?.params) {
      setCourseSectionId(openChooseItem.params)
    }
    setIsOpenFilter(false)
    setOpenChooseItem({
      ...openChooseItem,
      isOpen: false,
    })
  }

  // Common content for both desktop and mobile
  const renderContent = () => (
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

          <div className="result-scroll mt-6 flex h-[calc(100vh-10rem)] flex-col gap-6 md:mt-4 md:gap-0">
            {!isEmpty(notesListData?.notes) ? (
              <>
                {notesListData?.notes?.map((note: ICourseSectionNoteItem) => {
                  const isExpanded = expandedNotes.includes(note?.id)
                  const isEdit = queryId === note?.course_section_id
                  const handleEdit = () => {
                    if (
                      !getNotesData.some((item) => item.id.includes(note?.id))
                    ) {
                      handleOpenNote(note, false)
                      handleEditNote(note?.id, note?.description)
                      onClose?.()
                    }
                  }
                  const handleView = async () => {
                    const pathname = `${PageLink.SHORT_COURSE}/detail/${courseId}/activity/${note?.course_section_id}`
                    await router.push({
                      pathname,
                      query: {
                        note_id: note?.id,
                      },
                    })

                    const noteForModal = {
                      uuid: uuidv4(),
                      id: note?.id,
                      name: 'Note',
                      description: note?.description,
                    }
                    const isExist = getNotesData.find(
                      (item) => item.id === note?.id,
                    )
                    if (!isExist) {
                      dispatch(pushNotes3Level(noteForModal))
                    }
                    handleOpenNote(note, true)
                    handleDrawerClose()
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
                        <div className="mr-4 line-clamp-1 text-sm font-semibold text-gray-800 md:text-base">
                          {note?.name}
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
                        onClick={() => handleDrawerClose()}
                      >
                        <SappBreadcrumbNotLink
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
                })}
              </>
            ) : (
              <div className="flex min-h-[calc(100vh-40rem)] items-center justify-center lg:min-h-[calc(100vh-14rem)]">
                <NoDataV2 />
              </div>
            )}
          </div>
        </>
      ) : !openChooseItem.isOpen ? (
        <ListFilterMobile setOpenChooseItem={setOpenChooseItem} />
      ) : (
        <ListItemFilterMobile
          setOpenChooseItem={setOpenChooseItem}
          openChooseItem={openChooseItem}
          listSection={listSection}
          listSubsection={listSubsection}
          listActivity={listActivity}
          setListSection={setListSection}
          setListSubsection={setListSubsection}
          setListActivity={setListActivity}
        />
      )}
      {isOpenFilter && (
        <div className="mb-0 mt-2 w-full">
          <ButtonPrimary
            title="Confirm"
            className="w-full"
            onClick={handleFilter}
          />
        </div>
      )}
    </FormProvider>
  )

  return (
    <>
      {isMobileView ? (
        <BaseModal
          title={getTitle()}
          visible={notesListStatus}
          onClose={handleDrawerClose}
          bodyStyle={{
            maxHeight: '50vh',
            overflowY: 'auto',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
          wrapClassName="note-list-modal"
          footer={null}
          closable={!isOpenFilter}
        >
          {renderContent()}
        </BaseModal>
      ) : (
        <SappDrawerV3
          open={notesListStatus}
          handleCancel={handleDrawerClose}
          isShowBtnClose
          title={getTitle()}
          isShowBtnBack={isOpenFilter}
          handleBack={handleBack}
          classNameHeader={classNameHeader}
          rootClassName={'responsive-drawer-center'}
          submitButtonClassName="w-full h-10"
          btnSubmitTile="Confirm"
        >
          {renderContent()}
        </SappDrawerV3>
      )}
    </>
  )
}
