import { DeleteIcon, EditIcon, ViewIcon } from '@assets/icons'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'

import { cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { SectionDropdownFormValues, SectionField } from 'src/type/courses'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import Link from 'next/link'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { useForm } from 'react-hook-form'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'

const DEFAULT_PAGESIZE = 20

const LearningNotesList = () => {
  const notesListStatus = useAppSelector(
    (state) => state.notesListReducer?.status,
  )
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )

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
  const { setValue } = useForm<SectionDropdownFormValues>({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })
  const resetFormFields = (fields: SectionField[]) => {
    fields.forEach((field) => setValue(field, null))
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
            setValue(
              'section',
              defaultValueActivity(course_section_path, 'PART')?.value,
            )
            setValue(
              'subsection',
              defaultValueActivity(course_section_path, 'CHAPTER')?.value,
            )
            // Hiệu ứng fill data vào ô select
            setTimeout(() => {
              setValue(
                'unit',
                defaultValueActivity(course_section_path, 'UNIT')?.value,
              )
            }, 500)
            setTimeout(() => {
              setValue(
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
    dispatch(pushNotes(note))
  }

  return (
    <SappDrawerV3
      open={notesListStatus}
      handleCancel={onClose}
      title="Note List"
      isShowBtnClose
    >
      <FilterCourseSection
        setParams={setCourseSectionId}
        heightCustom="h-10"
        isPageStateVariables={isPageStateVariables}
      />

      <div>
        {!isEmpty(notesListData?.notes) ? (
          <TextSkeleton loading={loading} length={10}>
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
                                handleEditNote(
                                  note?.id,
                                  note?.description,
                                  index,
                                )
                                onClose()
                              }
                            }}
                          >
                            <EditIcon />
                          </span>
                        ) : (
                          <>
                            <Link
                              href={
                                queryId || courseId
                                  ? `/courses/${
                                      queryId || courseId
                                    }/activity/${note?.course_section_id}?note_id=${note?.id}`
                                  : '#'
                              }
                            >
                              <span className="notes-list-icon">
                                <ViewIcon />
                              </span>
                            </Link>
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
          </TextSkeleton>
        ) : (
          <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
            <NoData />
          </div>
        )}
      </div>
    </SappDrawerV3>
  )
}

export default LearningNotesList
