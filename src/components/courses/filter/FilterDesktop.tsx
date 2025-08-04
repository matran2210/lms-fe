import React, { useEffect } from 'react'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { defaultStatusCourse } from 'src/constants'
import { DesktopFilter3LevelProps } from 'src/type/courses-3-level'

export default function DesktopFilter3Level({
  courses,
  filterType,
  filterStatus,
  setFilterType,
  setFilterStatus,
  totalResults,
}: DesktopFilter3LevelProps) {
  const { control, setValue } = useForm()

  useEffect(() => {
    setValue('type', filterType)
    setValue('status', filterStatus)
  }, [filterType, filterStatus, setValue])

  const defaultCategory = [{ label: 'All', value: '' }]

  return (
    <div className="hidden items-center filter md:flex">
      <div className="pr-4 text-base font-medium text-bw-15">
        {`${totalResults} ${totalResults > 1 ? 'Results' : 'Result'}`}
      </div>
      <div className="flex items-center rounded-lg border border-gray-v2-300 bg-white px-3 py-2 text-black">
        <SappHookFormSelect
          control={control}
          name="type"
          options={defaultCategory.concat(
            courses?.total?.map((cat) => ({
              label: cat.categoryName,
              value: cat.categoryName,
            })) || [],
          )}
          placeholder="All"
          onChange={(val) => setFilterType(val)}
          label="Category:"
          labelClass="text-base text-bw-15 font-normal mr-1"
          className="status-course select-3lv"
          isSearchable={false}
        />
      </div>
      <div className="ml-2 flex items-center rounded-lg border border-gray-v2-300 bg-white px-3 py-2">
        <SappHookFormSelect
          control={control}
          name="status"
          options={defaultStatusCourse}
          placeholder="All"
          onChange={(val) => setFilterStatus(val)}
          label="Status:"
          labelClass="text-base text-bw-15 font-normal mr-1"
          className="status-course select-3lv"
          isSearchable={false}
        />
      </div>
    </div>
  )
}
