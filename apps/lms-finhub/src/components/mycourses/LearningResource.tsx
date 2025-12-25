import { DownloadIcon } from '@lms/assets'
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

const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import { isEmpty } from 'lodash'
import NoDataV2 from 'src/components/common/NodataV2'
import { UploadAPI } from 'src/pages/api/upload'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import { FormProvider, useForm } from 'react-hook-form'
import SortBy from '@components/common/SortBy'
import ListFilterMobile from '@components/common/ListFilterMobile'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import Tooltip from 'src/components/common/Tooltip'
import { useTailwindBreakpoint } from '@lms/hooks'
import { cleanParamsAPI, formatBytes } from '@lms/utils'
import { SappDrawerV3 } from '@lms/ui'
import {
  backTypeMap,
  getTypeName,
  IOpenChooseItem,
  IResourceDetail,
  ISection,
  SectionDropdownFormValues,
  SectionField,
} from '@lms/core'
interface IProps {
  open: boolean
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 20

const LearningResource = ({ open, setOpenResource }: IProps) => {
  const { isMobileView, isTabletView } = useTailwindBreakpoint()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [resources, setResources] = useState<IResourceDetail>()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
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
    sub_id: paramsSubId,
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
  }, [open, paramsSubId])

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
    const handleScroll = () => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      if (scrollTop + clientHeight + 200 >= scrollHeight) {
        if ((router.query.courseId || router.query.id) && open) {
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
                <div className="flex min-h-[calc(100vh-40rem)] items-center justify-center lg:min-h-[calc(100vh-14rem)]">
                  <NoDataV2 />
                </div>
              ) : (
                <div
                  ref={scrollRef}
                  className="mt-6 flex flex-col gap-4 overflow-y-auto pb-3 md:mt-8"
                  style={{
                    height: `calc(100vh - ${heightContent})`,
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
    </>
  )
}

export default LearningResource
