import { CLASS_SUFFIX_TYPE } from '@lms/core'
import { SappSelectMultiple, SAPPSelectV2 } from '@lms/ui'
import { cleanArray, normalizeToArray } from '@lms/utils'
import { getSelectOptions } from '@utils/helpers'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'

const FilterClassResource = ({
  totalResult,
}: {
  totalResult: number
}) => {
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
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_index: 1,
          suffix_types:
            typeof values.suffix_types === 'string'
              ? values.suffix_types
              : undefined,

          schedule_ids: cleanArray(values.schedule_ids),
        },
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
