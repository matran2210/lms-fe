import SappButton from '@components/base/button/SappButton'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import SappIcon from 'src/common/SappIcon'
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
      eventType: data.event_type ? data.event_type.value : '',
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
    <div className="-mb-8 w-full rounded-tl-lg rounded-tr-lg bg-white px-8 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="mb-4 flex">
          <div className="mr-6 min-w-[326px]">
            <HookFormTextField
              name="event_name"
              control={control}
              placeholder="Search by name"
              className="h-10 max-w-[326px]"
              inputClassName="h-10 font-inter text-xsm font-medium leading-[14px] tracking-normal text-gray-11"
            />
          </div>
          <SappHookFormSelect
            name="event_type"
            control={control}
            options={EVENT_TYPE_OPTIONS}
            isSearchable={false}
            isClearable={true}
            placeholder="Event type"
            className="rounded-0 h-10 w-[326px] text-gray-11 placeholder:text-gray-11"
          />
        </div>
        <div className="flex justify-between">
          <div className="a">
            <SappButton
              type="reset"
              title="Reset"
              className="mr-3 !h-10 text-gray-12"
              color="secondary"
              onClick={handleReset}
            />
            <SappButton type="submit" title="Search" className="!h-10" />
          </div>
          <SappButtonIcon
            title="Add Busy Schedule"
            isBgPrimary={true}
            className="!h-10 px-4"
            classTitle="text-white"
            onClick={handleOpenCreate}
          >
            <SappIcon icon="plus" />
          </SappButtonIcon>
        </div>
      </form>
      <div className="h-[1px] border-b border-b-gray-5"></div>
    </div>
  )
}

export default CalendarHead
