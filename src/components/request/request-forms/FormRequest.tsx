import { IconMinusSquared, IconPlusSquared } from '@assets/icons'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import HookFormDateRange from '@components/base/date/HookFormDateRange'
import SAPPInput from '@components/base/Input/SAPPInput'
import SappDrawer from '@components/base/SappDrawer'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import SAPPSelect from '@components/base/select/SAPPSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import HookFormEventRepeat from '@components/event-repeat/HookFormEventRepeatField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MyRequestAPI } from '@pages/api/my-request'
import { REPEAT_TYPE } from '@utils/constants/repeat'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { capitalizeFirstLetter } from '@utils/index'
import { formatRecurringSchedule, getRecurringSchedule } from '@utils/request'
import { requestValidationSchema } from '@utils/validation/my-request-validation'
import { ConfigProvider, Drawer } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import {
  ANT_THEME_CONFIG,
  CALENDAR_SIDEBAR_TITLE,
  CONFIRM_CANCEL,
} from 'src/constants'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants/my-request'
import useSelectClassCode from 'src/hooks/useSelectClassCode'
import useLesson from 'src/hooks/useSelectLesson'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
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
      request_busy_schedule: [{ repeat: REPEAT_TYPE.DOES_NOT_REPEAT }],
      request_weekly_norm: [{ quantity: 0 }],
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
  const requestNorm = watch('request_weekly_norm')
  const requestTimeoff = watch('request_time_off')
  const repeat = watch('request_busy_schedule.0.repeat')
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

  const validateRepeatData = () => {
    if (!getValues('request_busy_schedule.0.description')) {
      return setError('request_busy_schedule.0.description', {
        message: VALIDATE_REQUIRED,
      })
    }

    if (
      getValues('request_busy_schedule.0.repeat') !==
        REPEAT_TYPE.DOES_NOT_REPEAT &&
      !getValues('request_busy_schedule.0.drawer-repeat-end-on')
    ) {
      return setError('request_busy_schedule.0.drawer-repeat-end-on', {
        message: VALIDATE_REQUIRED,
      })
    }
  }

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
      validateRepeatData()
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
      validateRepeatData()
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
        data.request_busy_schedule?.[0]['repeat'] !==
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
        error: { code: '', message: '', others: '' },
      }
      // Sending request based on whether it's an edit or create request
      if (params && params !== 'new') {
        response =
          requestType == REQUEST_TYPE.BUSY_SCHEDULE.value
            ? await MyRequestAPI.editBusySchedule(
                params as string,
                formattedBusyScheduleData,
              )
            : requestType == REQUEST_TYPE.WEEKLY_NORM.value
              ? await MyRequestAPI.editWeeklyNorm(
                  params as string,
                  formattedWeeklyNormData,
                )
              : requestType == REQUEST_TYPE.TIMEOFF.value
                ? await MyRequestAPI.editTimeoffRequest(
                    params as string,
                    formattedTimeoffData,
                  )
                : await MyRequestAPI.editTeachingModeRequest(
                    params as string,
                    formattedTimeoffData,
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
                'request_busy_schedule.0.repeat',
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
                'request_busy_schedule.0.repeat',
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
                lesson: { value: item.schedule.id, label: item.schedule.name },
                reason: item.request_reason,
              })),
            )
          }
          setValue(
            'request_creator',
            data.staff_request.detail.full_name ??
              data.user_request.detail.full_name,
          )

          setValue(
            'request_approver',
            data.staff_assignee.detail.full_name ?? '',
          )
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
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const handleCancel = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: handleClose }),
    )
  }

  return (
    <ConfigProvider theme={ANT_THEME_CONFIG}>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={'960px'}
        footer={true}
        closeIcon={false}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between border-b border-b-gray-5 px-8 py-5">
            <span className="font-sans text-lg font-semibold">
              {router.query.id ? 'Edit' : 'Add More'} Request
            </span>
            <span className="cursor-pointer" onClick={handleCancel}>
              <SappIcon icon="closeicon" />
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-6">
              <SAPPInput
                label={'Request Name'}
                required
                control={control}
                name="request_name"
                placeholder={'Request name'}
                labelClass="text-sm font-medium"
                className="h-11.25"
                disabled={
                  isEdit &&
                  requestStatus?.toLowerCase() !==
                    REQUEST_STATUS.PENDING.value.toLowerCase()
                }
              ></SAPPInput>
            </div>
            <div className="mb-6">
              <SAPPSelect
                control={control}
                label="Request Type"
                name="request_type"
                placeholder="Type"
                required
                onChange={(e) => setValue('request_type_value', e)}
                className="h-11.25 text-base "
                options={[
                  REQUEST_TYPE.BUSY_SCHEDULE,
                  REQUEST_TYPE.WEEKLY_NORM,
                  REQUEST_TYPE.TIMEOFF,
                  REQUEST_TYPE.TEACHING_MODE,
                ]}
                disabled={isEdit}
                labelClass="text-sm font-medium"
              />
            </div>
            {isEdit ? (
              <>
                <div className="mb-6">
                  <SAPPSelect
                    control={control}
                    label="Status"
                    name="request_status"
                    options={selectStatusOption(initialStatus)}
                    disabled={
                      isEdit &&
                      requestStatus?.toLowerCase() !==
                        REQUEST_STATUS.APPROVED.value.toLowerCase()
                    }
                    className="h-11.25"
                    labelClass="text-sm font-medium"
                  />
                </div>
                <div className="mb-6">
                  <SAPPInput
                    label={'Creator'}
                    control={control}
                    name="request_creator"
                    placeholder={'Creator name'}
                    disabled={isEdit}
                    className="h-11.25"
                    labelClass="text-sm font-medium"
                  ></SAPPInput>
                </div>
                <div className="mb-6">
                  <SAPPInput
                    control={control}
                    label="Create Date"
                    name={`request_create_date`}
                    placeholder="Create date"
                    disabled={isEdit}
                    className="h-11.25"
                    labelClass="text-sm font-medium"
                  />
                </div>
                <div className="mb-6">
                  <SAPPInput
                    label={'Approver'}
                    control={control}
                    name="request_approver"
                    placeholder={'Approver'}
                    disabled={isEdit}
                    labelClass="text-sm font-medium"
                    className="h-11.25"
                  ></SAPPInput>
                </div>
              </>
            ) : null}
            <div className="mb-6">
              {requestType == REQUEST_TYPE.WEEKLY_NORM.value ? (
                <SAPPInput
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
                  className="h-11.25"
                ></SAPPInput>
              ) : [
                  REQUEST_TYPE.TEACHING_MODE.value,
                  REQUEST_TYPE.TIMEOFF.value,
                ].includes(requestType) ? (
                <SAPPSelect
                  control={control}
                  label="Class Code"
                  required
                  labelClass="text-sm font-medium"
                  name="class"
                  isSearchable
                  onSearch={() => refetchClasses()}
                  isLoading={isLoadingClasses}
                  onMenuScrollToBottom={() =>
                    hasNextPageClasses && fetchNextPageClasses()
                  }
                  onDropdownVisibleChange={(open) => {
                    open && refetchClasses()
                  }}
                  onChange={(e) => setValue('class_code', e)}
                  placeholder="Class Code"
                  options={classes.map((item) => ({
                    value: item?.id,
                    label: item?.code,
                  }))}
                  className="h-11.25"
                />
              ) : null}
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
                    format="YYYY-MM-DD | HH:mm:ss"
                    showTime={true}
                    // disabledDate={disabledDate}
                    inputClassName="h-11.25 w-full rounded-md"
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
                  <SAPPInput
                    label={'Description'}
                    required
                    control={control}
                    name={`request_busy_schedule.0.description`}
                    placeholder={'Description'}
                    labelClass="text-sm font-medium"
                    disabled={
                      isEdit &&
                      requestStatus?.toLowerCase() !==
                        REQUEST_STATUS.PENDING.value.toLowerCase()
                    }
                    className="h-11.25"
                  ></SAPPInput>
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
                            format="YYYY-MM-DD"
                            showTime={false}
                            inputClassName="h-11.25 w-full rounded-md"
                            disabledDate={disabledDate}
                            labelClass="text-sm font-medium"
                            disabled={
                              isEdit &&
                              requestStatus?.toLowerCase() !==
                                REQUEST_STATUS.PENDING.value.toLowerCase()
                            }
                            className="h-11.25"
                          />
                        </div>
                        <div>
                          <SAPPInput
                            label={'Quantity'}
                            required
                            control={control}
                            name={`request_weekly_norm.${index}.quantity`}
                            placeholder={'Quantity'}
                            labelClass="text-sm font-medium"
                            disabled={
                              isEdit &&
                              requestStatus?.toLowerCase() !==
                                REQUEST_STATUS.PENDING.value.toLowerCase()
                            }
                            onChange={(e) =>
                              setValue(
                                `request_weekly_norm.${index}.quantity`,
                                Number(e.target.value),
                              )
                            }
                            className="h-11.25"
                            // type='number'
                          ></SAPPInput>
                        </div>
                      </div>
                    </div>
                    {requestNorm && requestNorm.length > 1 && (
                      <div
                        className="mb-6 flex cursor-pointer items-center gap-x-3"
                        onClick={() => removeNorm(index)}
                      >
                        <IconMinusSquared />
                        <span className="text-sm font-medium">
                          Delete Weekly Norm
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            {[
              REQUEST_TYPE.TIMEOFF.value,
              REQUEST_TYPE.TEACHING_MODE.value,
            ].includes(requestType) &&
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
                    {requestTimeoff && requestTimeoff?.length > 1 && (
                      <div
                        className="mb-6 flex cursor-pointer items-center gap-x-3"
                        onClick={() => removeTimeoff(index)}
                      >
                        <IconMinusSquared />

                        <span className="text-sm font-medium">
                          Delete Timeoff
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}

            {!isEdit &&
              (requestType == REQUEST_TYPE.WEEKLY_NORM.value &&
              requestNorm &&
              requestNorm?.length <= 7 ? (
                <div
                  className="mb-12 flex cursor-pointer items-center gap-x-3"
                  onClick={() => appendNorm({ date_range: [], quantity: 0 })}
                >
                  <IconPlusSquared />

                  <span className="fs-6 fw-medium text-primary">
                    {capitalizeFirstLetter(
                      Object.values(REQUEST_TYPE)
                        .find(
                          (item) =>
                            item.value.toLowerCase() ==
                            requestType?.toLowerCase(),
                        )
                        ?.label?.replace('_', ' '),
                    )}
                  </span>
                </div>
              ) : null)}
            {!isEdit &&
              ([
                REQUEST_TYPE.TIMEOFF.value,
                REQUEST_TYPE.TEACHING_MODE.value,
              ].includes(requestType) &&
              requestTimeoff &&
              requestTimeoff?.length <= 2 ? (
                <div
                  className="mb-12 flex cursor-pointer items-center gap-x-3"
                  onClick={() =>
                    appendTimeoff({
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
                            item.value.toLowerCase() ==
                            requestType?.toLowerCase(),
                        )
                        ?.label?.replace('_', ' '),
                    )}
                  </span>
                </div>
              ) : null)}
          </div>
          <div className="flex justify-end border-t border-t-gray-5 px-8 py-5">
            <SAPPButtonV2
              title={'Cancel'}
              onClick={handleCancel}
              className="mr-4"
              color="secondary"
            />
            <SAPPButtonV2 title={'Save'} onClick={handleSubmit(onSubmit)} />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  )
}

export default FormRequest
