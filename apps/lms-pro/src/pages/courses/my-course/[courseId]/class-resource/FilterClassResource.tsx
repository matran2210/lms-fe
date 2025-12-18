import { CLASS_SUFFIX_TYPE, DEFAULT_PAGE_NUMBER } from '@lms/core'
import { SappSelectMultiple, SAPPSelectV2 } from '@lms/ui'
import { normalizeToArray } from '@lms/utils'
import { getSelectOptions } from '@utils/helpers'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'

type FilterFormValues = {
  suffix_types?: string
  schedule_ids?: string[]
}

const FilterClassResource = ({ totalResult }: { totalResult: number }) => {
  const router = useRouter()
  const { courseId } = router.query
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
      typeof router.query.suffix_types === 'string' &&
      router.query.suffix_types.trim() !== ''
        ? router.query.suffix_types
        : undefined,

    schedule_ids: normalizeToArray(router.query.schedule_ids),
  })
}, [router.query.suffix_types, router.query.schedule_ids, reset])

  const { classSchedule, hasNextPage, fetchNextPage, isLoading, refetch } =
    useSelectClassSchedule(courseId as string, search)

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
  router.push(
    {
      pathname: router.pathname,
      query: cleanQuery({
        ...router.query,
        ...next,
        page_index: DEFAULT_PAGE_NUMBER,
      }),
    },
    undefined,
    { shallow: true },
  )
}

  const cleanQuery = (query: Record<string, any>) => {
  const result: Record<string, any> = {}

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      result[key] = value
    }
  })

  return result
}

  return (
    <div className="flex shrink-0 items-center gap-4">
      <div className="shrink-0 text-sm font-normal text-gray-800">
        {totalResult || 0} Results
      </div>

      <div className="flex justify-end gap-4">
        <div className="flex gap-2">
          {/* ===== Suffix type ===== */}
          <SAPPSelectV2
            control={control}
            name="suffix_types"
            placeholder="Type"
            options={CLASS_SUFFIX_TYPE}
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
