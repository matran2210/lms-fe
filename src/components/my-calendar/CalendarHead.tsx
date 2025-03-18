import { Plus } from '@assets/icons'
import SAPPInput from '@components/base/Input/SAPPInput'
import SAPPButton from '@components/base/button/SAPPButton'
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
}

const CalendarHead = ({ onSearch, onOpenCreate }: IProps) => {
  const { control, handleSubmit, getValues, reset } = useForm<any>({
    // resolver: zodResolver(schema),
    mode: 'onSubmit',
  })

  const onSubmit = useCallback((data: any) => {
    if (!data || (!data.event_name && !data.event_type)) return

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
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-4">
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
            <SAPPButton title="Reset" color="secondary" onClick={handleReset} />
            <SAPPButton
              title="Search"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          <SAPPButton
            title="Add Busy Schedule"
            color="primary"
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
