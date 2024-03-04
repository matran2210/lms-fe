import { DeleteIcon, EditIcon, ViewIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { Dispatch, useEffect, useState } from 'react'
import useDynamicLoading from 'src/hooks/use-dynamic'
import CourseAPI from 'src/pages/api/courses'
import { ISection } from 'src/type/courses'
import { DEFAULT_SELECT_SECTION } from 'src/constants'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import PreviewNoteList from './PreviewNoteList'
import { v4 as uuidv4 } from 'uuid'

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
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [sections, setSections] = useState<ISection[]>([])
  const [subSections, setSubsections] = useState<ISection[]>([])
  const [unit, setUnit] = useState<ISection[]>([])
  const [activity, setActivity] = useState<ISection[]>([])
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)
  const [viewActivity, setViewActivity] = useState<string>()
  const [firstLoadActity, setFirstLoadActity] = useState<boolean>(false)
  const [expandedNotes, setExpandedNotes] = useState<any>([])

  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prevExpanded: any) => {
      if (prevExpanded.includes(noteId)) {
        // Nếu noteId đã trong mảng, loại bỏ nó
        return prevExpanded.filter((id: string) => id !== noteId)
      } else {
        // Nếu noteId chưa có trong mảng, thêm nó vào
        return [...prevExpanded, noteId]
      }
    })
  }

  // Set default change section all
  useEffect(() => {
    if (selectedSection?.value === '') {
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
  }, [selectedSection?.value])

  //Change dropdown
  useEffect(() => {
    if ((courseId || queryId) && notesListStatus) {
      getCourseSections(DEFAULT_PAGESIZE)
    }
  }, [notesListStatus])

  useEffect(() => {
    if (selectedSection?.value !== '' && notesListStatus) {
      getCourseSubsections(DEFAULT_PAGESIZE)
    }
  }, [selectedSection])

  useEffect(() => {
    if (notesListStatus) {
      getCourseUnit()
    }
  }, [selectedSubsection])

  useEffect(() => {
    if (notesListStatus) {
      getCourseActivity(DEFAULT_PAGESIZE)
    }
  }, [selectedUnit])

  const params = cleanParamsAPI({
    course_id: courseId || queryId,
    course_section_id:
      selectedActivity?.value ||
      selectedUnit?.value ||
      selectedSubsection?.value ||
      selectedSection?.value ||
      '',
  })

  // Lấy danh sách notes và fill tự động activity khi lần đầu mở trong activity
  useEffect(() => {
    const objectParams = cleanParamsAPI({
      course_id: courseId || queryId,
      course_section_id: activityId || '',
    })

    if (router?.query?.activityId && notesListStatus) {
      CourseAPI.getCourseNotesList(DEFAULT_PAGESIZE, objectParams).then(
        (res) => {
          setNotesListData(res?.data)
          const course_section_path = res?.data?.notes[0]?.course_section_path

          if (res && course_section_path?.length > 0) {
            setSelectedSection(
              defaultValueActivity(course_section_path, 'PART'),
            )
            setSelectedSubsection(
              defaultValueActivity(course_section_path, 'CHAPTER'),
            )
            // Hiệu ứng fill data vào ô select
            setTimeout(() => {
              setSelectedUnit(defaultValueActivity(course_section_path, 'UNIT'))
            }, 500)
            setTimeout(() => {
              setSelectedActivity(
                defaultValueActivity(course_section_path, 'ACTIVITY'),
              )
              setFirstLoadActity(true)
            }, 1000)
          }
        },
      )
    } else if (notesListStatus) {
      setFirstLoadActity(true)
    }
  }, [notesListStatus])

  // Lấy danh sách notes khi có sự thay đổi trong notesListStatus, selectedSection, selectedSubsection, selectedUnit, selectedActivity
  useEffect(() => {
    if (notesListStatus && (courseId || queryId) && firstLoadActity) {
      CourseAPI.getCourseNotesList(DEFAULT_PAGESIZE, params).then((res) => {
        setNotesListData(res?.data)
        setViewActivity('')
      })
    }
  }, [
    notesListStatus,
    selectedSection?.value,
    selectedSubsection?.value,
    selectedUnit?.value,
    selectedActivity?.value,
    firstLoadActity,
  ])

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

  const {
    handleMenuScrollToBottom: handleMenuScrollToSections,
    setPage: setPageSection,
  } = useDynamicLoading(getCourseSections, DEFAULT_PAGESIZE)

  const {
    handleMenuScrollToBottom: handleMenuScrollToSubsections,
    setPage: setPageSubsection,
  } = useDynamicLoading(getCourseSubsections, DEFAULT_PAGESIZE)
  const {
    handleMenuScrollToBottom: handleMenuScrollToUnit,
    setPage: setPageUnit,
  } = useDynamicLoading(getCourseUnit, DEFAULT_PAGESIZE)
  const {
    handleMenuScrollToBottom: handleMenuScrollToActivity,
    setPage: setPageActivity,
  } = useDynamicLoading(getCourseActivity, DEFAULT_PAGESIZE)

  const handleDropdownChange = (
    selectedOption: any,
    setFunction: any,
    resetFunction: any,
  ) => {
    setFunction(selectedOption)

    // Reset the downstream dropdowns if a reset function is provided
    if (resetFunction) {
      resetFunction(null)
    }
  }

  const onClose = () => {
    document.body.style.overflow = 'auto'
    dispatch(resetNotesList())
    setSelectedSubsection(null)
    setSelectedUnit(null)
    setSelectedActivity(null)
    setSelectedSection(null)
    const pageStateVariables = [
      setPageSection,
      setPageSubsection,
      setPageUnit,
      setPageActivity,
    ]
    pageStateVariables.forEach((setPageVariable) => {
      setPageVariable(DEFAULT_PAGESIZE * 2)
    })
    setFirstLoadActity(false)
  }

  const defaultValueActivity = (course_section_path: any, type: string) => {
    const value = course_section_path.find((item: any) => item?.type === type)
    const responce = { value: value.id, label: value.name }
    return responce
  }

  async function getCourseSections(page_size: number) {
    try {
      if (!sections.length && notesListStatus) {
        const res = await CourseAPI.getCourseSectionList(
          courseId || queryId,
          page_size || DEFAULT_PAGESIZE,
        )
        setSections([...res?.data?.sections].reverse())
        setSelectedSubsection(null)
        setSelectedUnit(null)
        setSelectedActivity(null)
      }
    } catch (error) {}
  }

  async function getCourseSubsections(page_size: number) {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        page_size,
        'CHAPTER',
        selectedSection.value,
      )
      setSubsections([...res?.data?.sections].reverse())
      setSelectedUnit(null)
      setSelectedActivity(null)
    } catch (error) {}
  }

  async function getCourseUnit() {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        DEFAULT_PAGESIZE,
        'UNIT',
        selectedSubsection.value,
      )
      setUnit([...res?.data?.sections].reverse())
      setSelectedActivity(null)
    } catch (error) {
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
  }

  async function getCourseActivity(page_size: number) {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        page_size,
        'ACTIVITY',
        selectedUnit.value,
      )
      setActivity([...res?.data?.sections].reverse())
    } catch (error) {
      setSelectedActivity(null)
    }
  }

  const fetchData = async (params?: Object) => {
    try {
      const res = await CourseAPI.getCourseNotesList(pageIndex, params)
      setNotesListData(res?.data)
      setViewActivity('')
      setPageIndex((prevPageIndex) => prevPageIndex + DEFAULT_PAGESIZE)
    } catch (error) {
      // Handle error if needed
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await CourseAPI.deleteCourseNoteList(id)
      fetchData(params)
      toast.success('Xóa thành công!')
    } catch (error) {}
  }

  const closePreview = () => {
    setViewActivity('')
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
    <SappDrawer
      isOpen={notesListStatus}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Notes List"
      footer={false}
      drawerSubId={'-notes-list'}
      confirmOnClose={false}
      heightBody={'h-[calc(100vh-112px)]'}
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Section"
          isClearable={true}
          value={selectedSection}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedSection,
              setSelectedSubsection,
            )
          }
          options={
            sections &&
            DEFAULT_SELECT_SECTION.concat(
              sections?.map((section) => ({
                label: section.name,
                value: section.id,
              })),
            )
          }
          onMenuScrollToBottom={handleMenuScrollToSections}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Subsection"
          isClearable={true}
          value={selectedSubsection}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedSubsection,
              setSelectedUnit,
            )
          }
          options={
            selectedSection
              ? subSections?.map((section) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
          onMenuScrollToBottom={handleMenuScrollToSubsections}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Unit"
          isClearable={true}
          value={selectedUnit}
          onChange={(selectedOption) =>
            handleDropdownChange(
              selectedOption,
              setSelectedUnit,
              setSelectedActivity,
            )
          }
          options={
            selectedSubsection
              ? unit?.map((section) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
          onMenuScrollToBottom={handleMenuScrollToUnit}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Activity"
          isClearable={true}
          value={selectedActivity}
          onChange={(selectedOption) =>
            handleDropdownChange(selectedOption, setSelectedActivity, null)
          }
          options={
            selectedUnit
              ? activity?.map((section) => ({
                  label: section.name,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
          onMenuScrollToBottom={handleMenuScrollToActivity}
        />
      </div>

      <div>
        {notesListData?.notes?.map((note: any, index: number) => {
          const isExpanded = expandedNotes.includes(note?.id)
          return (
            <div
              className="mt-6 p-6 border border-default last:mb-6"
              key={note?.id}
            >
              <div
                className="flex items-center mb-1.5 pb-px"
                onClick={() => onClose()}
              >
                <SappBreadcrumbNotLink
                  paths={[...note?.course_section_path].reverse()}
                />
              </div>
              <div className="font-normal text-base text-bw-1">
                <span
                  className={`whitespace-pre-wrap ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {note?.description}
                </span>
                {!isExpanded && note?.description?.length > 230 ? (
                  <button
                    className="block font-normal text-base text-gray-1"
                    onClick={() => toggleExpand(note?.id)}
                  >
                    Show more
                  </button>
                ) : (
                  <>
                    {note?.description?.length > 230 ? (
                      <button
                        className="block font-normal text-base text-gray-1"
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
                <div className="font-normal text-sm text-gray-1">
                  {format(note?.updated_at, 'dd/MM/yyyy HH:mm')}
                </div>
                <div className="flex">
                  <div className="cursor-pointer relative">
                    {activityId === note?.course_section_id ? (
                      <span
                        className="notes-list-icon"
                        onClick={() => {
                          if (
                            !getNotesData.some((item) =>
                              item.id.includes(note?.id),
                            )
                          ) {
                            handleEditNote(note?.id, note?.description, index)
                            onClose()
                          }
                        }}
                      >
                        <EditIcon />
                      </span>
                    ) : (
                      <>
                        {viewActivity === `note.${index}.value` && (
                          <PreviewNoteList
                            title={note?.name}
                            content={note?.description}
                            setOpen={closePreview}
                          />
                        )}
                        <span
                          className="notes-list-icon"
                          onClick={() => {
                            setViewActivity(`note.${index}.value`)
                          }}
                        >
                          <ViewIcon />
                        </span>
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
      </div>
    </SappDrawer>
  )
}

export default LearningNotesList
