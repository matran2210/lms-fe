'use client'

import {
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
  IListClassResourceParams,
  RESOURCE_TYPE,
} from '@lms/core'
import {
  useClassResourceRouteId,
  useSappPaging,
  useTailwindBreakpoint,
} from '@lms/hooks'
import { ClassResourceGridSkeleton } from '@lms/ui'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import FileItem from './FileItem'
import FolderItem from './FolderItem'
import { useFeature } from '@lms/contexts'
import clsx from 'clsx'

const FILE_GRID_PAGE_SIZE = 20

function getFolderGridCollapsedHeight(
  gridEl: HTMLElement,
  visibleCount: number,
): number {
  const n = Math.min(visibleCount, gridEl.children.length)
  if (n <= 0) return 0
  const gridTop = gridEl.getBoundingClientRect().top
  let maxBottom = 0
  for (let i = 0; i < n; i++) {
    const child = gridEl.children[i] as HTMLElement | undefined
    if (!child) break
    maxBottom = Math.max(maxBottom, child.getBoundingClientRect().bottom)
  }
  return Math.ceil(maxBottom - gridTop)
}

export interface ClassResourceGridViewProps {
  params: IListClassResourceParams
  onFolderClick: (folderId: string) => void
  pagingScope?: string
  isNoPadding?: boolean
}

