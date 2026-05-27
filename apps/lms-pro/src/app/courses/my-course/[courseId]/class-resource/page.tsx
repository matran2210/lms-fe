'use client'

import { useCourseContext, UserType } from '@lms/contexts'
import {
  ANIMATION,
  AppType,
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IListClassResourceParams,
  ITabs,
  RESOURCE_TYPE,
} from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  ClassResourceSkeleton,
  HeaderMobile,
  Layout,
  SappBreadCrumbs,
} from '@lms/ui'
import { FilterCourseIcon, SortGridIcon, SortListIcon } from '@lms/assets'
import { buildQueryString, normalizeToArray } from '@lms/utils'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from 'react'
import { useQuery } from 'react-query'
import { ClassAPI } from 'src/api/class'
import { PageLink } from 'src/constants/routers'
import {
  ClassResourceDesktopListView,
  ClassResourceGridView,
  ClassResourceMobileFilterDrawer,
  ClassResourceMobileListView,
  ClassResourceStudentLayoutToggle,
  FilterClassResource,
  SearchClassResource,
  type FilterFormValues,
} from '@lms/feature-courses'

/** `schedule_ids` trên URL: một id hoặc nhiều id nối bằng dấu phẩy */
function parseScheduleIdsFromUrl(
  raw: string | undefined,
): string[] | undefined {
  if (!raw || !String(raw).trim()) return undefined
  const s = String(raw).trim()
  return s.includes(',')
    ? s.split(',').map((id) => id.trim()).filter(Boolean)
    : [s]
}

function filterFormValuesFromSearchParams(
  searchParams: URLSearchParams,
): FilterFormValues {
  const q = Object.fromEntries(searchParams.entries())
  const ids = parseScheduleIdsFromUrl(q.schedule_ids)
  return {
    suffix_types:
      typeof q.suffix_types === 'string' && q.suffix_types.trim() !== ''
        ? q.suffix_types
        : undefined,
    schedule_ids: ids ?? [],
  }
}

