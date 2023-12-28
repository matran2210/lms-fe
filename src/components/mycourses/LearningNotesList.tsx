import { DeleteIcon, EditIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useDynamicLoading from 'src/hooks/use-dynamic'
import CourseAPI from 'src/pages/api/courses'
import { ISection } from 'src/type/courses'
import { DEFAULT_SELECT } from 'src/constants'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { resetNotesList } from 'src/redux/slice/Course/NotesList'

const DEFAULT_PAGESIZE = 20

const LearningNotesList = () => {
  //Data fake
  const paths = ['Part A: Audit framework', 'Chapter 1: Audit and']

  const notesListStatus = useAppSelector(
    (state) => state.notesListReducer?.status,
  )
  const dispatch = useAppDispatch()
  const [resources, setResources] = useState<any>()
  const router = useRouter()
  const courseId = router.query.courseId
  const queryId = router.query.id

  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [sections, setSections] = useState<ISection[]>([])

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

  useEffect(() => {
    if (selectedSection?.value === '') {
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    }
  }, [selectedSection?.value])

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
  }

  async function getCourseSections(page_size: number) {
    try {
      const res = await CourseAPI.getCourseSectionList(
        courseId || queryId,
        page_size || DEFAULT_PAGESIZE,
      )
      setSections(res?.data?.sections)
      setSelectedSubsection(null)
      setSelectedUnit(null)
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    if ((courseId || queryId) && notesListStatus) {
      getCourseSections(DEFAULT_PAGESIZE)
    }
  }, [notesListStatus])

  const [subSections, setSubsections] = useState<ISection[]>([])

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

  useEffect(() => {
    if (selectedSection?.value !== '') {
      getCourseSubsections(DEFAULT_PAGESIZE)
    }
  }, [selectedSection])

  const [unit, setUnit] = useState<ISection[]>([])

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

  useEffect(() => {
    getCourseUnit()
  }, [selectedSubsection])

  const [activity, setActivity] = useState<ISection[]>([])

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

  useEffect(() => {
    getCourseActivity(DEFAULT_PAGESIZE)
  }, [selectedUnit])

  const params = cleanParamsAPI({
    sub_id:
      selectedActivity?.value ||
      selectedUnit?.value ||
      selectedSubsection?.value ||
      selectedSection?.value ||
      '',
  })

  useEffect(() => {
    if (notesListStatus && (courseId || queryId)) {
      CourseAPI.getCourseResource(
        courseId || queryId,
        DEFAULT_PAGESIZE,
        params,
      ).then((res) => setResources(res?.data))
    }
  }, [
    notesListStatus,
    selectedSection?.value,
    selectedSubsection?.value,
    selectedUnit?.value,
    selectedActivity?.value,
  ])

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)

  const fetchData = async (params?: Object) => {
    try {
      const res = await CourseAPI.getCourseResource(
        courseId || queryId,
        pageIndex,
        params,
      )
      setResources(res?.data)
      setPageIndex((prevPageIndex) => prevPageIndex + DEFAULT_PAGESIZE)
    } catch (error) {
      // Handle error if needed
    }
  }

  // Attach a scroll event listener to fetch more data when scrolling to the bottom
  useEffect(() => {
    const containerDiv: any = document.getElementById('sapp-drawer') // Replace 'your-container-id' with the actual ID of your container div

    const handleScroll = () => {
      if (
        containerDiv &&
        containerDiv.clientHeight + containerDiv.scrollTop ===
          containerDiv.scrollHeight &&
        (courseId || queryId)
      ) {
        fetchData(params)
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

  return (
    <SappDrawer
      isOpen={notesListStatus}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Notes List"
      footer={false}
    >
      <div className="flex justify-between">
        <HookFormSelect
          className="w-52"
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
          className="w-52"
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
          className="w-52"
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
          className="w-52"
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

      <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
        {/* <Breadcrumb tabs={crumbs} currentPage='1' /> */}
        <div>
          <SappBreadcrumbNotLink paths={paths} />
        </div>
        <div className="mt-6 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year.
        </div>
        <div className="mt-5 flex justify-between">
          <div className="font-normal text-sm text-gray-1">
            23/12/2023 14:45
          </div>
          <div className="flex">
            <div className="cursor-pointer">
              <EditIcon />
            </div>
            <div className="ms-4 cursor-pointer">
              <DeleteIcon />
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
        {/* <Breadcrumb tabs={crumbs} currentPage='1' /> */}
        <div>
          <SappBreadcrumbNotLink paths={paths} />
        </div>
        <div className="mt-6 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year.
        </div>
        <div className="mt-5 flex justify-between">
          <div className="font-normal text-sm text-gray-1">
            23/12/2023 14:45
          </div>
          <div className="flex">
            <div className="cursor-pointer">
              <EditIcon />
            </div>
            <div className="ms-4 cursor-pointer">
              <DeleteIcon />
            </div>
          </div>
        </div>
      </div>
    </SappDrawer>
  )
}

export default LearningNotesList