const ClassResourceGridView = ({
  params,
  onFolderClick,
  pagingScope,
  isNoPadding = false,
}: ClassResourceGridViewProps) => {
  const { classApi } = useFeature()
  const classId = useClassResourceRouteId()
  const { isMobileView, isTabletView } = useTailwindBreakpoint()

  const FOLDER_GRID_PREVIEW_COUNT = useMemo(() => {
    return isMobileView ? 6 : isTabletView ? 9 : 15
  }, [isMobileView, isTabletView])

  const [foldersGridExpanded, setFoldersGridExpanded] = useState(false)
  const [filePageIndex, setFilePageIndex] = useState(DEFAULT_PAGE_NUMBER)
  const [fileListAccumulated, setFileListAccumulated] = useState<IClassResource[]>(
    [],
  )
  const [fileTotalPages, setFileTotalPages] = useState(0)
  const fileObserver = useRef<IntersectionObserver>()

  const folderPagingKey =
    ClassKey.ClassResourceFolder + (pagingScope ? `:${pagingScope}` : '')
  const filePagingKey =
    ClassKey.ClassResourceFile + (pagingScope ? `:${pagingScope}` : '')

  const {
    data: dataFolder,
    isLoading: isLoadingFolderGrid,
    isFetching: isFetchingFolderGrid,
  } = useSappPaging({
    uniqueKey: folderPagingKey,
    queryFn: () =>
      classApi.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FOLDER,
        ...params,
      }),
    params: { ...params, resource_type: RESOURCE_TYPE.FOLDER },
  })

  const folderList = useMemo((): IClassResource[] => {
    const raw = dataFolder?.data
    return Array.isArray(raw) ? raw : []
  }, [dataFolder?.data])

  const folderTotal = dataFolder?.metadata?.total_records ?? folderList.length

  const {
    data: dataFile,
    isLoading: isLoadingFile,
    isFetching: isFetchingFile,
  } = useSappPaging({
    uniqueKey: filePagingKey,
    queryFn: () =>
      classApi.getClassResource!(classId, {
        resource_type: RESOURCE_TYPE.FILE,
        ...params,
        page_size: FILE_GRID_PAGE_SIZE,
        page_index: filePageIndex,
      }),
    params: {
      ...params,
      resource_type: RESOURCE_TYPE.FILE,
      page_size: FILE_GRID_PAGE_SIZE,
      page_index: filePageIndex,
    },
  })

  const fileTotal = dataFile?.metadata?.total_records ?? fileListAccumulated.length

  useEffect(() => {
    setFilePageIndex(DEFAULT_PAGE_NUMBER)
    setFileListAccumulated([])
    setFileTotalPages(0)
  }, [
    params.suffix_types,
    params.schedule_ids,
    params.search_key,
    params.parent_id,
  ])

  useEffect(() => {
    if (isLoadingFile) return
    const incoming = dataFile?.data
    if (!Array.isArray(incoming)) return
    setFileTotalPages(dataFile?.metadata?.total_pages ?? 0)
    setFileListAccumulated((prev) =>
      filePageIndex === 1 ? incoming : [...prev, ...incoming],
    )
  }, [dataFile?.data, isLoadingFile, filePageIndex])

  useEffect(() => {
    setFoldersGridExpanded(false)
  }, [
    params.parent_id,
    params.suffix_types,
    params.schedule_ids,
    params.search_key,
  ])

  const fileLastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingFile) return
      if (fileObserver.current) fileObserver.current.disconnect()
      fileObserver.current = new IntersectionObserver((entries) => {
        if (entries?.[0]?.isIntersecting && filePageIndex < fileTotalPages) {
          setFilePageIndex((prev) => prev + 1)
        }
      })
      if (node) fileObserver.current.observe(node)
    },
    [isLoadingFile, filePageIndex, fileTotalPages],
  )

  const isGridInitialLoading =
    (folderList.length === 0 && (isLoadingFolderGrid || isFetchingFolderGrid)) ||
    (fileListAccumulated.length === 0 && (isLoadingFile || isFetchingFile))

  const isLoadingMoreFiles =
    fileListAccumulated.length > 0 && (isLoadingFile || isFetchingFile)

  const folderGridRef = useRef<HTMLDivElement>(null)
  const [folderHeights, setFolderHeights] = useState<{
    collapsed: number
    full: number
  } | null>(null)

  const showFolderExpandToggle = folderTotal > FOLDER_GRID_PREVIEW_COUNT

  const measureFolderHeights = useCallback(() => {
    const el = folderGridRef.current
    if (!el || folderList.length === 0) {
      setFolderHeights(null)
      return
    }
    const full = el.scrollHeight
    if (folderList.length <= FOLDER_GRID_PREVIEW_COUNT) {
      setFolderHeights({ collapsed: full, full })
      return
    }
    const collapsed = getFolderGridCollapsedHeight(el, FOLDER_GRID_PREVIEW_COUNT)
    setFolderHeights({
      collapsed: Math.max(collapsed, 0),
      full: full + 8,
    })
  }, [folderList, FOLDER_GRID_PREVIEW_COUNT])

  useLayoutEffect(() => {
    measureFolderHeights()
  }, [measureFolderHeights, isGridInitialLoading])

  useLayoutEffect(() => {
    const el = folderGridRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measureFolderHeights())
    ro.observe(el)
    return () => ro.disconnect()
  }, [measureFolderHeights, isGridInitialLoading])

  const folderGridClassName =
    'grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5'

  if (isGridInitialLoading) {
    return <ClassResourceGridSkeleton />
  }

  return (
    <div className={clsx("mb-4 flex flex-col gap-8 rounded-xl bg-white", isNoPadding ? "p-0" : " shadow-small p-4 md:p-6 xl:p-8")}>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
              Folders
            </h2>
            <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-info">
              {folderTotal}
            </span>
          </div>
          {showFolderExpandToggle && (
            <button
              type="button"
              onClick={() => setFoldersGridExpanded((v) => !v)}
              className="text-sm font-semibold leading-[22px] text-gray-800 underline"
            >
              {foldersGridExpanded ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
        {showFolderExpandToggle ? (
          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{
              maxHeight:
                folderHeights == null
                  ? undefined
                  : foldersGridExpanded
                    ? `${folderHeights.full}px`
                    : `${folderHeights.collapsed}px`,
            }}
          >
            <div ref={folderGridRef} className={folderGridClassName}>
              {folderList.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onFolderClick={onFolderClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div ref={folderGridRef} className={folderGridClassName}>
            {folderList.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                onFolderClick={onFolderClick}
              />
            ))}
          </div>
        )}
      </section>
      <section className="flex flex-col">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
            Files
          </h2>
          <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-info">
            {fileTotal}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
          {fileListAccumulated.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
        {isLoadingMoreFiles && (
          <div className="flex justify-center py-3 text-sm text-gray-500">
            Loading…
          </div>
        )}
        <div ref={fileLastElementRef} className="col-span-5 h-1" />
      </section>
    </div>
  )
}

export default ClassResourceGridView