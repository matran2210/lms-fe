/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import { SappDrawerV3 } from '@lms/ui'
import { formatBytes, cleanParamsAPI } from '@lms/utils'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import {
  IResourceDetail,
  SectionDropdownFormValues,
  SectionField,
  IOpenChooseItem,
  backTypeMap,
  getTypeName,
  ISection,
} from '@lms/core'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { UploadAPI } from 'src/pages/api/upload'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import { FormProvider, useForm } from 'react-hook-form'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import SortBy from '@components/common/SortBy'
import ListFilterMobile from '@components/common/ListFilterMobile'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import Tooltip from 'src/common/Tooltip'
import { PageLink } from '@lms/core'
interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 20

const LearningResource = ({ open, setOpenResource }: IProps) => {
  const { isMobileView, isTabletView, isAlwaysShowSidebar } =
    useTailwindBreakpoint()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [resources, setResources] = useState<IResourceDetail>()
  const router = useRouter()
  //Tạo các biến để lấy id trên thanh url
  const isCourseDetail = PageLink.COURSE_DETAIL === router.pathname
  const isCoursePartDetail = router.pathname.includes('/section')
  const isActivityDetail = router.pathname.includes('/activity')
  const courseId = router.query?.courseId
  const queryId = router.query?.id
  const activityId = router.query?.activityId
  const chapterId = router.query?.chapter
  const unitId = router.query?.unit
  const courseSectionId = router.query.course_section_id

  const [loading, setLoading] = useState<boolean>(false)
  const [isFirstCallApi, setIsFirstCallApi] = useState(false)
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

  const [paramsSubId, setParamsSubId] = useState<string>('')
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

  const onClose = () => {
    document.body.style.overflow = 'auto'
    setOpenResource(false)
    resetFormFields(['section', 'subsection', 'unit', 'activity'])
    methods.setValue('section', null)
    setPageIndex(DEFAULT_PAGE_INDEX)
    setResources(undefined)
    setIsPageStateVariables(true)
  }

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX)

  const params = cleanParamsAPI({
    sub_id: isFirstCallApi
      ? paramsSubId
      : activityId || chapterId || courseSectionId || '',
    page_index: DEFAULT_PAGE_INDEX,
    page_size: DEFAULT_PAGESIZE,
  })

  // Thêm cờ để tránh call duplicate api
  const isFetchingRef = useRef(false)

  useEffect(() => {
    const initFetchData = async () => {
      // Kiểm tra điều kiện gọi API
      const hasValidId = params.sub_id || courseId || queryId
      if (!hasValidId || !open || isFetchingRef.current) return

      isFetchingRef.current = true
      setLoading(true)

      try {
        const resources = await CoursesAPI.getCourseResource(
          courseId || queryId,
          params,
        )

        setPageIndex(DEFAULT_PAGE_INDEX)
        setResources(resources.data)

        // Các điều kiện không auto fill filter
        if (isFirstCallApi && !paramsSubId) return
        if (isCourseDetail || paramsSubId) return

        // Logic auto fill filter
        const fieldMap: Record<string, any> = {
          section: courseSectionId,
          subsection: chapterId,
          unit: unitId,
          activity: activityId,
        }

        const fieldsToSet = isActivityDetail // Đối với màn activity fill all
          ? ['section', 'subsection', 'unit', 'activity']
          : isCoursePartDetail // Đối với màn course part detail fill section và subsection
            ? ['section', 'subsection']
            : [] // Đối với màn course detail không fill

        fieldsToSet.forEach((field) => {
          const value = fieldMap[field]
          methods.setValue(
            field as 'section' | 'subsection' | 'unit' | 'activity',
            Array.isArray(value) ? (value?.[0] ?? null) : (value ?? null),
          )
        })
      } catch (err) {
      } finally {
        // Đảm bảo reset trạng thái sau khi API hoàn tất
        setIsFirstCallApi(true)
        isFetchingRef.current = false
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }

    initFetchData()
  }, [open, paramsSubId, router])

  const requestOngoingRef = useRef(false)
  const fetchData = async (nextPageIndex: number) => {
    setLoading(true)
    try {
      if (requestOngoingRef.current) return
      requestOngoingRef.current = true
      params.page_index = nextPageIndex
      const res = await CoursesAPI.getCourseResource(
        courseId || queryId,
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
    const handleScroll = () => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      if (scrollTop + clientHeight + 200 >= scrollHeight) {
        if ((courseId || queryId) && open) {
          const nextPageIndex = pageIndex + 1
          if (Number(resources?.meta?.total_pages) >= nextPageIndex) {
            fetchData(nextPageIndex)
          }
        }
      }
    }

    const scrollEl = scrollRef.current
    scrollEl?.addEventListener('scroll', handleScroll)
    return () => scrollEl?.removeEventListener('scroll', handleScroll)
  }, [fetchData, pageIndex])

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

  const title = !openChooseItem.isOpen
    ? isOpenFilter
      ? 'Filter'
      : 'Course Resource'
    : openChooseItem.name
  const classNameHeader = openChooseItem.isOpen
    ? 'pb-4 border-b border-gray-200'
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
    setParamsSubId(openChooseItem.params || '')
    setOpenChooseItem({
      ...openChooseItem,
      isOpen: false,
    })
  }
  const heightContent = isMobileView
    ? '120px'
    : isTabletView
      ? '128px'
      : '136px'

  const getSize = (size: number) => formatBytes(size)

  useEffect(() => {
    if (!open) {
      setIsFirstCallApi(false)
      setResources(undefined)
    }
  }, [open])

  return (
    <>
      <SappDrawerV3
        open={open}
        handleCancel={onClose}
        title={title}
        isShowBtnClose
        closable
        isShowBtnBack={isOpenFilter}
        handleBack={handleBack}
        isShowFooter={isOpenFilter}
        handleSubmit={handleSubmit}
        classNameHeader={classNameHeader}
        rootClassName={'responsive-drawer-base'}
        submitButtonClassName="w-full h-10"
        btnSubmitTile="Confirm"
        titleClassName={isOpenFilter ? 'w-full pr-8 text-center' : ''}
        placement={!isAlwaysShowSidebar ? 'bottom' : 'right'}
      >
        <FormProvider {...methods}>
          {!isOpenFilter ? (
            <>
              {isMobileView ? (
                <SortBy action={() => setIsOpenFilter(true)} />
              ) : (
                <FilterCourseSection
                  setParams={setParamsSubId}
                  heightCustom="h-10"
                  isPageStateVariables={isPageStateVariables}
                />
              )}
              {isEmpty(resources?.resources) && !loading ? (
                <div className="flex min-h-[200px] items-center justify-center md:min-h-[385px] lg:min-h-[calc(100vh-20rem)]">
                  <NoData />
                </div>
              ) : (
                <div
                  ref={scrollRef}
                  className="mt-6 flex flex-col gap-4 overflow-y-auto md:mt-8"
                  style={{
                    maxHeight: `calc(100% - ${heightContent})`,
                  }}
                >
                  {resources?.resources?.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between gap-6 rounded-lg bg-gray-100 px-4 py-3 hover:bg-primary-50"
                    >
                      <div>
                        <div className="line-clamp-2 break-all text-base font-medium text-gray-800">
                          <Tooltip title={resource?.name}>
                            {resource?.name}
                          </Tooltip>
                        </div>
                        <div className="text-sm font-normal text-gray">
                          {getSize(resource?.size)}
                        </div>
                      </div>
                      <a
                        className="cursor-pointer hover:text-primary"
                        onClick={() =>
                          download(resource.name, resource.file_key)
                        }
                      >
                        <DownloadIcon />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : !openChooseItem.isOpen ? (
            <ListFilterMobile
              setOpenChooseItem={setOpenChooseItem}
              listSection={listSection}
              listSubsection={listSubsection}
              listUnit={listUnit}
              listActivity={listActivity}
              setListSection={setListSection}
              setListSubsection={setListSubsection}
              setListUnit={setListUnit}
              setListActivity={setListActivity}
            />
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
    </>
  )
}

export default LearningResource
