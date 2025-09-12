import { DeleteIcon, EllipsisIconV2, PencilV2Icon } from '@assets/icons'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import { cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { ISection } from 'src/type/courses'
import {
  backTypeMap,
  IOpenChooseItem,
  SectionDropdownFormValues,
  SectionField,
  getTypeName,
} from 'src/type/courses-3-level/course'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList } from 'src/redux/slice/Course/ShortCourse/NoteList/ShortNoteList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { debounce, isEmpty } from 'lodash'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { FormProvider, useForm } from 'react-hook-form'
import FilterCourseSection from '@components/courses/note-list/FilterCourseSection'
import { useCourseNoteContext } from 'src/contexts/CourseNoteContext'
import {
  ICourseSectionNoteItem,
  INotesListResponse,
  ICourseSectionPathItem,
} from 'src/type/courses-3-level/activity'
import NoDataV2 from 'src/common/NodataV2'
import SortBy from '@components/common/SortBy'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import ActionCellV2 from '@components/courses/action/ActionCellV2'
import ListFilterMobile from '@components/common/ListFilterMobile'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import { DEFAULT_PAGESIZE, PageLink } from 'src/constants'
import BaseModal from '@components/courses/popup/BaseModal'
import ButtonPrimary from '@components/v2/base/button/ButtonPrimary'
import { AltArrowLeft } from '../icons/AltArrowLeft'

export default function LearningNotesList({
  onClose,
}: {
  onClose?: () => void
}) {
  const { isMobileView } = useTailwindBreakpoint()
  // Use the new slice for selectors
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
  const activityId = router.query.activityId
  const courseSectionId = router.query.course_section_id
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)
  const [firstLoadActity, setFirstLoadActity] = useState<boolean>(false)
  const [expandedNotes, setExpandedNotes] = useState<string[]>([])
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

  // Lấy danh sách notes khi có sự thay đổi trong notesListStatus, selectedSection, selectedSubsection, selectedActivity
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
        ;(notesListData?.meta?.total_records ?? 0) > pageIndex &&
          fetchData(params)
      }
    }

    containerDiv?.addEventListener('scroll', handleScroll)

    return () => containerDiv?.removeEventListener('scroll', handleScroll)
  }, [pageIndex])

  // Use the new resetNotesList action and allow onClose override
  const handleDrawerClose = () => {
    if (onClose) {
      onClose()
    } else {
      document.body.style.overflow = 'auto'
      dispatch(resetNotesList())
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
                  const isEdit = activityId === note?.course_section_id
                  const handleEdit = () => {
                    if (
                      !getNotesData.some((item) => item.id.includes(note?.id))
                    ) {
                      handleOpenNote(note, false)

                      handleDrawerClose()
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
                        <span
                          className={`whitespace-pre-wrap break-all ${
                            isExpanded ? '' : 'line-clamp-3'
                          }`}
                        >
                          {note?.description}
                        </span>
                        {!isExpanded && note?.description?.length > 230 ? (
                          <button
                            className="block text-sm font-normal text-gray-400 md:text-base"
                            onClick={() => toggleExpand(note?.id)}
                          >
                            Show more
                          </button>
                        ) : (
                          <>
                            {note?.description?.length > 230 ? (
                              <button
                                className="block text-sm font-normal text-[#A1A1A1] md:text-base"
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
          closable
        >
          {renderContent()}
        </SappDrawerV3>
      )}
    </>
  )
}
