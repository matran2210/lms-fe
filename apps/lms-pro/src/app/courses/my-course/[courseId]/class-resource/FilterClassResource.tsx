'use client'
import { CLASS_SUFFIX_TYPE_FILTER } from '@lms/core'
import { useSelectClassSchedule } from '@lms/hooks'
import { SappSelectMultiple, SAPPSelectTooltip } from '@lms/ui'
import { getSelectOptions } from '@lms/utils'
import { pushQueryClassResource } from '@utils/helpers'
import { debounce } from 'lodash'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FilterFormValues = {
  suffix_types?: string
  schedule_ids?: string[]
}

const FilterClassResource = ({ totalResult }: { totalResult: number }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const { courseId } = params
  const [search, setSearch] = useState('')

  const { control, reset } = useForm<FilterFormValues>({
    defaultValues: {
      suffix_types: undefined,
      schedule_ids: [],
    },
  })

  useEffect(() => {
    const convertScheduleIdsToArray = () => {
      if (!query.schedule_ids) return []
      return query.schedule_ids.includes(',')
        ? query.schedule_ids
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id)
        : [query.schedule_ids]
    }
    reset({
      suffix_types:
        typeof query.suffix_types === 'string' &&
          query.suffix_types.trim() !== ''
          ? query.suffix_types
          : undefined,

      schedule_ids: convertScheduleIdsToArray(),
    })
  }, [query.suffix_types, query.schedule_ids, reset])

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

  const pushQuery = (next: Record<string, any>) => {
    pushQueryClassResource(router, pathname, query, next)
  }

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
              pushQuery({
                suffix_types:
                  value === undefined || value === null || value === ''
                    ? undefined
                    : value,
              })
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
              pushQuery({
                schedule_ids: values?.length ? values : undefined,
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterClassResource
