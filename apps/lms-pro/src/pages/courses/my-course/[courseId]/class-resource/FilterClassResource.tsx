import { CLASS_SUFFIX_TYPE, DEFAULT_PAGE_NUMBER } from '@lms/core'
import { SappSelectMultiple, SAPPSelectV2 } from '@lms/ui'
import { cleanArray, normalizeStringQuery, normalizeToArray } from '@lms/utils'
import { getSelectOptions } from '@utils/helpers'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'

const FilterClassResource = ({ totalResult }: { totalResult: number }) => {
  const router = useRouter()
  const { control, watch, reset } = useForm({
    defaultValues: {
      suffix_types: router.query.suffix_types,
      schedule_ids: normalizeToArray(router.query.schedule_ids),
    },
  })
  const { courseId } = router.query

  useEffect(() => {
    if (!router.isReady) return

    reset({
      suffix_types:
        typeof router.query.suffix_types === 'string'
          ? router.query.suffix_types
          : undefined,

      schedule_ids: normalizeToArray(router.query.schedule_ids),
    })
  }, [
    router.isReady,
    router.query.suffix_types,
    router.query.schedule_ids,
    reset,
  ])

  /**
   * 🔥 Watch filter → push URL
   */
  useEffect(() => {
    const subscription = watch((values) => {
      const nextQuery = { ...router.query }

      // reset page
      nextQuery.page_index = String(DEFAULT_PAGE_NUMBER)

      /* ===== suffix_types ===== */
      if (values.suffix_types) {
        nextQuery.suffix_types = String(values.suffix_types)
      } else {
        delete nextQuery.suffix_types
      }

      /* ===== schedule_ids ===== */
      const schedules = cleanArray(values.schedule_ids)
      if (schedules?.length) {
        nextQuery.schedule_ids = schedules
      } else {
        delete nextQuery.schedule_ids
      }

      router.push(
        {
          pathname: router.pathname,
          query: nextQuery,
        },
        undefined,
        { shallow: true },
      )
    })

    return () => subscription.unsubscribe()
  }, [watch])

  /**
   * ===== Schedule search =====
   */
  const [search, setSearch] = useState('')

  const { classSchedule, hasNextPage, fetchNextPage, isLoading, refetch } =
    useSelectClassSchedule(courseId as string, search)

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
    }, 350),
  ).current

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearch = (value: string) => {
    debouncedSearch(value)
  }

  return (
    <div className="flex shrink-0 items-center gap-4">
      <div className="shrink-0 text-sm font-normal text-gray-800">
        {totalResult || 0} Results
      </div>

      <div className="flex justify-end gap-4">
        <div className="flex gap-2">
          <SAPPSelectV2
            control={control}
            name="suffix_types"
            placeholder="Type"
            options={CLASS_SUFFIX_TYPE}
            className="min-w-36"
            heightCustom="h-10"
            allowClear
          />

          <SappSelectMultiple
            allowClear
            control={control}
            onSearch={handleSearch}
            name="schedule_ids"
            isLoading={isLoading}
            onMenuScrollToBottom={() => hasNextPage && fetchNextPage()}
            onDropdownVisibleChange={(open) => {
              open && refetch()
            }}
            placeholder="Lesson: All"
            options={getSelectOptions(
              classSchedule.map((item) => ({
                value: item?.id,
                label: item?.name,
              })),
            )}
            className="min-w-36"
            heightCustom="h-10"
          />
        </div>
      </div>
    </div>
  )
}

export default FilterClassResource
