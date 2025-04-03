import { Plus } from '@assets/icons'
import SAPPInput from '@components/base/Input/SAPPInput'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import SAPPSelect from '@components/base/select/SAPPSelect'
import FilterGrid from '@components/layout/FilterGrid/FilterGrid'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { EVENT_TYPE_OPTIONS, EVENT_TYPES_ARRAY } from 'src/constants'

interface IProps {
  onSearch: ({
    eventName,
    eventType,
  }: {
    eventName: string
    eventType: (typeof EVENT_TYPES_ARRAY)[number] | ''
  }) => void
  onOpenCreate: (date: Date) => void
  loading?: boolean
}

const CalendarHead = ({ onSearch, onOpenCreate, loading }: IProps) => {
  const { control, handleSubmit, getValues, reset } = useForm<any>({
    // resolver: zodResolver(schema),
    mode: 'onSubmit',
  })

  const onSubmit = useCallback((data: any) => {
    if (!data) return

    onSearch({
      eventName: data.event_name,
      eventType: data.event_type,
    })
  }, [])

  const handleReset = useCallback(() => {
    reset({
      event_name: '',
      event_type: null,
    })
    onSearch({
      eventName: '',
      eventType: '',
    })
  }, [])

  const handleOpenCreate = useCallback(() => {
    onOpenCreate && onOpenCreate(new Date())
  }, [])

  return (
    <div className="flex flex-col p-8 pb-0">
      <div className="mb-6 flex flex-col gap-4">
        <FilterGrid>
          <SAPPInput
            name="event_name"
            control={control}
            placeholder="Search event name"
          />

          <SAPPSelect
            name="event_type"
            control={control}
            options={EVENT_TYPE_OPTIONS}
            placeholder="Event type"
          />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <SAPPButtonV2
              title="Reset"
              color="secondary"
              onClick={handleReset}
              disabled={loading}
            />
            <SAPPButtonV2
              title="Search"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            />
          </div>
          <SAPPButtonV2
            title="Add Busy Schedule"
            icon={<Plus />}
            onClick={handleOpenCreate}
          />
        </div>
      </div>
      <div className="h-[1px] border-b border-b-gray-5"></div>
    </div>
  )
}

export default CalendarHead
