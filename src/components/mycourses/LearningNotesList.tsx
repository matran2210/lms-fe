import { DeleteIcon, EditIcon, ViewIcon } from '@assets/icons'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import { cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
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
import { resetNotesList } from 'src/redux/slice/Course/NotesList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { FormProvider, useForm } from 'react-hook-form'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import { useCourseNoteContext } from '@contexts/CourseNoteContext'
import { ICourseSectionNoteItem } from 'src/type/course/activity'
import NoDataV2 from 'src/common/NodataV2'
import SortBy from '@components/common/SortBy'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import ListFilterMobile from '@components/common/ListFilterMobile'

const DEFAULT_PAGESIZE = 20

const LearningNotesList = () => {
  const { isMobileView } = useTailwindBreakpoint()
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
  const [notesListData, setNotesListData] = useState<any>()
  const router = useRouter()
  const courseId = router.query.courseId
  const queryId = router.query.id
  const activityId = router.query.activityId
  const courseSectionId = router.query.course_section_id
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)
  const [firstLoadActity, setFirstLoadActity] = useState<boolean>(false)
  const [expandedNotes, setExpandedNotes] = useState<any>([])
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
    setExpandedNotes((prevExpanded: any) => {
      if (prevExpanded?.includes(noteId)) {
        // Nếu noteId đã trong mảng, loại bỏ nó
        return prevExpanded?.filter((id: string) => id !== noteId)
      } else {
        // Nếu noteId chưa có trong mảng, thêm nó vào
        return [...prevExpanded, noteId]
      }
    })
  }

  const params = cleanParamsAPI({
    class_id: courseId || queryId,
    course_section_id: paramsCourseSectionId,
  })
  // Lấy danh sách notes và fill tự động activity khi lần đầu mở trong activity
  useEffect(() => {
    const objectParams = cleanParamsAPI({
      class_id: courseId || queryId,
      course_section_id: activityId || courseSectionId || '',
    })
    if (
      router?.query?.activityId ||
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
                'unit',
                defaultValueActivity(course_section_path, 'UNIT')?.value,
              )
            }, 500)
            setTimeout(() => {
              methods.setValue(
                'activity',
                defaultValueActivity(course_section_path, 'ACTIVITY')?.value,
              )
              setFirstLoadActity(true)
            }, 1000)
          }
        })
        .catch((err) => {})
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    } else if (notesListStatus) {
      setFirstLoadActity(true)
    }
  }, [notesListStatus])

  // Lấy danh sách notes khi có sự thay đổi trong notesListStatus, selectedSection, selectedSubsection, selectedUnit, selectedActivity
  useEffect(() => {
    if (notesListStatus && (courseId || queryId) && firstLoadActity) {
      setLoading(true)
      CoursesAPI.getCourseNotesList(DEFAULT_PAGESIZE, params)
        .then((res) => {
          setNotesListData(res?.data)
        })
        .catch((err) => {})
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
        notesListStatus
      ) {
        notesListData?.meta?.total_records > pageIndex && fetchData(params)
      }
    }

    containerDiv?.addEventListener('scroll', handleScroll)

    return () => containerDiv?.removeEventListener('scroll', handleScroll)
  }, [pageIndex])

  const onClose = () => {
    document.body.style.overflow = 'auto'
    dispatch(resetNotesList())
    resetFormFields(['section', 'subsection', 'unit', 'activity'])
    setIsPageStateVariables(true)
    setFirstLoadActity(false)
  }

  const defaultValueActivity = (course_section_path: any, type: string) => {
    const value = course_section_path.find((item: any) => item?.type === type)
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
  const title = !openChooseItem.isOpen
    ? isOpenFilter
      ? 'Filter'
      : 'Course Resource'
    : openChooseItem.name
  const classNameHeader = openChooseItem.isOpen
    ? 'pb-4 border-b border-gray-200 '
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
      rootClassName={'responsive-drawer-center'}
      submitButtonClassName="w-full h-10"
      btnSubmitTile="Confirm"
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

            <div>
              {!isEmpty(notesListData?.notes) ? (
                <>
                  {notesListData?.notes?.map((note: any, index: number) => {
                    const isExpanded = expandedNotes.includes(note?.id)
                    return (
                      <div
                        className="mt-6 border border-[#DCDDDD] p-6 last:mb-6"
                        key={note?.id}
                      >
                        <div
                          className="mb-1.5 flex items-center pb-px"
                          onClick={() => onClose()}
                        >
                          <SappBreadcrumbNotLink
                            paths={[...note?.course_section_path].reverse()}
                          />
                        </div>
                        <div className="text-base font-normal text-[#050505]">
                          <span
                            className={`whitespace-pre-wrap break-all ${
                              isExpanded ? '' : 'line-clamp-3'
                            }`}
                          >
                            {note?.description}
                          </span>
                          {!isExpanded && note?.description?.length > 230 ? (
                            <button
                              className="block text-base font-normal text-[#A1A1A1]"
                              onClick={() => toggleExpand(note?.id)}
                            >
                              Show more
                            </button>
                          ) : (
                            <>
                              {note?.description?.length > 230 ? (
                                <button
                                  className="block text-base font-normal text-[#A1A1A1]"
                                  onClick={() => toggleExpand(note?.id)}
                                >
                                  Show less
                                </button>
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                        </div>
                        <div className="mt-5 flex justify-between">
                          <div className="text-sm font-normal text-[#A1A1A1]">
                            {format(note?.updated_at, 'dd/MM/yyyy HH:mm')}
                          </div>
                          <div className="flex">
                            <div className="relative cursor-pointer">
                              {activityId === note?.course_section_id ? (
                                <span
                                  className="notes-list-icon"
                                  onClick={() => {
                                    if (
                                      !getNotesData.some((item) =>
                                        item.id.includes(note?.id),
                                      )
                                    ) {
                                      handleOpenNote(note, false)

                                      onClose()
                                    }
                                  }}
                                >
                                  <EditIcon />
                                </span>
                              ) : (
                                <>
                                  <div
                                    onClick={async () => {
                                      await router.push({
                                        pathname: `/courses/${queryId || courseId}/activity/${note?.course_section_id}`,
                                        query: {
                                          note_id: note?.id,
                                        },
                                      })
                                      handleOpenNote(note, true)
                                      onClose()
                                    }}
                                  >
                                    <span className="notes-list-icon">
                                      <ViewIcon />
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="ms-4 cursor-pointer">
                              <span
                                onClick={() => {
                                  handleDelete(note?.id)
                                }}
                              >
                                <DeleteIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="flex min-h-[calc(100vh-40rem)] items-center justify-center lg:min-h-[calc(100vh-12rem)]">
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
