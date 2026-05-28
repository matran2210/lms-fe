'use client'

import { useFeature } from '@lms/contexts'
import {
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
  IListClassResourceParams,
  RESOURCE_TYPE,
} from '@lms/core'
import { useClassResourceRouteId, useSappPaging } from '@lms/hooks'
import { ClassResourceMobileListSkeleton, NoCoursesAvailable } from '@lms/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import CardFileItem from './CardFileItem'

const FILE_GRID_PAGE_SIZE = 20

export interface ClassResourceMobileListViewProps {
  params: IListClassResourceParams
  onFolderClick: (folderId: string) => void
}

const ClassResourceMobileListView = ({
  params,
  onFolderClick,
}: ClassResourceMobileListViewProps) => {
  const { classApi } = useFeature()
  const classId = useClassResourceRouteId()

  const [mobileListFilePageIndex, setMobileListFilePageIndex] = useState(
    DEFAULT_PAGE_NUMBER,
  )
  const [mobileListFilesAccumulated, setMobileListFilesAccumulated] = useState<
    IClassResource[]
  >([])
  const [mobileListFileTotalPages, setMobileListFileTotalPages] = useState(0)
  const [mobileListFileTotalRecords, setMobileListFileTotalRecords] = useState(0)
  const mobileListFileObserver = useRef<IntersectionObserver>()

  const {
    data: dataListFolder,
    isLoading: isLoadingListFolder,
    isFetching: isFetchingListFolder,
  } = useSappPaging({
    uniqueKey: ClassKey.ClassResourceFolder + '_list',
    queryFn: () =>
      classApi?.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FOLDER,
        ...params,
      }),
    params: { ...params, resource_type: RESOURCE_TYPE.FOLDER },
    enabled: Boolean(classId && classApi?.getClassResource),
  })

  const {
    data: mobileListFilePageData,
    isLoading: isLoadingMobileListFilePage,
    isFetching: isFetchingMobileListFilePage,
  } = useQuery({
    queryKey: [
      ClassKey.ClassResourceFile + '_mobile_list_infinite',
      classId,
      params.suffix_types,
      params.schedule_ids,
      params.search_key,
      params.parent_id,
      mobileListFilePageIndex,
    ],
    queryFn: async () => {
      return classApi?.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FILE,
        ...params,
        page_size: FILE_GRID_PAGE_SIZE,
        page_index: mobileListFilePageIndex,
      })
    },
    enabled: Boolean(classId && classApi?.getClassResource),
    retry: false,
  })

  const mobileListFolders = useMemo((): IClassResource[] => {
    const raw = dataListFolder?.data
    return Array.isArray(raw) ? (raw as IClassResource[]) : []
  }, [dataListFolder?.data])

  const mobileListFolderTotal =
    dataListFolder?.metadata?.total_records ?? 0

  useEffect(() => {
    setMobileListFilePageIndex(DEFAULT_PAGE_NUMBER)
    setMobileListFilesAccumulated([])
    setMobileListFileTotalPages(0)
    setMobileListFileTotalRecords(0)
  }, [
    params.suffix_types,
    params.schedule_ids,
    params.search_key,
    params.parent_id,
  ])

  useEffect(() => {
    if (isLoadingMobileListFilePage) return
    const incoming = mobileListFilePageData?.data
    if (!Array.isArray(incoming)) return
    const rows = incoming as IClassResource[]
    setMobileListFileTotalPages(
      mobileListFilePageData?.metadata?.total_pages ?? 0,
    )
    const totalRec = mobileListFilePageData?.metadata?.total_records
    if (typeof totalRec === 'number') setMobileListFileTotalRecords(totalRec)
    setMobileListFilesAccumulated((prev) =>
      mobileListFilePageIndex === DEFAULT_PAGE_NUMBER
        ? rows
        : [...prev, ...rows],
    )
  }, [
    mobileListFilePageData?.data,
    isLoadingMobileListFilePage,
    mobileListFilePageIndex,
  ])

  const mobileListFullyEmpty = useMemo(
    () =>
      !isLoadingListFolder &&
      !isLoadingMobileListFilePage &&
      mobileListFolderTotal === 0 &&
      mobileListFileTotalRecords === 0,
    [
      isLoadingListFolder,
      isLoadingMobileListFilePage,
      mobileListFolderTotal,
      mobileListFileTotalRecords,
    ],
  )

  const mobileListFileLastRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMobileListFilePage) return
      if (mobileListFileObserver.current)
        mobileListFileObserver.current.disconnect()
      mobileListFileObserver.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          mobileListFilePageIndex < mobileListFileTotalPages
        ) {
          setMobileListFilePageIndex((prev) => prev + 1)
        }
      })
      if (node) mobileListFileObserver.current.observe(node)
    },
    [
      isLoadingMobileListFilePage,
      mobileListFilePageIndex,
      mobileListFileTotalPages,
    ],
  )

  const isMobileListInitialLoading =
    (mobileListFolders.length === 0 &&
      (isLoadingListFolder || isFetchingListFolder)) ||
    (mobileListFilesAccumulated.length === 0 &&
      (isLoadingMobileListFilePage || isFetchingMobileListFilePage))

  if (isMobileListInitialLoading) {
    return <ClassResourceMobileListSkeleton />
  }

  if (mobileListFullyEmpty) {
    return (
      <div className="mb-6 mt-4 space-y-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <NoCoursesAvailable />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 mt-4 space-y-6">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
            Folders
          </h2>
          <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-info">
            {mobileListFolderTotal}
          </span>
        </div>
        {mobileListFolders.map((item) => (
          <CardFileItem
            key={item.id}
            data={item}
            name={item.name}
            onFolderClick={onFolderClick}
          />
        ))}
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
            Files
          </h2>
          <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-info">
            {mobileListFileTotalRecords}
          </span>
        </div>
        {mobileListFilesAccumulated.map((item) => (
          <CardFileItem key={item.id} data={item} name={item.name} />
        ))}
        {mobileListFilesAccumulated.length > 0 &&
          (isLoadingMobileListFilePage || isFetchingMobileListFilePage) && (
            <div className="flex justify-center py-3 text-sm text-gray-500">
              Loading…
            </div>
          )}
        <div ref={mobileListFileLastRef} className="h-1 w-full" />
      </section>
    </div>
  )
}

export default ClassResourceMobileListView
