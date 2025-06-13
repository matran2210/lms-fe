/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
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
import NoDataV2 from 'src/common/NodataV2'
import { UploadAPI } from 'src/pages/api/upload'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm } from 'react-hook-form'

interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 20

const LearningResource = ({ open, setOpenResource }: IProps) => {
  const [resources, setResources] = useState<IResourceDetail>()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { control, watch, setValue, reset } = useForm({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })
  const selectedSection = watch('section')
  const selectedSubsection = watch('subsection')
  const selectedUnit = watch('unit')
  const selectedActivity = watch('activity')
  const handleDropdownChange = (
    fieldName: 'section' | 'subsection' | 'unit' | 'activity',
    selected: any,
    fieldsToReset: ('section' | 'subsection' | 'unit' | 'activity')[],
  ) => {
    setValue(fieldName, selected)

    // Reset the downstream dropdowns
    fieldsToReset.forEach((field) => {
      setValue(field, null)
    })
  }

  useEffect(() => {
    if (!selectedSection) {
      setValue('subsection', null)
      setValue('unit', null)
      setValue('activity', null)
    }
  }, [selectedSection])

  const onClose = () => {
    document.body.style.overflow = 'auto'
    setOpenResource(false)
    setValue('subsection', null)
    setValue('unit', null)
    setValue('activity', null)
    setValue('section', null)
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
        setValue('subsection', null)
        setValue('unit', null)
        setValue('activity', null)
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
        selectedSection || '',
        class_id as any,
      )
      setSubsections([...res?.data?.sections].reverse())
      setValue('unit', null)
      setValue('activity', null)
    } catch (error) {}
  }

  useEffect(() => {
    if (selectedSection && open) {
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
        selectedSubsection || '',
        class_id as any,
      )
      setUnit([...res?.data?.sections].reverse())
      setValue('activity', null)
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
        selectedUnit || '',
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
      selectedActivity ||
      selectedUnit ||
      selectedSubsection ||
      selectedSection ||
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
    selectedSection,
    selectedSubsection,
    selectedUnit,
    selectedActivity,
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
    <SappDrawerV3
      open={open}
      handleCancel={onClose}
      title="Course Resource"
      isShowBtnClose
    >
      <div className="grid grid-cols-2 gap-2 md:gap-2 xl:grid-cols-4">
        <SAPPSelectV2
          control={control}
          name="section"
          placeholder="Section"
          options={DEFAULT_SELECT.concat(
            sections?.map((section) => ({
              label: section.name,
              value: section.id,
            })),
          )}
          onChange={(selected) =>
            handleDropdownChange('section', selected, [
              'subsection',
              'unit',
              'activity',
            ])
          }
          size="large"
          onMenuScrollToBottom={handleMenuScrollToSections}
        />

        <SAPPSelectV2
          control={control}
          name="subsection"
          placeholder="Subsection"
          options={
            selectedSection
              ? subSections?.map((s) => ({ label: s.name, value: s.id }))
              : []
          }
          onChange={(selected) =>
            handleDropdownChange('subsection', selected, ['unit', 'activity'])
          }
          size="large"
          onMenuScrollToBottom={handleMenuScrollToSubsections}
        />

        <SAPPSelectV2
          control={control}
          name="unit"
          placeholder="Unit"
          options={
            selectedSubsection
              ? unit?.map((u) => ({ label: u.name, value: u.id }))
              : []
          }
          onChange={(selected) =>
            handleDropdownChange('unit', selected, ['activity'])
          }
          size="large"
          onMenuScrollToBottom={handleMenuScrollToUnit}
        />

        <SAPPSelectV2
          control={control}
          name="activity"
          placeholder="Activity"
          options={
            selectedUnit
              ? activity?.map((a) => ({ label: a.name, value: a.id }))
              : []
          }
          onChange={(selected) =>
            handleDropdownChange('activity', selected, [])
          }
          size="large"
          onMenuScrollToBottom={handleMenuScrollToActivity}
        />
      </div>
      {!isEmpty(resources?.resources) ? (
        <TextSkeleton loading={loading} length={10}>
          {resources?.resources?.map((resource) => (
            <div key={resource.id}>
              <div
                className="mt-6 flex h-[92px] items-center justify-between p-6 last:mb-6"
                style={{ border: '1px solid #DCDDDD' }}
              >
                <div>
                  <div className="text-base font-normal text-[#050505]">
                    {resource?.name}
                  </div>
                  <div className="text-base font-normal text-[#A1A1A1]">
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
          <NoDataV2 />
        </div>
      )}
    </SappDrawerV3>
  )
}

export default LearningResource
