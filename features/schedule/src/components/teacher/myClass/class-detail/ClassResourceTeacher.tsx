'use client'

import { useFeature } from '@lms/contexts'
import {
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IListClassResourceParams,
  RESOURCE_TYPE,
} from '@lms/core'
import { useClassResourceRouteId } from '@lms/hooks'
import { LayoutFilter } from '@lms/ui'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import ClassResourceDesktopListView from '../../../shared/class-resource/ClassResourceDesktopListView'
import ClassResourceGridView from '../../../shared/class-resource/ClassResourceGridView'
import ClassResourceBreadcrumb from '../../../shared/class-resource/ClassResourceBreadcrumb'
import ClassResourceLayoutToggle from '../../../shared/class-resource/ClassResourceLayoutToggle'
import ClassResourceTeacherFilter from '../../ClassResourceTeacherFilter'

export default function ClassResourceTeacher() {
  const { classApi } = useFeature()
  const classId = useClassResourceRouteId()
  const { control, reset, getValues } = useForm()

  const [layout, setLayout] = useState<'list' | 'grid'>('grid')
  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })

  const { data: dataFolder, isLoading: isLoadingFolder } = useQuery({
    queryKey: [ClassKey.ClassResourceFolder, 'teacher-tab', classId, params],
    queryFn: async () => {
      if (!classApi?.getClassResource) {
        throw new Error('getClassResource is not available')
      }
      return classApi.getClassResource(classId, {
        resource_type: RESOURCE_TYPE.FOLDER,
        ...params,
      })
    },
    enabled: Boolean(classId && classApi?.getClassResource),
    retry: false,
  })

  const displayFolderChain = useMemo(() => {
    const raw = dataFolder?.breadcrumb
    const folderChain =
      Array.isArray(raw) && raw.length > 0 ? [...raw].reverse() : []
    let chain = folderChain.slice(1)
    if (
      params.parent_id &&
      chain.length === 0 &&
      folderChain.length > 0
    ) {
      chain = folderChain
    }
    return chain
  }, [dataFolder?.breadcrumb, params.parent_id])

  const isAtResourceRoot = !params.parent_id

  const navigateToFolder = useCallback((parentId: string | undefined) => {
    setParams((prev) => ({
      ...prev,
      parent_id: parentId,
      page_index: DEFAULT_PAGE_NUMBER,
    }))
  }, [])

  const handleResetFilter = () => {
    reset({ search_key: '', suffix_types: '' })
    setParams((prev) => ({
      page_size: DEFAULT_PAGE_SIZE,
      page_index: DEFAULT_PAGE_NUMBER,
      parent_id: prev.parent_id,
      search_key: undefined,
      suffix_types: undefined,
      schedule_ids: undefined,
    }))
  }

  const onSubmit = () => {
    setParams((prev) => ({
      ...prev,
      page_size: DEFAULT_PAGE_SIZE,
      page_index: DEFAULT_PAGE_NUMBER,
      search_key: getValues('search_key') || undefined,
      suffix_types: getValues('suffix_types')?.value || undefined,
      schedule_ids: getValues('schedule_ids') || undefined,
    }))
  }

  const handleNavigateIntoFolder = useCallback(
    (folderId: string) => {
      if (!folderId) return
      navigateToFolder(folderId)
    },
    [navigateToFolder],
  )

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <LayoutFilter
        listFilter={<ClassResourceTeacherFilter control={control} />}
        loading={isLoadingFolder}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
        layoutAction={<ClassResourceLayoutToggle
          layout={layout}
          onSelectList={() => setLayout('list')}
          onSelectGrid={() => setLayout('grid')}
        />}
      />
      <ClassResourceBreadcrumb
        displayFolderChain={displayFolderChain}
        isAtResourceRoot={isAtResourceRoot}
        onNavigateToFolder={navigateToFolder}
      />
      <div className="mt-6">
        {layout === 'list' ? (
          <ClassResourceDesktopListView
            params={params}
            onFolderClick={handleNavigateIntoFolder}
            syncFilterQueryToUrl={false}
            pagingScope={classId}
            isNoPadding={true}
          />
        ) : (
          <ClassResourceGridView
            params={params}
            onFolderClick={handleNavigateIntoFolder}
            pagingScope={classId}
            isNoPadding={true}
          />
        )}
      </div>
    </div>
  )
}