const ClassResource = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const param = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const { isAlwaysShowSidebar, isMobileView, isTabletView } =
    useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()

  const [showSidebar, setShowSidebar] = useState(false)
  const handleOpenSidebar = useCallback(() => {
    setShowSidebar(true)
    setOpenSidebar(true)
  }, [setOpenSidebar])
  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }, [setOpenSidebar])

  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })

  useEffect(() => {
    const scheduleIds = parseScheduleIdsFromUrl(query.schedule_ids)
    setParams((prev) => ({
      ...prev,
      page_index: query.page_index
        ? Number(query.page_index)
        : DEFAULT_PAGE_NUMBER,
      page_size: query.page_size ? Number(query.page_size) : DEFAULT_PAGE_SIZE,
      suffix_types: normalizeToArray(query.suffix_types),
      schedule_ids: scheduleIds?.length ? scheduleIds : undefined,
      search_key:
        typeof query.search_key === 'string' ? query.search_key : undefined,
      parent_id:
        typeof query.parent_id === 'string' && query.parent_id.trim()
          ? query.parent_id
          : undefined,
    }))
  }, [
    query.page_index,
    query.suffix_types,
    query.schedule_ids,
    query.search_key,
    query.page_size,
    query.parent_id,
  ])

  const classResourceLayout = useMemo<'list' | 'grid'>(
    () => (query.layout === 'list' ? 'list' : 'grid'),
    [query.layout],
  )

  const navigateToListLayout = useCallback(() => {
    router.push(
      `${pathname}?${buildQueryString({
        ...query,
        layout: 'list',
        page_index: DEFAULT_PAGE_NUMBER,
        page_size: DEFAULT_PAGE_SIZE,
      })}`,
    )
  }, [pathname, query, router])

  const navigateToGridLayout = useCallback(() => {
    const {
      page_index: _pi,
      page_size: _ps,
      layout: _layout,
      ...gridRestQuery
    } = query
    router.push(`${pathname}?${buildQueryString(gridRestQuery)}`)
  }, [pathname, query, router])

  const queryParams = useMemo(
    () => filterFormValuesFromSearchParams(searchParams),
    [searchParams],
  )

  const setQueryParams = useCallback(
    (updater: SetStateAction<FilterFormValues>) => {
      const q = Object.fromEntries(searchParams.entries()) as Record<
        string,
        string
      >
      const current = filterFormValuesFromSearchParams(searchParams)
      const next = typeof updater === 'function' ? updater(current) : updater
      const nextUrl: Record<string, string> = { ...q }

      if (
        next.suffix_types !== undefined &&
        String(next.suffix_types).trim() !== ''
      ) {
        nextUrl.suffix_types = String(next.suffix_types).trim()
      } else {
        delete nextUrl.suffix_types
      }

      if (next.schedule_ids && next.schedule_ids.length > 0) {
        nextUrl.schedule_ids = next.schedule_ids.join(',')
      } else {
        delete nextUrl.schedule_ids
      }

      nextUrl.page_index = String(DEFAULT_PAGE_NUMBER)
      router.push(`${pathname}?${buildQueryString(nextUrl)}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const handleNavigateIntoFolder = useCallback(
    (folderId: string) => {
      if (!folderId) return
      router.push(
        `${pathname}?${buildQueryString({
          ...query,
          parent_id: folderId,
          page_index: DEFAULT_PAGE_NUMBER,
        })}`,
        { scroll: false },
      )
    },
    [pathname, query, router],
  )

  const { data: dataFolder, isLoading: isLoadingFolder } = useQuery({
    queryKey: [ClassKey.ClassResourceFolder, param.courseId, params],
    queryFn: async () =>
      ClassAPI.getClassResource(param.courseId as string, {
        resource_type: RESOURCE_TYPE.FOLDER,
        ...params,
      }),
    enabled: Boolean(param.courseId),
    retry: false,
  })

  const { data: dataFile, isLoading: isLoadingFile } = useQuery({
    queryKey: [ClassKey.ClassResourceFile, param.courseId, params],
    queryFn: async () =>
      ClassAPI.getClassResource(param.courseId as string, {
        resource_type: RESOURCE_TYPE.FILE,
        ...params,
      }),
    enabled: Boolean(param.courseId),
    retry: false,
  })

  const folderTotal = dataFolder?.metadata?.total_records ?? 0
  const fileTotal = dataFile?.metadata?.total_records ?? 0
  const totalResult = folderTotal + fileTotal

  const classResourcePageHeading = useMemo(() => {
    const raw = dataFolder?.breadcrumb
    const folderChain =
      Array.isArray(raw) && raw.length > 0 ? [...raw].reverse() : []
    const displayFolderChain = folderChain.slice(1)
    if (displayFolderChain.length === 0) return 'Class Resource'
    const last = displayFolderChain[displayFolderChain.length - 1]
    return last?.name?.trim() || 'Class Resource'
  }, [dataFolder?.breadcrumb])

  const classResourceBreadcrumbs = useMemo((): ITabs[] => {
    const raw = dataFolder?.breadcrumb
    const folderChain =
      Array.isArray(raw) && raw.length > 0 ? [...raw].reverse() : []
    const displayFolderChain = folderChain.slice(1)

    const queryWithoutParent = Object.fromEntries(
      Object.entries(query).filter(([k]) => k !== 'parent_id'),
    ) as Record<string, string>

    const hrefWithParent = (parentId: string) =>
      `${pathname}?${buildQueryString({
        ...query,
        parent_id: parentId,
        page_index: DEFAULT_PAGE_NUMBER,
      })}`

    const classResourceRootHref = `${pathname}?${buildQueryString({
      ...queryWithoutParent,
      page_index: DEFAULT_PAGE_NUMBER,
    })}`

    const base: ITabs[] = []

    if (folderChain.length === 0) {
      base.push({ title: 'Class Resource', link: '' })
      return base
    }

    base.push({ title: 'Class Resource', link: classResourceRootHref })

    if (folderChain.length > 0 && displayFolderChain.length === 0) {
      base.push({ title: '\u200b', link: '' })
    }

    displayFolderChain.forEach((node, index) => {
      const isLast = index === displayFolderChain.length - 1
      base.push({
        title: node.name || '',
        link: isLast || !node.id ? '' : hrefWithParent(node.id),
      })
    })

    return base
  }, [param?.courseId, pathname, query, dataFolder?.breadcrumb])

  const handleClassResourceMobileBack = useCallback(() => {
    const hasParentInUrl =
      typeof query.parent_id === 'string' && query.parent_id.trim() !== ''

    if (!hasParentInUrl) {
      router.push(`/courses/my-course/${param?.courseId}`)
      return
    }

    const raw = dataFolder?.breadcrumb
    const folderChain =
      Array.isArray(raw) && raw.length > 0 ? [...raw].reverse() : []
    const displayFolderChain = folderChain.slice(1)

    const queryWithoutParent = Object.fromEntries(
      Object.entries(query).filter(([k]) => k !== 'parent_id'),
    ) as Record<string, string>

    if (displayFolderChain.length <= 1) {
      router.push(
        `${pathname}?${buildQueryString({
          ...queryWithoutParent,
          page_index: DEFAULT_PAGE_NUMBER,
        })}`,
        { scroll: false },
      )
      return
    }

    const parentNode = displayFolderChain[displayFolderChain.length - 2]
    const parentId = parentNode?.id
    if (!parentId) {
      router.push(
        `${pathname}?${buildQueryString({
          ...queryWithoutParent,
          page_index: DEFAULT_PAGE_NUMBER,
        })}`,
        { scroll: false },
      )
      return
    }

    router.push(
      `${pathname}?${buildQueryString({
        ...query,
        parent_id: parentId,
        page_index: DEFAULT_PAGE_NUMBER,
      })}`,
      { scroll: false },
    )
  }, [dataFolder?.breadcrumb, param?.courseId, pathname, query, router])

  // ── Initial page loading ─────────────────────────────────────────────────
  const courseIdStr = (param.courseId as string) || ''
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  useEffect(() => {
    setInitialLoadDone(false)
  }, [courseIdStr])

  const initialLoadBusy = useMemo(() => {
    if (!courseIdStr) return true
    return isLoadingFolder || isLoadingFile
  }, [courseIdStr, isLoadingFolder, isLoadingFile])

  useEffect(() => {
    if (initialLoadDone || initialLoadBusy) return
    setInitialLoadDone(true)
  }, [initialLoadDone, initialLoadBusy])

  const isInitialPageLoading = !initialLoadDone && initialLoadBusy

  // ── Mobile filter drawer ─────────────────────────────────────────────────
  const [openMobileFilter, setOpenMobileFilter] = useState(false)

  return (
    <Layout
      title="Class Resource"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
    >
      <>
        {isInitialPageLoading ? (
          <ClassResourceSkeleton className="mt-2 md:mt-0" />
        ) : (
          <div data-aos={ANIMATION.DATA_AOS}>
            {(isMobileView || isTabletView) && (
              <HeaderMobile
                title={classResourcePageHeading}
                showIcon={true}
                onBack={handleClassResourceMobileBack}
                className="mb-2 mt-4 flex w-full"
                extraActions={
                  isMobileView ? (
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="cursor-pointer text-gray-800"
                        onClick={() =>
                          classResourceLayout === 'grid'
                            ? navigateToListLayout()
                            : navigateToGridLayout()
                        }
                      >
                        {classResourceLayout === 'grid' ? (
                          <SortGridIcon />
                        ) : (
                          <SortListIcon />
                        )}
                      </button>
                      <div
                        className="cursor-pointer"
                        onClick={() => setOpenMobileFilter(true)}
                      >
                        <FilterCourseIcon />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                }
              />
            )}
            {isAlwaysShowSidebar && (
              <div className="mb-2 mt-4 flex w-full">
                <SappBreadCrumbs
                  isTeacher={false}
                  breadcrumbs={classResourceBreadcrumbs}
                />
              </div>
            )}
            {!isMobileView && !isTabletView && (
              <div className="mb-8 mt-4 text-2xl font-semibold text-gray-800">
                {classResourcePageHeading}
              </div>
            )}
            <SearchClassResource
              handleOpenSidebar={handleOpenSidebar}
              isShowToggle={!isMobileView && !isTabletView}
              redirectLink={PageLink.COURSES}
              appType={AppType.LMS_PRO}
            />
            {!isMobileView && (
              <div className="mb-8 mt-6 flex w-full justify-between">
                <ClassResourceStudentLayoutToggle
                  layout={classResourceLayout}
                  onSelectList={navigateToListLayout}
                  onSelectGrid={navigateToGridLayout}
                />
                <FilterClassResource
                  totalResult={totalResult}
                  setQueryParams={setQueryParams}
                  queryParams={queryParams}
                />
              </div>
            )}
            {isMobileView && classResourceLayout === 'list' && (
              <ClassResourceMobileListView
                params={params}
                onFolderClick={handleNavigateIntoFolder}
              />
            )}
            <div className="mt-4 md:mt-0">
              {!isMobileView && classResourceLayout === 'list' && (
                <ClassResourceDesktopListView
                  params={params}
                  onFolderClick={handleNavigateIntoFolder}
                />
              )}
              {classResourceLayout === 'grid' && (
                <ClassResourceGridView
                  params={params}
                  onFolderClick={handleNavigateIntoFolder}
                />
              )}
            </div>
          </div>
        )}
        {isMobileView && (
          <ClassResourceMobileFilterDrawer
            open={openMobileFilter}
            onOpenChange={setOpenMobileFilter}
            courseId={param.courseId as string}
            query={query}
            setQueryParams={setQueryParams}
          />
        )}
      </>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ClassResource)
