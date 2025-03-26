import HookFormDateRange from '@components/base/datetime/HookFormDateRange'
import HookFormDateTime from '@components/base/datetime/HookFormDateTime'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { MyRequestAPI } from '@pages/api/my-request'
import { capitalizeFirstLetter } from '@utils/index'
import { requestValidationSchema } from '@utils/validation/my-request-validation'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants/my-request'
import { IResponse } from 'src/redux/types'
import { IBusySchedule, IRequest, IWeeklyNorm } from 'src/type/my-request'
import { date } from 'zod'
import {
  getMe,
  getUserInformation,
  userReducer,
} from 'src/redux/slice/User/User'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import useSelectClassCode from 'src/hooks/useSelectClassCode'
import useLesson from 'src/hooks/useSelectLesson'
import { IconMinusSquared, IconPlusSquared } from '@assets/icons'
import { useRequestContext } from '@contexts/RequestContext'

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  reloadPage: () => void
}

function FormRequest({ open, setOpen, reloadPage }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const isEdit = false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [initialStatus, setInitialStatus] = useState<string>()
  const [existedTeacher, setExistedTeacher] = useState<boolean>(false)
  const { user } = useAppSelector(userReducer)

  const useFormProp = useForm<IRequest>({
    resolver: zodResolver(requestValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      request_name: '',
      request_teacher_id: '',
      request_busy_schedule: [{ date_range: [], description: '' }],
      request_weekly_norm: [{ date_range: [], quantity: 0 }],
      request_time_off: [{ lesson: '', reason: '' }],
    },
  })
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useFormProp

  const busy = watch('request_busy_schedule')
  const requestType = watch('request_type_value')
  const classCode = watch('class_code')
  const requestStatus = watch('request_status')
  const {
    fields: busyScheduleFields,
    append: appendRequest,
    remove: removeRequest,
  } = useFieldArray({ control, name: 'request_busy_schedule' })

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

  const onSubmit = async (data: IRequest) => {
    const formattedBusyScheduleData = {
      request_name: data.request_name,
      request_type: data.request_type_value,
      status: data.request_status,
      time: data.request_busy_schedule?.map((item: IBusySchedule) => ({
        start_date: item.start_time,
        end_date: item.end_time,
        description: item.description,
      })),
      note: data.note?.length ? data.note : null,
    }
    const formattedWeeklyNormData = {
      request_name: data.request_name,
      request_type: data.request_type_value,
      status: data.request_status,
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
      teacher_id: data.request_teacher_id,
      scheduleAdjusment: data.request_time_off,
      status: data.request_status,
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
            'request_status',
            capitalizeFirstLetter(
              data.status.toLowerCase() == 'cancel'
                ? 'Cancelled'
                : data.status.toLowerCase() == 'reject'
                  ? 'Rejected'
                  : data.status,
            ),
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
              (item) => item.value == data.type,
            ) ?? { value: '', label: 'Select an option' },
          )
          setValue('request_teacher_id', data.user_request.id)
          if (data.user_request.id) {
            setExistedTeacher(true)
          }
          setValue('note', data.description ?? '')
          if (data.type == REQUEST_TYPE.BUSY_SCHEDULE.value) {
            setValue(
              'request_busy_schedule',
              data.teacher_schedules.map((item) => {
                let startTime = new Date(
                  `${item.schedule.start_date}T${item.schedule.start_time}`,
                ).toISOString()
                let endTime = new Date(
                  `${item.schedule.end_date}T${item.schedule.end_time}`,
                ).toISOString()
                return {
                  date_range: [startTime, endTime],
                  description: item.schedule.description,
                }
              }),
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
          }
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
          className="sapp-h-45px fs-6"
          control={control}
          name="request_name"
          placeholder={'Request name'}
          inputClassName="font-medium text-base"
          disabled={isEdit && requestStatus !== REQUEST_STATUS.PENDING.value}
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
          ]}
          isDisabled={isEdit}
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
                REQUEST_STATUS.APPROVED,
                REQUEST_STATUS.CANCELLED,
                REQUEST_STATUS.PENDING,
                REQUEST_STATUS.REJECTED,
              ]}
              isDisabled={
                isEdit && requestStatus !== REQUEST_STATUS.APPROVED.value
              }
            />
          </div>
          <div className="mb-6">
            <HookFormTextField
              label={'Creator'}
              className="sapp-h-45px fs-6"
              control={control}
              name="request_creator"
              placeholder={'Creator name'}
              disabled={isEdit}
            ></HookFormTextField>
          </div>
          <div className="mb-6">
            <HookFormDateTime
              control={control}
              label="Create Date"
              name={`request_create_date`}
              placeholder="To date"
              format="YYYY-MM-DD | HH:mm:ss"
              showTime
              picker="date"
              disabled={isEdit}
            />
          </div>
          <div className="mb-6">
            <HookFormTextField
              label={'Approver'}
              className="sapp-h-45px fs-6"
              control={control}
              name="request_approver"
              placeholder={'Approver'}
              disabled={isEdit}
            ></HookFormTextField>
          </div>
        </>
      ) : null}
      <div className="mb-6">
        {requestType !== REQUEST_TYPE.TIMEOFF.value ? (
          <HookFormTextField
            label={'Note'}
            className="sapp-h-45px fs-6"
            control={control}
            name="note"
            placeholder={'Note'}
            disabled={isEdit && requestStatus !== REQUEST_STATUS.PENDING.value}
          ></HookFormTextField>
        ) : (
          <SappHookFormSelect
            control={control}
            label="Class Code"
            required
            className="sapp-h-45px fs-6"
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
              label: item?.name,
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

      {requestType == REQUEST_TYPE.BUSY_SCHEDULE.value &&
        busyScheduleFields.map((item, index) => {
          return (
            <div key={item.id}>
              <div className="mb-6">
                <div className="grid w-full grid-cols-2 gap-x-6">
                  <div>
                    <HookFormDateRange
                      control={control}
                      required
                      label="Start Date - End Date"
                      name={`request_busy_schedule.${index}.date_range`}
                      placeholder
                      format="YYYY-MM-DD | HH:mm:ss"
                      showTime
                      className="text-sm"
                      disabled={
                        isEdit && requestStatus !== REQUEST_STATUS.PENDING.value
                      }
                    />
                  </div>
                  <div>
                    <HookFormTextField
                      label={'Description'}
                      required
                      control={control}
                      name={`request_busy_schedule.${index}.description`}
                      placeholder={'Description'}
                      disabled={
                        isEdit && requestStatus !== REQUEST_STATUS.PENDING.value
                      }
                    ></HookFormTextField>
                  </div>
                </div>
              </div>
              <div
                className="mb-6 flex cursor-pointer items-center gap-x-3"
                onClick={() => removeRequest(index)}
              >
                <IconMinusSquared />
                <span className="text-sm font-medium">
                  Delete Busy Schedule
                </span>
              </div>
            </div>
          )
        })}
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
                      disabled={
                        isEdit && requestStatus !== REQUEST_STATUS.PENDING.value
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
                      onChange={(e) =>
                        setValue(
                          `request_weekly_norm.${index}.quantity`,
                          Number(e.target.value),
                        )
                      }
                      disabled={
                        isEdit && requestStatus !== REQUEST_STATUS.PENDING.value
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
            <div key={item.id}>
              <div className="mb-6">
                <div className="grid w-full grid-cols-2 gap-x-6">
                  <div>
                    <div className="mb-6">
                      <SappHookFormSelect
                        control={control}
                        label="Lesson"
                        required
                        className="sapp-h-45px fs-6"
                        name={`request_time_off.${index}.lesson`}
                        isSearchable
                        onSearch={() => refetchLessons()}
                        isLoading={isLoadingLessons}
                        onMenuScrollToBottom={() =>
                          hasNextPageLessons && fetchNextPageLessons()
                        }
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
      {requestType ? (
        <div
          className="mb-12 flex cursor-pointer items-center gap-x-3"
          onClick={() =>
            requestType == REQUEST_TYPE.BUSY_SCHEDULE.value
              ? appendRequest({ date_range: [], description: '' })
              : requestType == REQUEST_TYPE.WEEKLY_NORM.value
                ? appendNorm({ date_range: [], quantity: 0 })
                : appendTimeoff({ lesson: '', reason: '' })
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
