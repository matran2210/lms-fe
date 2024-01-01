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
import { DEFAULT_SELECT } from 'src/constants'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList } from 'src/redux/slice/Course/NotesList'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import PreviewNoteList from './PreviewNoteList'

const DEFAULT_PAGESIZE = 20

const LearningNotesList = () => {
  const notesListStatus = useAppSelector(
    (state) => state.notesListReducer?.status,
  )

  const validationSchema = z.object({
    note: z
      .array(z.object({ value: z.string().min(0, VALIDATE_REQUIRED) }))
      .optional(),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

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
  const [showEdit, setShowEdit] = useState<string>()
  const [viewActivity, setViewActivity] = useState<string>()
  const [firstLoadActity, setFirstLoadActity] = useState<boolean>(false)

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
    if (selectedSection?.value !== '') {
      getCourseSubsections(DEFAULT_PAGESIZE)
    }
  }, [selectedSection])

  useEffect(() => {
    getCourseUnit()
  }, [selectedSubsection])

  useEffect(() => {
    getCourseActivity(DEFAULT_PAGESIZE)
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

  // Lấy danh sách notes và fill tự động activity khi lần đầum mở trong activity
  useEffect(() => {
    if (router?.query?.activityId && notesListStatus) {
      CourseAPI.getCourseNotesList(DEFAULT_PAGESIZE, params).then((res) => {
        setNotesListData(res?.data)
        res?.data?.notes?.forEach((note: any, index: number) => {
          setValue(`note.${index}.value`, note?.description)
        })

        const course_section_path = res?.data?.notes[0].course_section_path

        if (res && course_section_path.length > 0) {
          setSelectedSection(defaultValueActivity(course_section_path[3]))
          setSelectedSubsection(defaultValueActivity(course_section_path[2]))
          setTimeout(() => {
            setSelectedUnit(defaultValueActivity(course_section_path[1]))
          }, 500)
          setTimeout(() => {
            setSelectedActivity(defaultValueActivity(course_section_path[0]))
            setFirstLoadActity(true)
          }, 1000)
        }
      })
    } else if (notesListStatus) {
      setFirstLoadActity(true)
    }
  }, [notesListStatus])

  // Lấy danh sách notes khi có sự thay đổi trong notesListStatus, selectedSection, selectedSubsection, selectedUnit, selectedActivity
  useEffect(() => {
    if (notesListStatus && (courseId || queryId) && firstLoadActity) {
      CourseAPI.getCourseNotesList(DEFAULT_PAGESIZE, params).then((res) => {
        setNotesListData(res?.data)
        res?.data?.notes?.forEach((note: any, index: number) => {
          setValue(`note.${index}.value`, note?.description)
        })
        setShowEdit('')
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
        (courseId || queryId)
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

  const defaultValueActivity = (value: any) => {
    const responce = { value: value.id, label: value.name }
    return responce
  }

  async function getCourseSections(page_size: number) {
    try {
      if (!sections.length) {
        const res = await CourseAPI.getCourseSectionList(
          courseId || queryId,
          page_size || DEFAULT_PAGESIZE,
        )
        setSections(res?.data?.sections)
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
      setSubsections(res?.data?.sections)
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
      setUnit(res?.data?.sections)
      setSelectedActivity(null)
    } catch (error) {}
  }

  async function getCourseActivity(page_size: number) {
    try {
      const res = await CourseAPI.getCourseSubsectionList(
        page_size,
        'ACTIVITY',
        selectedUnit.value,
      )
      setActivity(res?.data?.sections)
    } catch (error) {}
  }

  const fetchData = async (params?: Object) => {
    try {
      const res = await CourseAPI.getCourseNotesList(pageIndex, params)
      setNotesListData(res?.data)
      setShowEdit('')
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
    } catch (error) {
      toast.error('Xóa không thành công!')
    }
  }

  const onSubmit = async (data: any, note: any, index: number) => {
    const desUpdate = data?.note[index]?.value
    try {
      const object = {
        name: note?.name,
        description: desUpdate,
      }
      const res = await CourseAPI.updateCourseNotesList(note?.id, object)
      fetchData(params)
      toast.success('Cập nhật thành công!')
    } catch (error) {
      toast.error('Cập nhật không thành công!')
    }
  }

  const closePreview = () => {
    setViewActivity('')
  }

  return (
    <SappDrawer
      isOpen={notesListStatus}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Notes List"
      footer={false}
      drawerSubId={'-notes-list'}
    >
      <div className="flex justify-between gap-4 md:gap-6 flex-wrap md:flex-nowrap">
        <HookFormSelect
          classParent="w-full max-w-52"
          placeholder="Section"
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
            DEFAULT_SELECT.concat(
              sections?.map((section) => ({
                label: section.name,
                value: section.id,
              })),
            )
          }
          onMenuScrollToBottom={handleMenuScrollToSections}
        />
        <HookFormSelect
          classParent="w-full max-w-52"
          placeholder="Subsection"
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
          classParent="w-full max-w-52"
          placeholder="Unit"
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
          classParent="w-full max-w-52"
          placeholder="Activity"
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
        {notesListData?.notes?.map((note: any, index: number) => (
          <div
            className="mt-6 p-6 border border-default last:mb-6"
            key={note?.id}
          >
            <div className="flex items-center mb-6 flex-wrap md:flex-nowrap">
              <SappBreadcrumbNotLink paths={note?.course_section_path} />
            </div>
            <div className="font-normal text-base">
              {showEdit === `note.${index}.value` ? (
                <HookFormTextArea
                  placeholder="Content..."
                  control={control}
                  name={`note.${index}.value`}
                  defaultValue={note?.description}
                  className="w-full h-20 p-1"
                />
              ) : (
                <span>{note?.description}</span>
              )}
            </div>
            <div className="mt-5 flex justify-between">
              <div className="font-normal text-sm text-gray-1">
                {format(note?.updated_at, 'dd/MM/yyyy hh:mm')}
              </div>
              <div className="flex">
                <div className="cursor-pointer relative">
                  {activityId === note?.course_section_id ? (
                    <span
                      className={`notes-list-icon ${
                        showEdit === `note.${index}.value` ? 'active' : ''
                      }`}
                      onClick={() => {
                        if (showEdit !== `note.${index}.value`) {
                          setShowEdit(`note.${index}.value`)
                        } else {
                          handleSubmit((data: any) => {
                            onSubmit(data, note, index)
                          })()
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
        ))}
      </div>
    </SappDrawer>
  )
}

export default LearningNotesList
