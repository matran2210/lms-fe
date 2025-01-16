/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import useDynamicLoading from 'src/hooks/use-dynamic'
import { CoursesAPI } from 'src/pages/api/courses'
import { IResourceDetail, ISection } from 'src/type/courses'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { UploadAPI } from 'src/pages/api/upload'

interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGE_INDEX = 1
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
    setPageIndex(DEFAULT_PAGE_INDEX)
    setResources(undefined)
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
      const class_id = router.query.courseId || router.query.id
      const res = await CoursesAPI.getCourseSubsectionList(
        page_size,
        'CHAPTER',
        selectedSection.value,
        class_id as any,
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
      const class_id = router.query.courseId || router.query.id
      const res = await CoursesAPI.getCourseSubsectionList(
        DEFAULT_PAGESIZE,
        'UNIT',
        selectedSubsection.value,
        class_id as any,
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
      const class_id = router.query.courseId || router.query.id
      const res = await CoursesAPI.getCourseSubsectionList(
        page_size,
        'ACTIVITY',
        selectedUnit.value,
        class_id as any,
      )
      setActivity([...res?.data?.sections].reverse())
    } catch (error) {}
  }

  useEffect(() => {
    if (open) {
      getCourseActivity(DEFAULT_PAGESIZE)
    }
  }, [selectedUnit])

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX)

  const params = cleanParamsAPI({
    sub_id:
      selectedActivity?.value ||
      selectedUnit?.value ||
      selectedSubsection?.value ||
      selectedSection?.value ||
      '',
    page_index: DEFAULT_PAGE_INDEX,
    page_size: DEFAULT_PAGESIZE,
  })

  useEffect(() => {
    const initFetchData = async () => {
      if (open && (router.query.courseId || router.query.id)) {
        setLoading(true)
        try {
          const resources = await CoursesAPI.getCourseResource(
            router.query.courseId || router.query.id,
            params,
          )
          setPageIndex(DEFAULT_PAGE_INDEX)
          setResources(resources.data)
        } catch (err) {
        } finally {
          setTimeout(() => {
            setLoading(false)
          }, 500)
        }
      }
    }
    initFetchData()
  }, [
    open,
    selectedSection?.value,
    selectedSubsection?.value,
    selectedUnit?.value,
    selectedActivity?.value,
  ])

  const requestOngoingRef = useRef(false)
  const fetchData = async (nextPageIndex: number) => {
    setLoading(true)
    try {
      if (requestOngoingRef.current) return
      requestOngoingRef.current = true
      params.page_index = nextPageIndex
      const res = await CoursesAPI.getCourseResource(
        router.query.courseId || router.query.id,
        params,
      )

      if (resources && res?.data.resources) {
        setResources((prevResources: any) => ({
          ...prevResources,
          resources: [...prevResources.resources, ...res.data.resources],
        }))
        setPageIndex(nextPageIndex)
        requestOngoingRef.current = false
      }
    } catch (error) {
      // Handle error if needed
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    const divElement = document.getElementById('sapp-drawer-resource-list')
    if (!divElement) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = divElement
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        if ((router.query.courseId || router.query.id) && open) {
          const nextPageIndex = pageIndex + 1
          if (Number(resources?.meta?.total_pages) >= nextPageIndex) {
            fetchData(nextPageIndex)
          }
        }
      }
    }
    divElement.addEventListener('scroll', handleScroll)
    // Cleanup function
    return () => {
      divElement.removeEventListener('scroll', handleScroll)
    }
  }, [fetchData, pageIndex])

  const DEFAULT_SELECT = [{ label: 'All Section', value: '' }]

  const download = async (name: string, file_key: string) => {
    await UploadAPI.downloadFile({
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
      drawerSubId={'-resource-list'}
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="Resource"
      footer={false}
      confirmOnClose={false}
      heightBody={'h-[calc(100vh-7rem)]'}
    >
      <div className="mt-2 grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
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
      {!isEmpty(resources?.resources) ? (
        <TextSkeleton loading={loading} length={10}>
          {resources?.resources?.map((resource) => (
            <div key={resource.id}>
              <div
                className="mt-6 flex h-[5.75rem] items-center justify-between p-6 last:mb-6"
                style={{ border: '0.0625rem solid #DCDDDD' }}
              >
                <div>
                  <div className="text-base font-normal text-bw-1">
                    {resource?.name}
                  </div>
                  <div className="text-base font-normal text-gray-1">
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
      ) : (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoData />
        </div>
      )}
    </SappDrawer>
  )
}

export default LearningResource
