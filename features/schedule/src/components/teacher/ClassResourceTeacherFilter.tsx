import { SearchIcon } from '@lms/assets'
import { CLASS_SUFFIX_TYPE_FILTER } from '@lms/core'
import { useSelectClassSchedule } from '@lms/hooks'
import {
  HookFormTextField,
  SappHookFormSelect,
  SappSelectMultipleTeacher,
} from '@lms/ui'
import { getSelectOptions } from '@lms/utils'
import { debounce } from 'lodash'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Control } from 'react-hook-form'
interface IProps {
  control: Control<any>
}

const ClassResourceTeacherFilter: React.FC<IProps> = ({ control }) => {
  const params = useParams()
  const { id } = params
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { classSchedule, hasNextPage, fetchNextPage, isLoading, refetch } =
    useSelectClassSchedule(id as string, search, isOpen)

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
        inputClassName="placeholder:text-sm placeholder:text-accent placeholder:font-medium"
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
        onFocus={() => {
          setIsOpen(true)
        }}
        isLoading={isLoading}
        className="min-w-36"
        onSearch={handleSearch}
        onInputChange={(val) => handleSearch(val)}
        onMenuScrollToBottom={() => hasNextPage && fetchNextPage()}
      />
    </div>
  )
}

export default ClassResourceTeacherFilter
