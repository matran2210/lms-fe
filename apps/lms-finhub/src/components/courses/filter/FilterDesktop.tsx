import { defaultStatusCourse } from '@lms/core'
import { SAPPSelect } from '@lms/ui'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
  const [hasTypeInteracted, setHasTypeInteracted] = useState(false)
  const [hasStatusInteracted, setHasStatusInteracted] = useState(false)

  // Helper function để xử lý hiển thị giá trị
  const handleSelectValue = (
    filterValue: string | undefined,
    hasInteracted: boolean,
  ) => {
    if (hasInteracted) {
      // Sau khi user đã tương tác, luôn hiển thị giá trị
      return filterValue ?? undefined
    } else {
      // Lần đầu vào: hiển thị placeholder khi giá trị là rỗng (All)
      return filterValue && filterValue !== '' ? filterValue : undefined
    }
  }

  // Helper function để xử lý onChange
  const handleSelectChange = (
    val: string,
    setHasInteracted: (value: boolean) => void,
    setFilter: (value: { label: string; value: string }) => void,
    options: Array<{ label: string; value: string }>,
  ) => {
    setHasInteracted(true)
    setFilter({
      label: options.find((item) => item.value === val)?.label || '',
      value: val,
    })
  }

  useEffect(() => {
    setValue('type', handleSelectValue(filterType?.value, hasTypeInteracted))
    setValue(
      'status',
      handleSelectValue(filterStatus?.value, hasStatusInteracted),
    )
  }, [
    filterType,
    filterStatus,
    setValue,
    hasTypeInteracted,
    hasStatusInteracted,
  ])

  const defaultCategory = [{ label: 'All', value: '' }]
  const optionsType = defaultCategory.concat(
    courses?.total?.map((cat) => ({
      label: cat.categoryName,
      value: cat.categoryName,
    })) || [],
  )
  return (
    <div className="hidden items-center filter md:flex">
      <div className="pr-4 text-sm font-normal text-bw-15">
        {`${totalResults} ${totalResults > 1 ? 'Results' : 'Result'}`}
      </div>
      <div className="flex items-center gap-2">
        <SAPPSelect
          control={control}
          name="type"
          options={optionsType}
          placeholder="Category"
          onChange={(val) =>
            handleSelectChange(
              val,
              setHasTypeInteracted,
              setFilterType,
              optionsType,
            )
          }
          className="status-course select-3lv !h-10 min-w-36"
          isSearchable={false}
        />
        <SAPPSelect
          control={control}
          name="status"
          options={defaultStatusCourse}
          placeholder="Status"
          onChange={(val) =>
            handleSelectChange(
              val,
              setHasStatusInteracted,
              setFilterStatus,
              defaultStatusCourse,
            )
          }
          className="status-course select-3lv !h-10 min-w-36"
          isSearchable={false}
        />
      </div>
    </div>
  )
}
