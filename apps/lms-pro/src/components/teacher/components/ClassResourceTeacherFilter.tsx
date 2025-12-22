import { SearchIcon } from '@lms/assets'
import { CLASS_SUFFIX_TYPE_FILTER } from '@lms/core'
import {
  HookFormTextField,
  SappHookFormSelect,
  SappSelectMultipleTeacher,
} from '@lms/ui'
import { getSelectOptions } from '@utils/helpers'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Control } from 'react-hook-form'
import useSelectClassSchedule from 'src/hooks/useSelectClassSchedule'
interface IProps {
  control: Control<any>
}

const ClassResourceTeacherFilter: React.FC<IProps> = ({ control }) => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { classSchedule, hasNextPage, fetchNextPage, isLoading, refetch } =
    useSelectClassSchedule(router.query.id as string, search)

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
    }, 350),
  ).current

  useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  const handleSearch = (value?: string) => {
    debouncedSearch(value!)
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
    <div className="grid grid-cols-4 gap-4">
      <HookFormTextField
        control={control}
        name="search_key"
        placeholder={'Search class resource'}
        placeholderIcon={<SearchIcon />}
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B7] placeholder:font-medium"
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        name="suffix_types"
        isSelectCustom
        placeholder="Type"
        options={CLASS_SUFFIX_TYPE_FILTER}
      />
      <SappSelectMultipleTeacher
        maxShownValues={1}
        isSelectCustom
        control={control}
        name="schedule_ids"
        placeholder="Lesson: All"
        options={
          scheduleOptions as Array<{
            label: string
            value: string
            isDisabled?: boolean
          }>
        }
        isLoading={isLoading}
        className="min-w-36"
        onSearch={handleSearch}
        onMenuScrollToBottom={() => hasNextPage && fetchNextPage()}
        onFocus={() => refetch()}
      />
    </div>
  )
}

export default ClassResourceTeacherFilter
