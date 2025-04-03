import { IconMinusSquared, IconPlusSquared } from '@assets/icons'
import HookFormDateRange from '@components/base/datetime/HookFormDateRange'
import HookFormDateTime from '@components/base/datetime/HookFormDateTime'
import SappDrawer from '@components/base/SappDrawer'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import HookFormEventRepeat from '@components/event-repeat/HookFormEventRepeatField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MyRequestAPI } from '@pages/api/my-request'
import { REPEAT_TYPE } from '@utils/constants/repeat'
import { capitalizeFirstLetter } from '@utils/index'
import { formatRecurringSchedule, getRecurringSchedule } from '@utils/request'
import { requestValidationSchema } from '@utils/validation/my-request-validation'
import dayjs, { Dayjs } from 'dayjs'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants/my-request'
import useSelectClassCode from 'src/hooks/useSelectClassCode'
import useLesson from 'src/hooks/useSelectLesson'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getUserInformation, userReducer } from 'src/redux/slice/User/User'
import { IResponse } from 'src/redux/types'
import { ISelect } from 'src/type/course'
import { IRecurringSchedule, IRequest, IWeeklyNorm } from 'src/type/my-request'

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  reloadPage: () => void
}

function FormRequest({ open, setOpen, reloadPage }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const isEdit = params && params !== 'new' ? true : false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialStatus, setInitialStatus] = useState<string>()
  const [existedTeacher, setExistedTeacher] = useState<boolean>(false)
  const [otherOption, setOtherOption] = useState<ISelect | undefined>()
  const [detailSchedule, setDetailSchedule] = useState<any>(null)
  const { user } = useAppSelector(userReducer)

  const useFormProp = useForm<IRequest>({
    resolver: zodResolver(requestValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      request_name: '',
      request_teacher_id: '',
      request_weekly_norm: [{ date_range: [], quantity: 0 }],
      request_time_off: [{ lesson: { value: '', label: '' }, reason: '' }],
    },
  })

  const { handleSubmit, control, setValue, watch, getValues, reset, setError } =
    useFormProp

  const requestType = watch('request_type_value')
  const classCode = watch('class_code')
  const requestStatus = watch('request_status_value')
  const currentDate = watch(`request_busy_schedule.0.date_range`)
  const requestBusy = watch('request_busy_schedule')
  const repeat = watch('request_busy_schedule.0.repeat-type')
  const {
    fields: weeklyNormFields,
    append: appendNorm,
    remove: removeNorm,
  } = useFieldArray({ control, name: 'request_weekly_norm' })

  const {
    fields: timeOffFields,
    append: appendTimeoff,
    remove: removeTimeoff,
  } = useFieldArray({ control, name: 'request_time_off' })
  const {
    classes,
    hasNextPage: hasNextPageClasses,
    fetchNextPage: fetchNextPageClasses,
    isLoading: isLoadingClasses,
    isFetchingNextPage: isFetchingNextPageClasses,
    refetch: refetchClasses,
  } = useSelectClassCode(user.id)

  const {
    lessons,
    hasNextPage: hasNextPageLessons,
    fetchNextPage: fetchNextPageLessons,
    isLoading: isLoadingLessons,
    isFetchingNextPage: isFetchingNextPageLessons,
    refetch: refetchLessons,
  } = useLesson(user.id, classCode ?? '')

  // const validateRepeatData = () => {
  //   if (!getValues('request_busy_schdule.0.description')) {
  //     return setError('request_busy_schdule.0.description', {
  //       message: VALIDATE_REQUIRED,
  //     })
  //   }

  //   if (
  //     getValues('drawer-repeat') !== REPEAT_TYPE.DOES_NOT_REPEAT &&
  //     !getValues('drawer-repeat-end-on')
  //   ) {
  //     return setError('drawer-repeat-end-on', {
  //       message: VALIDATE_REQUIRED,
  //     })
  //   }
  // }

  const onSubmit = async (data: IRequest) => {
    let recurring_schedule: IRecurringSchedule | undefined = undefined
    if (
      requestType === REQUEST_TYPE.BUSY_SCHEDULE.value &&
      repeat !== REPEAT_TYPE.DOES_NOT_REPEAT &&
      repeat !== REPEAT_TYPE.CHOSEN_PATTERN
    ) {
      recurring_schedule = getRecurringSchedule(
        getValues,
        requestBusy?.[0]?.date_range?.[0] ?? new Date(),
      )
    } else if (
      requestType === REQUEST_TYPE.BUSY_SCHEDULE.value &&
      repeat === REPEAT_TYPE.CHOSEN_PATTERN &&
      detailSchedule &&
      !isEmpty(detailSchedule?.recurring_pattern_schedule)
    ) {
      const {
        interval,
        frequency,
        day_of_week,
        day_of_month,
        month_of_year,
        type,
      } = detailSchedule?.recurring_pattern_schedule
      recurring_schedule = {
        interval,
        frequency,
        recurrence_end_date: dayjs(
          getValues('request_busy_schedule.0.drawer-repeat-end-on'),
        )
          .endOf('day')
          .toDate(),
        day_of_week,
        day_of_month,
        month_of_year,
        type,
      }
    }

    const formattedBusyScheduleData = {
      event_name: data.request_name,
      range: {
        start_time:
          dayjs(getValues('request_busy_schedule.0.date_range.0')).format(
            'YYYY-MM-DDTHH:mm:ss',
          ) ?? '',
        end_time:
          dayjs(getValues('request_busy_schedule.0.date_range.1')).format(
            'YYYY-MM-DDTHH:mm:ss',
          ) ?? '',
      },
      repeat:
        data.request_busy_schedule?.[0]['repeat-type'] !==
        REPEAT_TYPE.DOES_NOT_REPEAT,
      recurring_schedule,
      description: getValues('request_busy_schedule.0.description') ?? '',
      status: data.request_status_value,
    }

    const formattedWeeklyNormData = {
      request_name: data.request_name,
      request_type: data.request_type_value,
      status: data.request_status_value,
      time: data.request_weekly_norm?.map((item: IWeeklyNorm) => {
        return {
          start_date: dayjs(item.start_time).format('YYYY-MM-DDTHH:mm:ss'),
          end_date: dayjs(item.end_time).format('YYYY-MM-DDTHH:mm:ss'),
          quantity: item.quantity,
        }
      }),
      note: data.note?.length ? data.note : null,
    }
    const formattedTimeoffData = {
      request_name: data.request_name,
      teacher_id: user.id,
      scheduleAdjustments: data.request_time_off?.map((item) => ({
        id: item.lesson.value,
        reason: item.reason,
      })),
      status: data.request_status_value,
    }
    try {
      let response: IResponse<any> = {
        success: false,
        data: null,
        error: {
          code: '',
          message: '',
          others: '',
        },
      }
      // Sending request based on whether it's an edit or create request
      if (params && params !== 'new') {
        response =
          requestType == REQUEST_TYPE.BUSY_SCHEDULE.value
            ? await MyRequestAPI.editBusySchedule(
                params as string,
                formattedBusyScheduleData,
              )
            : await MyRequestAPI.editWeeklyNorm(
                params as string,
                formattedWeeklyNormData,
              )
      } else {
        if (requestType == REQUEST_TYPE.BUSY_SCHEDULE.value) {
          response = await MyRequestAPI.createBusySchedule(
            formattedBusyScheduleData,
          )
        } else if (requestType == REQUEST_TYPE.WEEKLY_NORM.value) {
          response = await MyRequestAPI.createWeeklyNorms(
            formattedWeeklyNormData,
          )
        } else if (requestType == REQUEST_TYPE.TIMEOFF.value) {
          response =
            await MyRequestAPI.createTimeoffRequest(formattedTimeoffData)
        } else {
          response =
            await MyRequestAPI.createChangeTeachingModeRequest(
              formattedTimeoffData,
            )
        }
      }
      // Handle success response
      if (response?.success) {
        reset()
        reloadPage()
        toast.success('Request saved successfully!')
        setOpen(false)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      // Logging error for debugging purposes
      toast.error('An error occurred. Please try again.')
    } finally {
      // setLoading(false)
    }
  }

  const disabledDate = (current: Dayjs) => {
    if (!current) return false

    const isMonday = current.day() === 1 // Monday
    const isSunday = current.day() === 0 // Sunday

    return !(isMonday || isSunday)
  }

  const loadData = async () => {
    if (params && params !== 'new') {
      try {
        setLoading(true)
        const { data } = await MyRequestAPI.getRequestDetail(params as string)

        if (data) {
          setValue('request_name', data.name)

          setValue(
            'request_status_value',
            capitalizeFirstLetter(
              data.status.toLowerCase() == 'cancel'
                ? 'Cancelled'
                : data.status.toLowerCase() == 'reject'
                  ? 'Rejected'
                  : data.status,
            ) ?? '',
          )
          setValue(
            'request_status',
            Object.values(REQUEST_STATUS).find((item) =>
              item.value.toLowerCase().includes(data.status.toLowerCase()),
            ),
          )
          setValue(
            'request_create_date',
            dayjs(data.created_at).format('DD-MM-YYYY'),
          )

          setInitialStatus(
            capitalizeFirstLetter(
              data.status.toLowerCase() == 'cancel'
                ? 'Cancel'
                : data.status.toLowerCase() == 'reject'
                  ? 'Rejected'
                  : data.status,
            ),
          )
          setValue('request_type_value', data.type)

          setValue(
            'request_type',
            Object.values(REQUEST_TYPE).find(
              (item) => item.value.toLowerCase() == data.type.toLowerCase(),
            ) ?? { value: '', label: 'Select an option' },
          )

          setValue('request_teacher_id', data.user_request.id)
          if (data.user_request.id) {
            setExistedTeacher(true)
          }

          setValue('note', data.description ?? '')

          if (data.type == REQUEST_TYPE.BUSY_SCHEDULE.value) {
            setDetailSchedule(data.teacher_schedules[0].schedule)
            setValue('request_busy_schedule.0.date_range', [
              new Date(data.teacher_schedules[0].schedule.start_date + 'Z'),
              new Date(data.teacher_schedules[0].schedule.end_date + 'Z'),
            ])

            if (
              !isEmpty(
                data.teacher_schedules[0].schedule.recurring_pattern_schedule,
              )
            ) {
              setOtherOption({
                label: formatRecurringSchedule(
                  data.teacher_schedules[0].schedule.recurring_pattern_schedule,
                ),
                value: REPEAT_TYPE.CHOSEN_PATTERN,
              })
              setValue(
                'request_busy_schedule.0.repeat-type',
                REPEAT_TYPE.CHOSEN_PATTERN,
              )
              setValue(
                'request_busy_schedule.0.drawer-repeat-end-on',
                dayjs(
                  data.teacher_schedules[0].schedule.recurring_pattern_schedule
                    .end_date,
                ).toDate(),
              )
            } else {
              setValue(
                'request_busy_schedule.0.repeat-type',
                REPEAT_TYPE.DOES_NOT_REPEAT,
              )
            }
            setValue(
              'request_busy_schedule.0.description',
              data.teacher_schedules[0].schedule.description,
            )
          } else if (data.type == REQUEST_TYPE.WEEKLY_NORM.value) {
            setValue(
              'request_weekly_norm',
              data.teacher_weekly_norms.map((item) => {
                let startTime = new Date(`${item.start_date}`).toISOString()
                let endTime = new Date(`${item.end_date}`).toISOString()
                return {
                  date_range: [startTime, endTime],
                  quantity: item.max_shift,
                }
              }),
            )
          } else if (
            [
              REQUEST_TYPE.TIMEOFF.value,
              REQUEST_TYPE.TEACHING_MODE.value,
            ].includes(data.type)
          ) {
            setValue('class', {
              value:
                data.teacher_schedules[0].schedule.class_schedule?.class.id,
              label:
                data.teacher_schedules[0].schedule.class_schedule?.class.code,
            })
            setValue(
              'class_code',
              data.teacher_schedules[0].schedule.class_schedule?.class.id,
            )
            setValue(
              'request_time_off',
              data.teacher_schedules.map((item) => ({
                lesson: {
                  value: item.schedule.id,
                  label: item.schedule.name,
                },
                reason: item.request_reason,
              })),
            )
          }
          setValue(
            'request_approver',
            data.staff_assignee.detail.full_name ?? '',
          )
          setValue('request_creator', data.staff_request.detail.full_name ?? '')
        } else {
          toast.error('Something wrong!')
        }
      } catch (error: any) {
      } finally {
        setLoading(false)
      }
    }
  }
  useLayoutEffect(() => {
    loadData()
  }, [params])

  useEffect(() => {
    dispatch(getUserInformation())
  }, [])

  function selectStatusOption(option: string | undefined) {
    switch (option?.toLowerCase()) {
      case REQUEST_STATUS.APPROVED.value.toLowerCase():
        return [REQUEST_STATUS.CANCELLED]

      case REQUEST_STATUS.PENDING.value.toLowerCase():
        return [REQUEST_STATUS.APPROVED, REQUEST_STATUS.REJECTED]

      default:
        return [
          REQUEST_STATUS.PENDING,
          REQUEST_STATUS.APPROVED,
          REQUEST_STATUS.REJECTED,
          REQUEST_STATUS.CANCELLED,
        ]
    }
  }

  return (
    <SappDrawer
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => setOpen(false)}
      title={`${router.query.id ? 'Edit' : 'Add More'} Request`}
      footer={true}
      btnSubmitTile="Save"
      confirmOnClose={true}
      sizeTextBtn="medium"
      handleSubmit={() => {
        handleSubmit((data: any) => {
          // setLoading(true)
          setTimeout(() => {
            onSubmit(data)
          })
        })()
      }}
      heightBody={'h-[calc(100vh-146px)]'}
    >
      <div className="mb-6">
        <HookFormTextField
          label={'Request Name'}
          required
          control={control}
          name="request_name"
          placeholder={'Request name'}
          labelClass="text-sm font-medium"
          disabled={
            isEdit &&
            requestStatus?.toLowerCase() !==
              REQUEST_STATUS.PENDING.value.toLowerCase()
          }
        ></HookFormTextField>
      </div>
      <div className="mb-6">
        <SappHookFormSelect
          control={control}
          label="Request Type"
          name="request_type"
          placeholder="Type"
          required
          className="text-base font-medium"
          onChange={(e) => setValue('request_type_value', e.value)}
          options={[
            REQUEST_TYPE.BUSY_SCHEDULE,
            REQUEST_TYPE.WEEKLY_NORM,
            REQUEST_TYPE.TIMEOFF,
            REQUEST_TYPE.TEACHING_MODE,
          ]}
          isDisabled={isEdit}
          labelClass="text-sm font-medium"
        />
      </div>
      {isEdit ? (
        <>
          <div className="mb-6">
            <SappHookFormSelect
              control={control}
              label="Status"
              name="request_status"
              options={[
                REQUEST_STATUS.PENDING,
                REQUEST_STATUS.APPROVED,
                REQUEST_STATUS.REJECTED,
                REQUEST_STATUS.CANCELLED,
              ]}
              isDisabled={
                isEdit &&
                requestStatus?.toLowerCase() !==
                  REQUEST_STATUS.APPROVED.value.toLowerCase()
              }
              onChange={(e) => setValue('request_status_value', e.value)}
              labelClass="text-sm font-medium"
            />
          </div>
          <div className="mb-6">
            <HookFormTextField
              label={'Creator'}
              control={control}
              name="request_creator"
              placeholder={'Creator name'}
              disabled={isEdit}
              labelClass="text-sm font-medium"
            ></HookFormTextField>
          </div>
          <div className="mb-6">
            <HookFormTextField
              control={control}
              label="Create Date"
              name={`request_create_date`}
              placeholder="Create date"
              disabled={isEdit}
              labelClass="text-sm font-medium"
            />
          </div>
          <div className="mb-6">
            <HookFormTextField
              label={'Approver'}
              control={control}
              name="request_approver"
              placeholder={'Approver'}
              disabled={isEdit}
              labelClass="text-sm font-medium"
            ></HookFormTextField>
          </div>
        </>
      ) : null}
      <div className="mb-6">
        {requestType == REQUEST_TYPE.WEEKLY_NORM.value ? (
          <HookFormTextField
            label={'Note'}
            control={control}
            name="note"
            placeholder={'Note'}
            labelClass="text-sm font-medium"
            disabled={
              isEdit &&
              requestStatus?.toLowerCase() !==
                REQUEST_STATUS.PENDING.value.toLowerCase()
            }
          ></HookFormTextField>
        ) : (
          <SappHookFormSelect
            control={control}
            label="Class Code"
            required
            labelClass="text-sm font-medium"
            name="class"
            isSearchable
            onSearch={() => refetchClasses()}
            onChange={(e) => setValue('class_code', e.value)}
            isLoading={isLoadingClasses}
            onMenuScrollToBottom={() =>
              hasNextPageClasses && fetchNextPageClasses()
            }
            placeholder="Class Code"
            options={classes.map((item) => ({
              value: item?.id,
              label: item?.code,
            }))}
          />
        )}
      </div>
      <div className="mb-8">
        <label className="mb-5 flex items-center text-base font-bold">
          {capitalizeFirstLetter(
            Object.values(REQUEST_TYPE)
              .find((item) => item?.value == requestType)
              ?.label?.replace('_', ' '),
          )}
        </label>
      </div>

      {requestType == REQUEST_TYPE.BUSY_SCHEDULE.value && (
        <>
          <div className="mb-6">
            <HookFormDateRange
              control={control}
              required
              label="Start Date - End Date"
              name={`request_busy_schedule.0.date_range`}
              placeholder
              format="YYYY-MM-DD"
              showTime={false}
              // disabledDate={disabledDate}
              disabled={
                isEdit &&
                requestStatus?.toLowerCase() !==
                  REQUEST_STATUS.PENDING.value.toLowerCase()
              }
              labelClass="text-sm font-medium"
            />
          </div>
          <div className="mb-6">
            <HookFormEventRepeat
              control={control}
              name="request_busy_schedule"
              defaultDate={dayjs(currentDate?.[1]).toDate()}
              repeatOption={otherOption}
            />
          </div>
          <div className="mb-6">
            <HookFormTextField
              label={'Description'}
              required
              control={control}
              name={`request_busy_schedule.0.description`}
              placeholder={'Description'}
              onChange={(e) =>
                setValue(`request_busy_schedule.0.description`, e.target.value)
              }
              labelClass="text-sm font-medium"
              disabled={
                isEdit &&
                requestStatus?.toLowerCase() !==
                  REQUEST_STATUS.PENDING.value.toLowerCase()
              }
            ></HookFormTextField>
          </div>
        </>
      )}
      {requestType == REQUEST_TYPE.WEEKLY_NORM.value &&
        weeklyNormFields.map((item, index) => {
          return (
            <div key={item.id}>
              <div className="mb-6">
                <div className="grid w-full grid-cols-2 gap-x-6">
                  <div>
                    <HookFormDateRange
                      control={control}
                      required
                      label="Start Date - End Date"
                      name={`request_weekly_norm.${index}.date_range`}
                      placeholder
                      format="YYYY-MM-DD | HH:mm:ss"
                      showTime
                      disabledDate={disabledDate}
                      labelClass="text-sm font-medium"
                      disabled={
                        isEdit &&
                        requestStatus?.toLowerCase() !==
                          REQUEST_STATUS.PENDING.value.toLowerCase()
                      }
                    />
                  </div>
                  <div>
                    <HookFormTextField
                      label={'Quantity'}
                      required
                      type="number"
                      control={control}
                      name={`request_weekly_norm.${index}.quantity`}
                      placeholder={'Quantity'}
                      labelClass="text-sm font-medium"
                      onChange={(e) =>
                        setValue(
                          `request_weekly_norm.${index}.quantity`,
                          Number(e.target.value),
                        )
                      }
                      disabled={
                        isEdit &&
                        requestStatus?.toLowerCase() !==
                          REQUEST_STATUS.PENDING.value.toLowerCase()
                      }
                    ></HookFormTextField>
                  </div>
                </div>
              </div>
              <div
                className="mb-6 flex cursor-pointer items-center gap-x-3"
                onClick={() => removeNorm(index)}
              >
                <IconMinusSquared />
                <span className="text-sm font-medium">Delete Weekly Norm</span>
              </div>
            </div>
          )
        })}
      {requestType == REQUEST_TYPE.TIMEOFF.value &&
        timeOffFields.map((item, index) => {
          return (
            <div key={index}>
              <div className="mb-6">
                <div className="grid w-full grid-cols-2 gap-x-6">
                  <div>
                    <div className="mb-6">
                      <SappHookFormSelect
                        control={control}
                        label="Lesson"
                        required
                        name={`request_time_off.${index}.lesson`}
                        isSearchable
                        onSearch={() => refetchLessons()}
                        isLoading={isLoadingLessons}
                        onMenuScrollToBottom={() =>
                          hasNextPageLessons && fetchNextPageLessons()
                        }
                        labelClass="text-sm font-medium"
                        placeholder="Lesson"
                        options={lessons.map((item) => ({
                          value: item?.id,
                          label: item?.name,
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <HookFormTextField
                      label={'Reason'}
                      required
                      control={control}
                      name={`request_time_off.${index}.reason`}
                      placeholder={'Reason'}
                      labelClass="text-sm font-medium"
                    ></HookFormTextField>
                  </div>
                </div>
              </div>
              <div
                className="mb-6 flex cursor-pointer items-center gap-x-3"
                onClick={() => removeTimeoff(index)}
              >
                <IconMinusSquared />

                <span className="text-sm font-medium">Delete Timeoff</span>
              </div>
            </div>
          )
        })}
      {requestType !== REQUEST_TYPE.BUSY_SCHEDULE.value && !isEdit ? (
        <div
          className="mb-12 flex cursor-pointer items-center gap-x-3"
          onClick={() =>
            requestType == REQUEST_TYPE.BUSY_SCHEDULE.value
              ? null
              : requestType == REQUEST_TYPE.WEEKLY_NORM.value
                ? appendNorm({ date_range: [], quantity: 0 })
                : appendTimeoff({
                    lesson: { value: '', label: '' },
                    reason: '',
                  })
          }
        >
          <IconPlusSquared />

          <span className="fs-6 fw-medium text-primary">
            {capitalizeFirstLetter(
              Object.values(REQUEST_TYPE)
                .find(
                  (item) =>
                    item.value.toLowerCase() == requestType?.toLowerCase(),
                )
                ?.label?.replace('_', ' '),
            )}
          </span>
        </div>
      ) : null}
    </SappDrawer>
  )
}

export default FormRequest
