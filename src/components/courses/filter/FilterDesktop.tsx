import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { defaultStatusCourse } from 'src/constants'
import { DesktopFilter3LevelProps } from 'src/type/courses-3-level'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'

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
      <div className="flex items-center gap-2">
        <SAPPSelectV2
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
          className="status-course select-3lv !h-10 min-w-36"
          isSearchable={false}
        />
        <SAPPSelectV2
          control={control}
          name="status"
          options={defaultStatusCourse}
          placeholder="All"
          onChange={(val) => setFilterStatus(val)}
          label="Status:"
          labelClass="text-base text-bw-15 font-normal mr-1"
          className="status-course select-3lv !h-10 min-w-36"
          isSearchable={false}
        />
      </div>
    </div>
  )
}
