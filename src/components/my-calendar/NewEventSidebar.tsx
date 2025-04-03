import SAPPButton from '@components/base/button/SappButton'
import HookFormDateRange from '@components/base/date/HookFormDateRange'
import SAPPInput from '@components/base/Input/SAPPInput'
import HookFormEventRepeat from '@components/event-repeat/HookFormEventRepeatField'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { ConfigProvider, Drawer } from 'antd'
import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import {
  ANT_THEME_CONFIG,
  CALENDAR_SIDEBAR_CANCEL_BUTTON,
  CALENDAR_SIDEBAR_EVENT_FORM,
  CALENDAR_SIDEBAR_SAVE_BUTTON,
  CALENDAR_SIDEBAR_TITLE,
  CONFIRM_CANCEL,
  EVENT_TYPES,
} from 'src/constants'
import { SchedulesAPI } from 'src/pages/api/schedules'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import {
  ICreateScheduleForm,
  ICreateSchedulePayload,
} from 'src/redux/types/Schedule/schedule'
import { z } from 'zod'

interface IProps {
  currentDate: Date | null
  isOpenCreate: boolean
  setIsOpenCreate: React.Dispatch<React.SetStateAction<boolean>>
}

const NewEventSidebar = ({
  currentDate,
  isOpenCreate,
  setIsOpenCreate,
}: IProps) => {
  const dispatch = useAppDispatch()

  const validationSchema = z.object({
    event_name: z.string().trim().min(1, VALIDATE_REQUIRED),
    range: z
      .array(z.date(), { invalid_type_error: 'Required' })
      .refine((val) => val.length === 2, {
        message: 'Both start and end time are required',
      })
      .refine((val) => val[0] !== undefined, {
        message: 'Start time is required',
      })
      .refine((val) => val[1] !== undefined, {
        message: 'End time is required',
      }),
    repeat: z
      .object({
        // repeat: z.boolean(),
        // recurring_schedule: z.object({
        //   interval: z.number().min(1, '').max(365, ''),
        //   frequency: z.string(),
        //   recurrence_end_date: z.date(),
        //   day_of_week: z.array(z.number().min(0, '').max(6, '')),
        // }),
      })
      .optional(),
    description: z.string().trim().min(1, VALIDATE_REQUIRED),
  })

  const {
    watch,
    control,
    handleSubmit,
    setValue: setFormValue,
    getValues,
    reset,
  } = useForm<ICreateScheduleForm>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

  const onSubmit = async () => {
    const formValues = getValues()
    const payload = {
      event_name: formValues.event_name,
      event_type: EVENT_TYPES.BUSY,
      start_time: formValues.range[0].toISOString(),
      end_time: formValues.range[1].toISOString(),
      description: formValues.description,
      repeat: formValues.repeat?.recurring_schedule,
    } as ICreateSchedulePayload
    const formattedPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== null && value !== '' && value !== undefined,
      ),
    ) as ICreateSchedulePayload

    const response = await SchedulesAPI.create(formattedPayload)
    if (response.success) {
      toast.success(
        'Request created successfully. Please wait for CX Admin to approve your request',
      )
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpenCreate(false)
    reset()
  }

  const handleCancel = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: handleClose }),
    )
  }

  useEffect(() => {
    if (currentDate === null) {
      // Reset form when currentDate changes (close sidebar)
      reset()
    } else {
      // Init value for start time and end time
      const endTime = new Date(currentDate)
      endTime.setHours(currentDate.getHours() + 1)

      setFormValue('range', [currentDate, endTime])
    }
  }, [currentDate, reset, setFormValue])

  return (
    <ConfigProvider theme={ANT_THEME_CONFIG}>
      <Drawer
        open={isOpenCreate}
        title={undefined}
        onClose={handleCancel}
        width={'960px'}
        closeIcon={false}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between border-b border-b-gray-5 px-8 py-5">
            <span className="font-sans text-lg font-semibold">
              {CALENDAR_SIDEBAR_TITLE}
            </span>
            <span className="cursor-pointer" onClick={handleCancel}>
              <SappIcon icon="closeicon" />
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {currentDate && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Event name */}
                <div className="mb-6">
                  <SAPPInput
                    label={CALENDAR_SIDEBAR_EVENT_FORM.EVENT_NAME}
                    name="event_name"
                    placeholder="Please enter event name"
                    control={control}
                    required
                    className="h-11.25"
                  />
                </div>

                {/* Start Time - end time */}
                <div className="mb-6">
                  <HookFormDateRange
                    name="range"
                    label="Start Time - End Time"
                    control={control}
                    required
                    inputClassName="h-11.25 w-full rounded-md"
                  />
                </div>

                {/* Repeat */}
                <div className="mb-6">
                  <HookFormEventRepeat
                    control={control}
                    name="repeat"
                    required={true}
                    defaultDate={currentDate}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <SAPPInput
                    label={CALENDAR_SIDEBAR_EVENT_FORM.DESCRIPTION}
                    name="description"
                    placeholder="Please enter description"
                    control={control}
                    required
                    className="h-11.25"
                  />
                </div>
              </form>
            )}
          </div>
          <div className="flex justify-end border-t border-t-gray-5 px-8 py-5">
            <SAPPButton
              title={CALENDAR_SIDEBAR_CANCEL_BUTTON}
              onClick={handleCancel}
              className="mr-4"
              color="secondary"
            />
            <SAPPButton
              title={CALENDAR_SIDEBAR_SAVE_BUTTON}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  )
}

export default memo(NewEventSidebar)
