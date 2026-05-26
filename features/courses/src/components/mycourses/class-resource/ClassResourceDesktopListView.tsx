'use client'

import {
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IListClassResourceParams,
  RESOURCE_TYPE,
} from '@lms/core'
import { useClassResourceRouteId, useSappPaging } from '@lms/hooks'
import { ClassResourceTableListSkeleton } from '@lms/ui'
import { buildQueryString } from '@lms/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import ClassResourceFileTable from './ClassResourceFileTable'
import ClassResourceFolderTable from './ClassResourceFolderTable'
import { useFeature } from '@lms/contexts'
import clsx from 'clsx'

export interface ClassResourceDesktopListViewProps {
  params: IListClassResourceParams
  onFolderClick: (folderId: string) => void
  syncFilterQueryToUrl?: boolean
  pagingScope?: string
  isNoPadding?: boolean
}

const ClassResourceDesktopListView = ({
  params,
  onFolderClick,
  syncFilterQueryToUrl = true,
  pagingScope,
  isNoPadding = false,
}: ClassResourceDesktopListViewProps) => {
  const { classApi } = useFeature()
  const classId = useClassResourceRouteId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())
  const isFirstFilterRender = useRef(true)

  const folderListPagingKey =
    ClassKey.ClassResourceFolder +
    '_list' +
    (pagingScope ? `:${pagingScope}` : '')
  const fileListPagingKey =
    ClassKey.ClassResourceFile + '_list' + (pagingScope ? `:${pagingScope}` : '')

  const {
    data: dataListFolder,
    isLoading: isLoadingListFolder,
    isFetching: isFetchingListFolder,
  } = useSappPaging({
    uniqueKey: folderListPagingKey,
    queryFn: () =>
      classApi.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FOLDER,
        ...params,
      }),
    params: { ...params, resource_type: RESOURCE_TYPE.FOLDER },
  })

  const {
    data: dataListFile,
    pagination: listPagination,
    setPagination: setListPagination,
    isLoading: isLoadingListFile,
    isFetching: isFetchingListFile,
  } = useSappPaging({
    uniqueKey: fileListPagingKey,
    queryFn: () =>
      classApi.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FILE,
        ...params,
        page_index: listPagination.current ?? DEFAULT_PAGE_NUMBER,
        page_size: listPagination.pageSize ?? DEFAULT_PAGE_SIZE,
      }),
    params: { ...params, resource_type: RESOURCE_TYPE.FILE },
  })

  useEffect(() => {
    if (!syncFilterQueryToUrl) return
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false
      return
    }
    router.push(
      `${pathname}?${buildQueryString({
        ...Object.fromEntries(searchParams.entries()),
        page_index: DEFAULT_PAGE_NUMBER,
      })}`,
      { scroll: false },
    )
    setListPagination((prev) => ({ ...prev, current: DEFAULT_PAGE_NUMBER }))
  }, [query.suffix_types, query.schedule_ids, syncFilterQueryToUrl])

  useEffect(() => {
    setListPagination((prev) => ({
      ...prev,
      current: DEFAULT_PAGE_NUMBER,
    }))
  }, [
    params.parent_id,
    params.suffix_types,
    params.schedule_ids,
    params.search_key,
    setListPagination,
  ])

  const isDesktopListResourcesLoading =
    isLoadingListFolder ||
    isLoadingListFile ||
    isFetchingListFolder ||
    isFetchingListFile

  if (isDesktopListResourcesLoading) {
    return <ClassResourceTableListSkeleton />
  }

  const syncTableColumns =
    Boolean(dataListFolder?.data?.length) || Boolean(dataListFile?.data?.length)

  return (
    <div className={clsx("mb-4 flex flex-col rounded-xl bg-white", isNoPadding ? "p-0" : "p-4 md:p-6 xl:p-8")}>
      <ClassResourceFolderTable
        folders={dataListFolder}
        pagination={listPagination}
        onFolderClick={onFolderClick}
        syncTableColumns={syncTableColumns}
      />
      <ClassResourceFileTable
        files={dataListFile}
        pagination={listPagination}
        setPagination={setListPagination}
        syncPagingToUrl={syncFilterQueryToUrl}
        syncTableColumns={syncTableColumns}
      />
    </div>
  )
}

export default ClassResourceDesktopListView
