import {
  CloseNone,
  DownloadMinimalistic,
  OutlineText,
  OutlineVideo,
} from '@assets/icons'
import { bytesToKilobyte, cleanParamsAPI } from '@utils/index'
import getConfig from 'next/config'
import { useEffect, useState, useCallback } from 'react'
import { IResourceDetail, IResource } from 'src/type/courses'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { UploadAPI } from 'src/pages/api/upload'
import { useForm } from 'react-hook-form'
import { useMasterFinanceContext } from '@contexts/MasterFinance'
import { useRouter } from 'next/router'
import useSelectFilterV2 from 'src/hooks/useSelectFilterV2'
import { CoursesAPI } from 'src/pages/api/courses'
import SAPPSelectV3 from '../select/SAPPSelectV3'
import SAPPDrawerV3 from '../drawer/SAPPDrawerV3'

const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

const getIconResource = (fileName: string): JSX.Element => {
  const fileExtension = fileName.split('.').pop() || ''
  if (
    ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mpeg', 'mpg', 'm4v'].includes(
      fileExtension,
    )
  )
    return <OutlineVideo />
  return <OutlineText />
}

const DEFAULT_SECTION_OPTION = {
  label: 'All Section',
  value: '',
}

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 10

type CourseResourceFormType = {
  section?: string
  subsection?: string
  activity?: string
}

const CourseResource: React.FC = () => {
  const { isOpenCourseResource, setIsOpenCourseResource } =
    useMasterFinanceContext()
  const [resources, setResources] = useState<IResourceDetail | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const { control, watch, getValues, setValue, reset } =
    useForm<CourseResourceFormType>({
      defaultValues: {
        section: undefined,
        subsection: undefined,
        activity: undefined,
      },
    })
  const router = useRouter()
  const courseId = (router.query.courseId || router.query.id || '') as string

  const section = watch('section')
  const subsection = watch('subsection')
  const activity = watch('activity')

  // Section select
  const {
    dataList: sectionDataList,
    getData: getSections,
    debounceGetData: debounceGetSections,
    handleNextPage: handleNextSectionsPage,
  } = useSelectFilterV2({
    fetchAPI: ({ page_index, page_size }) =>
      CoursesAPI.getCourseSectionList(courseId, page_size, page_index),
    queryKey: 'sections',
  })

  // Subsection select
  const {
    dataList: subsectionDataList,
    setDataList: setSubsectionDataList,
    debounceGetData: debounceGetSubsections,
    handleNextPage: handleNextSubsectionsPage,
  } = useSelectFilterV2({
    fetchAPI: ({ page_index, page_size }) =>
      CoursesAPI.getCourseSubsectionList(
        page_size,
        'CHAPTER',
        section,
        courseId,
        page_index,
      ),
    queryKey: 'sections',
  })

  // Activity select
  const {
    dataList: activityDataList,
    setDataList: setActivityDataList,
    debounceGetData: debounceGetActivities,
    handleNextPage: handleNextActivitiesPage,
  } = useSelectFilterV2({
    fetchAPI: ({ page_index, page_size }) =>
      CoursesAPI.getCourseSubsectionList(
        page_size,
        'ACTIVITY',
        subsection,
        courseId,
        page_index,
      ),
    queryKey: 'sections',
  })

  useEffect(() => {
    if (!isOpenCourseResource) return

    const fetchData = async () => {
      getSections()
    }

    fetchData()
  }, [isOpenCourseResource])

  useEffect(() => {
    if (!isOpenCourseResource) return

    const getResources = async () => {
      const params = cleanParamsAPI({
        sub_id:
          getValues('activity') ||
          getValues('subsection') ||
          getValues('section'),
        page_index: DEFAULT_PAGE_INDEX,
        page_size: DEFAULT_PAGESIZE,
      })

      setLoading(true)
      const res = await CoursesAPI.getCourseResource(
        router.query.courseId || router.query.id,
        params,
      )
      setResources(res.data)
      setLoading(false)
    }

    getResources()
  }, [section, subsection, activity])

  const onClose = useCallback(() => {
    setIsOpenCourseResource(false)
    reset()
  }, [setIsOpenCourseResource, reset])

  const download = useCallback(async (name: string, file_key: string) => {
    await UploadAPI.downloadFile({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }, [])

  useEffect(() => {
    setValue('subsection', undefined)
    setValue('activity', undefined)
    setSubsectionDataList((prev) => ({
      ...prev,
      data: [],
    }))
    setActivityDataList((prev) => ({
      ...prev,
      data: [],
    }))
  }, [section])

  useEffect(() => {
    setValue('activity', undefined)
    setActivityDataList((prev) => ({
      ...prev,
      data: [],
    }))
  }, [subsection])

  return (
    <SAPPDrawerV3
      open={isOpenCourseResource}
      handleCancel={onClose}
      title="Course Resource"
      footer
      rootClassName="learning-resource-drawer"
      className="rounded-2xl"
      width={673}
      customTitle={
        <div className="flex items-center justify-between p-8">
          <div className="text-2xl font-semibold text-bw-1">
            Course Resource
          </div>
          <div className="cursor-pointer" onClick={onClose}>
            <CloseNone />
          </div>
        </div>
      }
      contentClassName="pt-0"
    >
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        <SAPPSelectV3
          control={control}
          name="section"
          placeholder="Section"
          className="h-11"
          defaultValue={''}
          onFocus={() => debounceGetSections()}
          options={[
            DEFAULT_SECTION_OPTION,
            ...sectionDataList.data?.map((e) => ({
              value: e.id,
              label: e.name,
            })),
          ]}
          onMenuScrollToBottom={handleNextSectionsPage}
        />
        <SAPPSelectV3
          control={control}
          name="subsection"
          placeholder="Subsection"
          className="h-11"
          defaultValue={subsection}
          onFocus={() => debounceGetSubsections()}
          options={subsectionDataList.data?.map((e) => ({
            value: e.id,
            label: e.name,
          }))}
          disabled={!section}
          onMenuScrollToBottom={handleNextSubsectionsPage}
        />
        <SAPPSelectV3
          control={control}
          name="activity"
          placeholder="Activity"
          className="h-11"
          defaultValue={activity}
          onFocus={() => debounceGetActivities()}
          options={activityDataList.data?.map((e) => ({
            value: e.id,
            label: e.name,
          }))}
          disabled={!subsection}
          onMenuScrollToBottom={handleNextActivitiesPage}
        />
      </div>
      {!isEmpty(resources?.resources) ? (
        <TextSkeleton loading={loading} length={10}>
          <div className="mt-8 flex flex-col gap-y-4">
            {resources?.resources?.map((resource: IResource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between rounded-lg bg-shade-text-100 px-4 py-3 hover:bg-shade-primary-50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-x-3">
                  {getIconResource(resource?.name)}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-medium text-shade-text-800">
                      {resource?.name}
                    </div>
                    <div className="text-sm font-normal text-shade-text-500">
                      {bytesToKilobyte(resource?.size, 'kb')}
                    </div>
                  </div>
                </div>
                <a
                  className="ml-3 flex-shrink-0 font-bold text-shade-icon hover:text-shade-primary-500"
                  onClick={() => download(resource.name, resource.file_key)}
                >
                  <DownloadMinimalistic />
                </a>
              </div>
            ))}
          </div>
        </TextSkeleton>
      ) : (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoData />
        </div>
      )}
    </SAPPDrawerV3>
  )
}

export default CourseResource
