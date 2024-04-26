/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useDynamicLoading from 'src/hooks/use-dynamic'
import { CoursesAPI } from 'src/pages/api/courses'
import { IResourceDetail, ISection } from 'src/type/courses'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { downloadResource } from 'src/pages/api/activity'

interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGESIZE = 20

const LearningResource = ({ open, setOpenResource }: IProps) => {
  const [resources, setResources] = useState<IResourceDetail>()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSubsection, setSelectedSubsection] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

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
    setOpenResource(false)
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

  const [sections, setSections] = useState<ISection[]>([])

  async function getCourseSections(page_size: number) {
    try {
      if (open) {
        const res = await CoursesAPI.getCourseSectionList(
          router.query.courseId || router.query.id,
          page_size || DEFAULT_PAGESIZE,
        )
        setSections([...res?.data?.sections].reverse())
        setSelectedSubsection(null)
        setSelectedUnit(null)
        setSelectedActivity(null)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if ((router.query.courseId || router.query.id) && open) {
      getCourseSections(DEFAULT_PAGESIZE)
    }
  }, [open])

  const [subSections, setSubsections] = useState<ISection[]>([])

  async function getCourseSubsections(page_size: number) {
    try {
      const res = await CoursesAPI.getCourseSubsectionList(
        page_size,
        'CHAPTER',
        selectedSection.value,
      )
      setSubsections([...res?.data?.sections].reverse())
      setSelectedUnit(null)
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    if (selectedSection?.value !== '' && open) {
      getCourseSubsections(DEFAULT_PAGESIZE)
    }
  }, [selectedSection])

  const [unit, setUnit] = useState<ISection[]>([])

  async function getCourseUnit() {
    try {
      const res = await CoursesAPI.getCourseSubsectionList(
        DEFAULT_PAGESIZE,
        'UNIT',
        selectedSubsection.value,
      )
      setUnit([...res?.data?.sections].reverse())
      setSelectedActivity(null)
    } catch (error) {}
  }

  useEffect(() => {
    if (open) {
      getCourseUnit()
    }
  }, [selectedSubsection])

  const [activity, setActivity] = useState<ISection[]>([])

  async function getCourseActivity(page_size: number) {
    try {
      const res = await CoursesAPI.getCourseSubsectionList(
        page_size,
        'ACTIVITY',
        selectedUnit.value,
      )
      setActivity([...res?.data?.sections].reverse())
    } catch (error) {}
  }

  useEffect(() => {
    if (open) {
      getCourseActivity(DEFAULT_PAGESIZE)
    }
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
    if (open && (router.query.courseId || router.query.id)) {
      setLoading(true)
      CoursesAPI.getCourseResource(
        router.query.courseId || router.query.id,
        DEFAULT_PAGESIZE,
        params,
      )
        .then((res) => setResources(res?.data))
        .catch((err) => {})
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    }
  }, [
    open,
    selectedSection?.value,
    selectedSubsection?.value,
    selectedUnit?.value,
    selectedActivity?.value,
  ])

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGESIZE)

  const fetchData = async (params?: Object) => {
    setLoading(true)
    try {
      const res = await CoursesAPI.getCourseResource(
        router.query.courseId || router.query.id,
        pageIndex,
        params,
      )
      setResources(res?.data)
      setPageIndex((prevPageIndex) => prevPageIndex + DEFAULT_PAGESIZE)
    } catch (error) {
      // Handle error if needed
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
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
        (router.query.courseId || router.query.id) &&
        open
      ) {
        ;(resources?.meta?.total_records as Number) > pageIndex &&
          fetchData(params)
      }
    }

    containerDiv?.addEventListener('scroll', handleScroll)

    return () => containerDiv?.removeEventListener('scroll', handleScroll)
  }, [pageIndex])

  const DEFAULT_SELECT = [{ label: 'All Section', value: '' }]

  const download = async (name: string, file_key: string) => {
    await downloadResource({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }

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
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Resource"
      footer={false}
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
            DEFAULT_SELECT.concat(
              sections?.map((section) => ({
                label: (
                  <>
                    <span title={section.name}>{section.name}</span>
                  </>
                ).props.children,
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
                  label: (
                    <>
                      <span title={section.name}>{section.name}</span>
                    </>
                  ).props.children,
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
                  label: (
                    <>
                      <span title={section.name}>{section.name}</span>
                    </>
                  ).props.children,
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
                  label: (
                    <>
                      <span title={section.name}>{section.name}</span>
                    </>
                  ).props.children,
                  value: section.id,
                }))
              : []
          }
          isDisabled={selectedSection?.value === ''}
          onMenuScrollToBottom={handleMenuScrollToActivity}
        />
      </div>
      <TextSkeleton loading={loading} length={10}>
        {resources?.resources?.map((resource) => (
          <div key={resource.id}>
            <div
              className="mt-6 p-6 h-[92px] last:mb-6 flex justify-between items-center"
              style={{ border: '1px solid #DCDDDD' }}
            >
              <div>
                <div className="font-normal text-base text-bw-1">
                  {resource?.name}
                </div>
                <div className="text-gray-1 font-normal text-base">
                  {bytesToKilobyte(resource?.size)}
                </div>
              </div>
              <a
                className="cursor-pointer"
                onClick={() => download(resource.name, resource.file_key)}
              >
                <DownloadIcon />
              </a>
            </div>
          </div>
        ))}
      </TextSkeleton>
    </SappDrawer>
  )
}

export default LearningResource
