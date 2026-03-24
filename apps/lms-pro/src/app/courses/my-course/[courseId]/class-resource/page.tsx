'use client'
import { UserType, useCourseContext } from '@lms/contexts'
import {
  AppType,
  CLASS_SUFFIX_TYPE_FILTER,
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IClassResource,
  IClassScheduleForResource,
  IListClassResourceParams,
} from '@lms/core'
import { useSappPaging, useTailwindBreakpoint } from '@lms/hooks'
import {
  CarouselSlideAnimation,
  ClassResourceSkeleton,
  HeaderMobile,
  Layout,
  ListFilterItemMobileBase,
  ListFilterMobileBase,
  NoCoursesAvailable,
  SappBreadCrumbs,
  SappDrawerV3,
} from '@lms/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import { withAuthorization } from '@lms/hoc'
import ClassResourceTable from './ClassResourceTable'
import FilterClassResource from './FilterClassResource'
import SearchClassResource from './SearchClassResource'
import { buildQueryString, normalizeToArray } from '@lms/utils'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'
import { ClassAPI } from 'src/api/class'
import { FilterCourseIcon } from '@lms/assets'
import CardFileItem from './CardFileItem'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'
import { getSelectOptions, pushQueryClassResource } from '@utils/helpers'
interface ISelectItem {
  label: string
  value: string
}
const ClassResource = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const param = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const { isAlwaysShowSidebar, isMobileView, isTabletView } =
    useTailwindBreakpoint()
  const [showSidebar, setShowSidebar] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)
  const [listClassResourceMobile, setListClassResourceMobile] = useState<
    IClassResource[]
  >([])
  const [openChooseItem, setOpenChooseItem] = useState(false)
  const isFirstRenderListSchedule = useRef(true)
  const [listFilterItem, setListFilterItem] = useState<ISelectItem[]>([])
  const [isFirstLoadingMobile, setIsFirstLoadingMobile] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, ISelectItem | ISelectItem[]>
  >({
    Type: { label: '', value: '' },
    Lesson: [],
  })
  const [paginationMobile, setPaginationMobile] = useState<{
    current: number
    total: number
  }>({
    current: DEFAULT_PAGE_NUMBER,
    total: 0,
  })
  const [direction, setDirection] = useState<1 | -1>(1)
  const observer = useRef<IntersectionObserver>()
  const { setOpenSidebar } = useCourseContext()
  const pathname = usePathname()
  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })
  const LIST_TAB_FILTER = [
    {
      label: 'Type',
      value: 'Type',
    },
    {
      label: 'Lesson',
      value: 'Lesson',
    },
  ]
  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseDetail(
      param.courseId,
      pageParam || 1,
      DEFAULT_PAGE_SIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }
  // Để map schedule_ids từ string các id thành mảng các id
  const mapParams = useMemo(() => {
    let scheduleIds: string[] = []
    if (query.schedule_ids) {
      scheduleIds = query.schedule_ids.includes(',')
        ? query.schedule_ids
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id)
        : [query.schedule_ids]
    }
    return {
      ...params,
      schedule_ids: scheduleIds,
    }
  }, [params, query.schedule_ids])

  const { data, pagination, setPagination, isLoading } = useSappPaging({
    uniqueKey: ClassKey.ClassResource,
    queryFn: () =>
      ClassAPI.getClassResource(param.courseId as string, mapParams),
    params,
  })

  const paramsCourseDetail = {
    user_section_learning_status:
      query.user_section_learning_status || undefined,
  }

  const { data: courseData } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) =>
      fetchCourseDetail({ pageParam, params: paramsCourseDetail }),
    refetchOnWindowFocus: true,
    retry: false,
  })

  const {
    classSchedule,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingClassSchedule,
  } = useSelectClassSchedule(param.courseId as string, '', true)

  const scheduleOptions = useMemo(() => {
    return getSelectOptions(
      classSchedule.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    )
  }, [classSchedule])

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page_index: query.page_index
        ? Number(query.page_index)
        : DEFAULT_PAGE_NUMBER,
      page_size: query.page_size ? Number(query.page_size) : DEFAULT_PAGE_SIZE,
      suffix_types: normalizeToArray(query.suffix_types),
      schedule_ids: normalizeToArray(query.schedule_ids),

      search_key:
        typeof query.search_key === 'string' ? query.search_key : undefined,
    }))
  }, [
    query.page_index,
    query.suffix_types,
    query.schedule_ids,
    query.search_key,
    query.page_size,
  ])

  const handleOpenSidebar = () => {
    setShowSidebar(true)
    setOpenSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }
  const [titleFilterMobile, setTitleFilterMobile] = useState<string>('Filter')

  const handleSelectItemFilter = (item: object | object[]) => {
    const isMultiSelect = titleFilterMobile === 'Lesson'

    if (isMultiSelect) {
      setSelectedFilters(
        (prev: Record<string, ISelectItem | ISelectItem[]>) => ({
          ...prev,
          [titleFilterMobile as string]: item as ISelectItem[],
        }),
      )
    } else {
      setDirection(-1)
      setOpenChooseItem(false)
      setTitleFilterMobile('Filter')
      setSelectedFilters(
        (prev: Record<string, ISelectItem | ISelectItem[]>) => ({
          ...prev,
          [titleFilterMobile as string]: item as ISelectItem,
        }),
      )
    }
  }

  const handleSelectFilterTab = (tab: string) => {
    setDirection(1)
    setOpenChooseItem(true)
    setTitleFilterMobile(tab)
  }

  const handleBackFilter = () => {
    setDirection(-1)
    setOpenChooseItem(false)
    setTitleFilterMobile('Filter')
  }

  useEffect(() => {
    if (titleFilterMobile === 'Type') {
      setListFilterItem([
        { label: 'All', value: '' },
        ...CLASS_SUFFIX_TYPE_FILTER,
      ])
    } else if (titleFilterMobile === 'Lesson') {
      setListFilterItem(scheduleOptions as ISelectItem[])
    }
  }, [titleFilterMobile])

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!isMobileView) {
        return
      }
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          paginationMobile.current < paginationMobile.total
        ) {
          setParams((prev) => ({
            ...prev,
            page_index: (prev.page_index || 1) + 1,
          }))
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, paginationMobile],
  )

  useEffect(() => {
    if (isMobileView && !isLoading && data?.data) {
      setPaginationMobile({
        current: data?.metadata?.page_index,
        total: data?.metadata?.total_pages,
      })
      if (params.page_index === 1) {
        setIsFirstLoadingMobile(false)
        setListClassResourceMobile(data.data)
      } else {
        setListClassResourceMobile((prev) => [...prev, ...data.data])
      }
    }
  }, [data?.data, isLoading, params.page_index])

  const pushQuery = (next: Record<string, any>) => {
    pushQueryClassResource(router, pathname, query, next)
  }

  const handleSubmitFilterMobile = () => {
    const lessonValue = Array.isArray(selectedFilters.Lesson)
      ? selectedFilters.Lesson.map((item) => item.value)
        .filter((v) => v)
        .join(',')
      : selectedFilters.Lesson.value

    pushQuery({
      suffix_types:
        typeof selectedFilters.Type === 'object' &&
          !Array.isArray(selectedFilters.Type)
          ? selectedFilters.Type.value
          : undefined,
      schedule_ids: lessonValue || undefined,
    })
    setOpenFilter(false)
  }

  useEffect(() => {
    if (
      !isFirstRenderListSchedule.current ||
      scheduleOptions.length === 0 ||
      !isMobileView
    )
      return
    const convertScheduleIdsToArray = () => {
      if (!query.schedule_ids) return []
      return query.schedule_ids.includes(',')
        ? query.schedule_ids
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id)
        : [query.schedule_ids]
    }

    const mapScheduleIdsToOptions = () => {
      if (!convertScheduleIdsToArray()) return []
      return convertScheduleIdsToArray().map((id) => ({
        label:
          scheduleOptions?.find((option) => option?.value === id)?.label || '',
        value: id,
      }))
    }

    setSelectedFilters(
      (prev: Record<string, ISelectItem | ISelectItem[]>) =>
        ({
          ...prev,
          Type: {
            label: query.suffix_types
              ? CLASS_SUFFIX_TYPE_FILTER.find(
                (option) => option.value === query.suffix_types,
              )?.label
              : '',
            value: query.suffix_types || '',
          },
          Lesson: mapScheduleIdsToOptions(),
        }) as Record<string, ISelectItem | ISelectItem[]>,
    )
    isFirstRenderListSchedule.current = false
  }, [scheduleOptions])

  return (
    <Layout
      title="Class Resource"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
    >
      {isLoading && isFirstLoadingMobile ? (
        <ClassResourceSkeleton />
      ) : (
        <>
          {isMobileView && (
            <HeaderMobile
              title="Class Resource"
              showIcon={true}
              onBack={() =>
                router.push(`/courses/my-course/${param?.courseId}`)
              }
              className="mb-2 mt-4 flex w-full"
              extraActions={
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenFilter(true)}
                >
                  <FilterCourseIcon />
                </div>
              }
            />
          )}
          {isAlwaysShowSidebar && (
            <div className="mb-2 mt-4 flex w-full">
              <SappBreadCrumbs
                isTeacher={false}
                breadcrumbs={[
                  { title: 'My Course', link: PageLink.COURSES },
                  {
                    title: courseNameDetail || '',
                    link: `/courses/my-course/${param?.courseId}`,
                  },
                  { title: 'Class Resource', link: '' },
                ]}
              />
            </div>
          )}

          <div className="mb-8">
            <SearchClassResource
              handleOpenSidebar={handleOpenSidebar}
              isShowToggle={isTabletView}
              redirectLink={PageLink.COURSES}
              appType={AppType.LMS_PRO}
            />
          </div>

          {!isMobileView && (
            <div className="mb-6 flex w-full justify-between">
              <div className="text-2xl font-semibold text-gray-800">
                Class Resource
              </div>
              <FilterClassResource totalResult={pagination?.total || 0} />
            </div>
          )}
          {isMobileView && (
            <div className="mb-6 space-y-4">
              {listClassResourceMobile?.length > 0 ? (
                listClassResourceMobile?.map((item: IClassResource) => (
                  <CardFileItem key={item.id} data={item} name={item.name} />
                ))
              ) : (
                <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
                  <NoCoursesAvailable />
                </div>
              )}
            </div>
          )}

          <div ref={lastElementRef} />

          {!isMobileView && (
            <ClassResourceTable
              data={data}
              pagination={pagination}
              setPagination={setPagination}
              isLoading={false}
            />
          )}
          <SappDrawerV3
            open={openFilter}
            handleCancel={() => setOpenFilter(false)}
            isShowBtnBack={openChooseItem}
            handleBack={handleBackFilter}
            title={titleFilterMobile}
            rootClassName={'responsive-drawer-base drawer-bottom-0'}
            isShowBtnClose
            closable
            classNameHeader="mb-4"
            placement="bottom"
            handleSubmit={handleSubmitFilterMobile}
            submitButtonClassName="w-full"
            btnSubmitTile="Confirm"
            isShowFooter
          >
            <CarouselSlideAnimation
              slideKey={titleFilterMobile}
              direction={direction}
            >
              {openChooseItem ? (
                <ListFilterItemMobileBase
                  isMultiSelect={titleFilterMobile === 'Lesson'}
                  handleSelect={handleSelectItemFilter}
                  selected={
                    selectedFilters[titleFilterMobile as 'Type' | 'Lesson']
                  }
                  data={listFilterItem}
                  handleNextPage={() =>
                    !isLoadingClassSchedule && hasNextPage && fetchNextPage()
                  }
                />
              ) : (
                <ListFilterMobileBase
                  handleClick={handleSelectFilterTab}
                  data={LIST_TAB_FILTER}
                  selected={selectedFilters}
                />
              )}
            </CarouselSlideAnimation>
          </SappDrawerV3>
        </>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ClassResource)
