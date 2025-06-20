/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@assets/icons'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
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
import { CoursesAPI } from 'src/pages/api/courses'
import {
  IResourceDetail,
  SectionDropdownFormValues,
  SectionField,
} from 'src/type/courses'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { isEmpty } from 'lodash'
import NoDataV2 from 'src/common/NodataV2'
import { UploadAPI } from 'src/pages/api/upload'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
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
  const [paramsSubId, setParamsSubId] = useState<string>('')
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

  const onClose = () => {
    document.body.style.overflow = 'auto'
    setOpenResource(false)
    resetFormFields(['section', 'subsection', 'unit', 'activity'])
    setValue('section', null)
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

  return (
    <SappDrawerV3
      open={open}
      handleCancel={onClose}
      title="Course Resource"
      isShowBtnClose
      classNameBody="md:p-0 lg:p-8"
      rootClassName={'responsive-drawer-v3'}
    >
      <FilterCourseSection
        setParams={setParamsSubId}
        heightCustom="h-10"
        isPageStateVariables={isPageStateVariables}
      />

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
