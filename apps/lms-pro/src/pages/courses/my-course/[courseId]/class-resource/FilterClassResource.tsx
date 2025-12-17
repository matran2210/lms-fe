import { CLASS_SUFFIX_TYPE } from '@lms/core'
import { SappSelectMultiple, SAPPSelectV2 } from '@lms/ui'
import { getSelectOptions } from '@utils/helpers'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'

export interface IClassSchedule {
  class_schedule_id: string
  class_id: string
  mode: string
  is_holiday: boolean
  event_name: string
  schedule_id: string
  lesson_date: Date
  start_time: string
  end_time: string
  is_test: boolean
  is_case_study: boolean
  is_cancelled: boolean
  has_key_content_before: boolean
  dead_line: Date
}

const FilterClassResource = ({
  filter,
  setFilter,
  totalResult,
}: {
  filter: any
  setFilter: any
  totalResult: number
}) => {
  const { control, watch } = useForm()
  const router = useRouter()
  const { courseId } = router.query

  useEffect(() => {
    const subscription = watch((values) => {
      setFilter((prev: any) => ({
        ...prev,
        ...values,
      }))
    })

    return () => subscription.unsubscribe()
  }, [watch])

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
            required
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
