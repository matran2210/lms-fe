'use client'
import { CLASS_SUFFIX_TYPE_FILTER } from '@lms/core'
import { useSelectClassSchedule } from '@lms/hooks'
import { SappSelectMultiple, SAPPSelectTooltip } from '@lms/ui'
import { getSelectOptions } from '@lms/utils'
import { debounce } from 'lodash'
import {
  useParams,
} from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export type FilterFormValues = {
  suffix_types?: string
  schedule_ids?: string[]
}

const FilterClassResource = ({ totalResult, setQueryParams, queryParams }: { totalResult: number, setQueryParams: Dispatch<SetStateAction<FilterFormValues>>, queryParams :  FilterFormValues}) => {
  const params = useParams()
  const { courseId } = params
  const [search, setSearch] = useState('')

  const { control, reset } = useForm<FilterFormValues>({
    defaultValues: {
      suffix_types: undefined,
      schedule_ids: [],
    },
  })

  useEffect(() => {
    reset({
      suffix_types:
        typeof queryParams.suffix_types === 'string' &&
          queryParams.suffix_types.trim() !== ''
          ? queryParams.suffix_types
          : undefined,

      schedule_ids: queryParams.schedule_ids,
    })
  }, [queryParams.suffix_types, queryParams.schedule_ids, reset])

  const { classSchedule, hasNextPage, fetchNextPage, isLoading, refetch } =
    useSelectClassSchedule(courseId as string, search, true)

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
    }, 350),
  ).current

  useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  const handleSearch = (value: string) => {
    debouncedSearch(value)
  }

  const scheduleOptions = useMemo(() => {
    return getSelectOptions(
      classSchedule.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    )
  }, [classSchedule])

  return (
    <div className="flex shrink-0 items-center gap-4">
      <div className="shrink-0 text-sm font-normal text-gray-800">
        {totalResult || 0} Results
      </div>

      <div className="flex justify-end gap-4">
        <div className="flex gap-2">
          {/* ===== Suffix type ===== */}
          <SAPPSelectTooltip
            control={control}
            name="suffix_types"
            placeholder="Type"
            options={CLASS_SUFFIX_TYPE_FILTER}
            className="min-w-36"
            heightCustom="h-10"
            allowClear
            onChange={(value) => {
              setQueryParams((prev) => ({
                ...prev,
                suffix_types:
                  value === undefined || value === null || value === ''
                    ? undefined
                    : value,
              }))
            }}
          />

          {/* ===== Schedule multi ===== */}
          <SappSelectMultiple
            control={control}
            name="schedule_ids"
            placeholder="Lesson: All"
            allowClear
            isLoading={isLoading}
            options={scheduleOptions}
            className="min-w-36"
            heightCustom="h-10"
            onSearch={handleSearch}
            onMenuScrollToBottom={() => hasNextPage && fetchNextPage()}
            onDropdownVisibleChange={(open) => {
              open && refetch()
            }}
            onChange={(values) => {
              setQueryParams((prev) => ({
                ...prev,
               schedule_ids: values?.length ? values : undefined,
              }))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterClassResource
