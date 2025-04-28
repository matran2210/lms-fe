import { useLayoutEffect, useMemo, useState } from 'react'
import SappDrawer from '../../base/SappDrawer'

import CollapseBox from '@components/layout/CollapseBox'
import CollapseItem from '@components/layout/CollapseBox/CollapseItem'
import { MyRequestAPI } from '@pages/api/my-request'
import { capitalizeFirstLetter } from '@utils/index'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import {
  EVENT_REPEAT_TYPES,
  REQUEST_STATUS,
  requestStatusToBadge,
  requestStatusToTitle,
} from 'src/constants'
import { REQUEST_TYPE } from 'src/constants/my-request'
import { IBusyRequestDetailResponse, IWeeklyNorms } from 'src/type/my-request'
import { RequestStatus } from 'src/type/my-request/enum'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { useAppDispatch } from 'src/redux/hook'
import SAPPBadge from '@components/base/Badge/SAPPBadge'

export interface IProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  reloadPage: () => void
}

function RequestDetail({ open, setOpen, reloadPage, setOpenEdit }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [requestDetail, setRequestDetail] =
    useState<IBusyRequestDetailResponse>()
  const displayStatus = (status: REQUEST_STATUS) => {
    return (
      <SAPPBadge
        label={requestStatusToBadge[status]?.label}
        type={requestStatusToBadge[status]?.type}
      />
    )
  }
  const handleChangeRequestStatus = async (status: string) => {
    const schedule = requestDetail?.teacher_schedules?.[0]?.schedule
    const formattedBusyScheduleData = {
      event_name: requestDetail?.name ?? '',
      status: status,
      range: {
        start_time: dayjs
          .utc(`${schedule?.start_date}${schedule?.start_time}`)
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        end_time: dayjs
          .utc(`${schedule?.end_date}${schedule?.end_time}`)
          .format('YYYY-MM-DDTHH:mm:ssZ'),
      },
      repeat:
        schedule?.recurring_pattern_schedule?.type !==
        EVENT_REPEAT_TYPES.NO_REPEAT,
      recurring_schedule: schedule?.recurring_pattern_schedule && {
        ...schedule?.recurring_pattern_schedule,
        recurrence_end_date: schedule?.recurring_pattern_schedule.end_date,
      },
      description: schedule?.description ?? '',
    }

    const formattedWeeklyNormData = {
      request_name: requestDetail?.name ?? '',
      request_type: requestDetail?.type ?? '',
      status: status,
      time: requestDetail?.teacher_weekly_norms?.map((item: IWeeklyNorms) => {
        return {
          start_date: dayjs(`${item.start_date}`).format(
            'YYYY-MM-DDT16:59:59Z',
          ),
          end_date: dayjs(`${item.end_date}`).format('YYYY-MM-DDT16:59:59Z'),
          quantity: item.max_shift,
        }
      }),
      note: requestDetail?.description || null,
    }

    const formattedTimeoffData = {
      request_name: requestDetail?.name ?? '',
      scheduleAdjustments: requestDetail?.teacher_schedules.map(
        (item: { id: string; request_reason: string }) => {
          return { id: item.id, reason: item.request_reason }
        },
      ),
      status: status,
    }

    try {
      setLoading(true)
      const editRequestMap = {
        [REQUEST_TYPE.BUSY_SCHEDULE.value]: () =>
          MyRequestAPI.editBusySchedule(
            params as string,
            formattedBusyScheduleData,
          ),
        [REQUEST_TYPE.WEEKLY_NORM.value]: () =>
          MyRequestAPI.editWeeklyNorm(
            params as string,
            formattedWeeklyNormData,
          ),
        [REQUEST_TYPE.TIMEOFF.value]: () =>
          MyRequestAPI.editTimeoffRequest(
            params as string,
            formattedTimeoffData,
          ),
        [REQUEST_TYPE.TEACHING_MODE.value]: () =>
          MyRequestAPI.editTeachingModeRequest(
            params as string,
            formattedTimeoffData,
          ),
      }

      const editFn =
        editRequestMap[requestDetail?.type ?? ''] ??
        (() =>
          MyRequestAPI.editTeachingModeRequest(
            params as string,
            formattedTimeoffData,
          ))

      const res = await editFn()
      if (res.success) {
        toast.success(`${capitalizeFirstLetter(status)} request success!`)
        setLoading(false)
        setOpen(false)
        reloadPage()
        router.replace(router.pathname, undefined, { shallow: true })
      }
    } catch (error: any) {
      // Handled by axios interceptor
      if (error.response.data.error.code == '400|50001') {
        toast.error('All class schedules have already assigned!')
      }
    } finally {
    }
  }

  const loadData = async () => {
    if (params) {
      try {
        setLoading(true)
        const { data } = await MyRequestAPI.getRequestDetail(params as string)
        if (data) {
          setRequestDetail(data)
        }
      } catch (error: any) {
        // Handled by axios interceptor
      } finally {
        setLoading(false)
      }
    }
  }
  useLayoutEffect(() => {
    loadData()
  }, [params])

  const hasActionButton = useMemo(
    () =>
      [
        requestStatusToTitle[REQUEST_STATUS.APPROVED].toLowerCase(),
        requestStatusToTitle[REQUEST_STATUS.PENDING].toLowerCase(),
      ].includes(requestDetail?.status.toLowerCase() ?? ''),
    [requestDetail?.status],
  )
  const handleEdit = () => {
    setOpenEdit(true)
    setOpen(false)
  }
  const handleCancel = () => {
    dispatch(
      confirmDialog.open({
        message: 'Do you want to cancel this request?',
        onConfirm: () => handleChangeRequestStatus(RequestStatus.CANCEL),
      }),
    )
  }
  const handleSubmit = () => {
    if (
      requestDetail?.status.toLowerCase() == RequestStatus.PENDING.toLowerCase()
    ) {
      handleEdit()
    } else if (
      requestDetail?.status.toLowerCase() ==
      RequestStatus.APPROVED.toLowerCase()
    ) {
      handleCancel()
    } else {
      handleChangeRequestStatus(RequestStatus.APPROVED)
    }
  }

  const requestType = Object.values(REQUEST_TYPE).find(
    (item) => item.value === requestDetail?.type,
  )
  return (
    <div>
      <div className="card h-xl-100"></div>
      <div>
        <SappDrawer
          isOpen={open}
          title={`View Request`}
          onClose={() => {
            setOpen(false)
          }}
          message="Bạn có chắc chắn muốn hủy không"
          btnSubmitTile={
            requestDetail?.status.toLowerCase() ==
            RequestStatus.PENDING.toLowerCase()
              ? 'Edit'
              : 'Cancel Request'
          }
          btnCancelTitle={'Cancel'}
          showSubmitButton={
            requestDetail?.status.toLowerCase() ==
              RequestStatus.PENDING.toLowerCase() ||
            requestDetail?.status.toLowerCase() ==
              RequestStatus.APPROVED.toLowerCase()
          }
          showCancelButton={
            ![
              RequestStatus.PENDING.toLowerCase(),
              RequestStatus.APPROVED.toLowerCase(),
            ].includes(requestDetail?.status?.toLowerCase() ?? '')
          }
          confirmOnClose
          footer={hasActionButton}
          handleSubmit={() => handleSubmit()}
        >
          <div className="mb-7">
            <div className="mb-4 text-xl font-medium text-gray-800">
              {requestDetail?.name}
            </div>
            <div className="mb-4 flex gap-x-3 text-sm">
              <span className="font-medium text-bw-9 ">
                Approval Deadline:{' '}
              </span>
              <span className="">
                {requestDetail?.due_date} |{' '}
                {dayjs(requestDetail?.created_at).format('HH:mm')}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-x-3 text-sm">
              <span className="font-medium text-bw-9">Status:</span>

              {displayStatus(
                REQUEST_STATUS[`${requestDetail?.status as REQUEST_STATUS}`],
              )}
            </div>
          </div>
          <div className="mb-4">
            <CollapseBox title=" Primary Information">
              <div className="grid gap-y-4">
                <CollapseItem
                  title={'Request Name'}
                  body={requestDetail?.name}
                />

                <CollapseItem
                  title="Request Type"
                  body={
                    <span className={`${requestType?.colorClass}`}>
                      {requestType?.label}
                    </span>
                  }
                />

                <CollapseItem
                  title="Creator"
                  body={requestDetail?.user_request.detail.full_name}
                />

                <CollapseItem
                  title="Approver"
                  body={requestDetail?.staff_assignee?.detail?.full_name}
                />

                <CollapseItem
                  title="Create Date"
                  body={dayjs(requestDetail?.created_at).format(
                    'DD/MM/YYYY | hh:mm',
                  )}
                />
                {requestDetail?.type !== REQUEST_TYPE.TIMEOFF.value ? (
                  <CollapseItem
                    title="Note"
                    body={requestDetail?.description}
                  />
                ) : (
                  <CollapseItem
                    title="Updated Date"
                    body={dayjs(requestDetail?.updated_at).format(
                      'DD/MM/YYYY | hh:mm',
                    )}
                  />
                )}
              </div>
            </CollapseBox>
          </div>

          <div className="">
            <CollapseBox
              title={
                requestDetail?.type === REQUEST_TYPE.BUSY_SCHEDULE.value
                  ? 'Proposal Date & Reason'
                  : requestDetail?.type === REQUEST_TYPE.WEEKLY_NORM.value
                    ? 'Proposal Date & Quantity'
                    : 'Proposal Timeoff Date'
              }
            >
              {requestDetail?.type == REQUEST_TYPE.BUSY_SCHEDULE.value &&
                requestDetail?.teacher_schedules.map((item, index) => {
                  const startTime = dayjs(
                    `${item.schedule.start_date} ${item.schedule.start_time}`,
                  ).format('DD/MM/YYYY | HH:mm')
                  const endTime = dayjs(
                    `${item.schedule.end_date} ${item.schedule.end_time}`,
                  ).format('DD/MM/YYYY | HH:mm')

                  return (
                    <div
                      key={index}
                      className={`grid gap-y-4 pb-5 ${index > 0 && index < requestDetail?.teacher_schedules.length - 1 && 'border-b-dashed border-b border-b-gray-5'}`}
                    >
                      <CollapseItem
                        title={`Start Date - End Date`}
                        body={`${startTime} - ${endTime}`}
                      />
                      <CollapseItem
                        title={`Repeat`}
                        body={`${item.schedule.recurring_pattern_schedule ? item.schedule.recurring_pattern_schedule.type : ''}`}
                      />
                      <CollapseItem
                        title={`Description`}
                        body={`${item.schedule.description}`}
                      />
                    </div>
                  )
                })}

              {requestDetail?.type === REQUEST_TYPE.WEEKLY_NORM.value &&
                requestDetail?.teacher_weekly_norms.map((item, index) => {
                  const startTime = dayjs(item.start_date).format('DD/MM/YYYY')
                  const endTime = dayjs(item.end_date).format('DD/MM/YYYY')
                  return (
                    <div
                      key={index}
                      className={`grid gap-y-4 pb-5 ${index > 0 && index < requestDetail?.teacher_schedules.length - 1 && 'border-b-dashed border-b border-b-gray-5'}`}
                    >
                      <CollapseItem
                        title={`Start Date - End Date`}
                        body={`${startTime} - ${endTime}`}
                      />
                      <CollapseItem title={`Quantity`} body={item.max_shift} />
                    </div>
                  )
                })}

              {(requestDetail?.type === REQUEST_TYPE.TIMEOFF.value ||
                requestDetail?.type === REQUEST_TYPE.TEACHING_MODE.value) &&
                requestDetail?.teacher_schedules.map((item, index) => {
                  const startTime = dayjs(
                    `${item.schedule.start_date} ${item.schedule.start_time}`,
                  ).format('DD/MM/YYYY | HH:mm')
                  const endTime = dayjs(
                    `${item.schedule.end_date} ${item.schedule.end_time}`,
                  ).format('DD/MM/YYYY | HH:mm')

                  return (
                    <div
                      key={index}
                      className={`grid gap-y-4 pb-5 ${index > 0 && index < requestDetail?.teacher_schedules.length - 1 && 'border-b-dashed border-b border-b-gray-5'}`}
                    >
                      <CollapseItem
                        title={`Start Date - End Date`}
                        body={`${startTime} - ${endTime}`}
                      />
                      <CollapseItem
                        title={`Reason`}
                        body={item.request_reason}
                      />
                    </div>
                  )
                })}
            </CollapseBox>
          </div>
        </SappDrawer>
      </div>
    </div>
  )
}

export default RequestDetail
