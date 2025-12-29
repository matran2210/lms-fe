import SappTeacherTextField from '@components/teacher/components/sapp-textfield/SappTeacherTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  confirmDialog,
  ICreateScheduleForm,
  ICreateSchedulePayload,
  useAppDispatch,
} from '@lms/contexts'
import {
  ANT_THEME_CONFIG,
  CALENDAR_SIDEBAR_CANCEL_BUTTON,
  CALENDAR_SIDEBAR_EVENT_FORM,
  CALENDAR_SIDEBAR_SAVE_BUTTON,
  CALENDAR_SIDEBAR_TITLE,
  CONFIRM_CANCEL,
  EVENT_REPEAT_TYPES,
  EVENT_TYPES,
  REPEAT_TYPE,
} from '@lms/core'
import { HookFormDateRangeV2, SAPPButtonV2, SappIcon } from '@lms/ui'
import HookFormEventRepeat from '@lms/ui/components/event-repeat/HookFormEventRepeatField'
import { handleDisableDate, handleDisableTime } from '@lms/utils'
import { SchedulesAPI } from 'src/api/schedules'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { ConfigProvider, Drawer } from 'antd'
import { Dayjs } from 'dayjs'
import { isInteger } from 'lodash'
import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
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
  const [isLoading, setIsLoading] = useState(false)
  const [isResetRepeat, setIsResetRepeat] = useState(false)
  const [isResetEndOn, setIsResetEndOn] = useState(false)
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
    setError,
  } = useForm<ICreateScheduleForm>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

  const onSubmit = async () => {
    const formValues = getValues()
    const payload = {
      event_name: formValues.event_name,
      event_type: EVENT_TYPES.BUSY,
      range: {
        start_time: formValues.range[0].toISOString(),
        end_time: formValues.range[1].toISOString(),
      },
      description: formValues.description,
      ...formValues.repeat,
    } as ICreateSchedulePayload
    const formattedPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== null && value !== '' && value !== undefined,
      ),
    ) as ICreateSchedulePayload

    // Start validate
    if (
      formValues.repeat?.recurring_schedule &&
      formValues.repeat.recurring_schedule.type !==
        EVENT_REPEAT_TYPES.NO_REPEAT &&
      !formValues.repeat.recurring_schedule.recurrence_end_date
    ) {
      return setError('repeat', {
        message: 'End on is required',
      })
    }

    if (
      formValues.repeat?.recurring_schedule?.type === REPEAT_TYPE.CUSTOM &&
      !isInteger(formValues.repeat?.recurring_schedule?.interval)
    ) {
      return toast.error('Repeat interval must be a number')
    }
    // End validate

    setIsLoading(true)
    try {
      const response = await SchedulesAPI.create(formattedPayload)
      if (response.success) {
        toast.success(
          'Request created successfully. Please wait for CX Admin to approve your request',
        )
        handleClose()
      }
    } catch (error) {
      // Handled by axios interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setIsResetRepeat(true)
    setIsOpenCreate(false)
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
          <div className="flex items-center justify-between border-b border-b-[#7E8299] px-8 py-5">
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
                  <SappTeacherTextField
                    label={CALENDAR_SIDEBAR_EVENT_FORM.EVENT_NAME}
                    name="event_name"
                    placeholder="Please enter event name"
                    control={control}
                    required
                    className="rounded-md"
                  />
                </div>

                {/* Start Time - end time */}
                <div className="mb-6">
                  <HookFormDateRangeV2
                    name="range"
                    label="Start Time - End Time"
                    control={control}
                    required
                    disabledDate={(targetDate: Dayjs) =>
                      handleDisableDate(new Date(), targetDate)
                    }
                    disabledTime={handleDisableTime}
                  />
                </div>

                {/* Repeat */}
                <div className="mb-6">
                  <HookFormEventRepeat
                    control={control}
                    name="repeat"
                    required
                    defaultDate={currentDate}
                    resetRepeat={isResetRepeat}
                    setResetRepeat={setIsResetRepeat}
                    rangeDate={watch('range')}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <SappTeacherTextField
                    label={CALENDAR_SIDEBAR_EVENT_FORM.DESCRIPTION}
                    name="description"
                    placeholder="Please enter description"
                    control={control}
                    required
                    className="rounded-md"
                  />
                </div>
              </form>
            )}
          </div>
          <div className="flex justify-end border-t border-t-[#7E8299] px-8 py-5">
            <SAPPButtonV2
              title={CALENDAR_SIDEBAR_CANCEL_BUTTON}
              onClick={handleCancel}
              className="mr-4"
              color="secondary"
            />
            <SAPPButtonV2
              title={CALENDAR_SIDEBAR_SAVE_BUTTON}
              onClick={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  )
}

export default memo(NewEventSidebar)
