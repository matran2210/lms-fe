import { useLayoutEffect, useMemo, useState } from 'react'
import SappDrawer from '../../base/SappDrawer'

import { MyRequestAPI } from '@pages/api/my-request'
import { capitalizeFirstLetter } from '@utils/index'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { EVENT_REPEAT_TYPES } from 'src/constants'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants/my-request'
import { IBusyRequestDetailResponse, IWeeklyNorms } from 'src/type/my-request'
import { RequestStatus } from 'src/type/my-request/enum'

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
  const [requestDetail, setRequestDetail] =
    useState<IBusyRequestDetailResponse>()
  const [showPrimaryInfo, setShowPrimaryInfo] = useState(true)
  const [showOtherInfo, setShowOtherInfo] = useState(true)
  const displayStatus = (status: string) => {
    return `${RequestStatus[status as keyof typeof RequestStatus] || 'Unknown'}`
  }
  const handleChangeRequestStatus = async (status: string) => {
    const schedule = requestDetail?.teacher_schedules?.[0]?.schedule
    const formattedBusyScheduleData = {
      event_name: requestDetail?.name ?? '',
      status: status,
      range: {
        start_time: dayjs(
          `${schedule?.start_date}${schedule?.start_time}`,
        ).format('YYYY-MM-DDTHH:mm:ss'),
        end_time: dayjs(`${schedule?.end_date}${schedule?.end_time}`).format(
          'YYYY-MM-DDTHH:mm:ss',
        ),
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
          start_date: dayjs(`${item.start_date}`).format('YYYY-MM-DDTHH:mm:ss'),
          end_date: dayjs(`${item.start_date}`).format('YYYY-MM-DDTHH:mm:ss'),
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
      if (requestDetail?.type == REQUEST_TYPE.BUSY_SCHEDULE.value) {
        await MyRequestAPI.editBusySchedule(
          params as string,
          formattedBusyScheduleData,
        )
      } else if (requestDetail?.type == REQUEST_TYPE.WEEKLY_NORM.value) {
        await MyRequestAPI.editWeeklyNorm(
          params as string,
          formattedWeeklyNormData,
        )
      } else if (requestDetail?.type == REQUEST_TYPE.TIMEOFF.value) {
        await MyRequestAPI.editTimeoffRequest(
          params as string,
          formattedTimeoffData,
        )
      } else {
        await MyRequestAPI.editTeachingModeRequest(
          params as string,
          formattedTimeoffData,
        )
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
      setOpen(false)
      reloadPage()
      router.replace(router.pathname, undefined, { shallow: true })
    }
  }

  const loadData = async () => {
    if (params) {
      try {
        setLoading(true)
        const { data } = await MyRequestAPI.getRequestDetail(params as string)
        if (data) {
          setRequestDetail(data)
        } else {
          toast.error('Request not found!')
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

  const requestType = useMemo(
    () =>
      Object?.values(REQUEST_TYPE)?.find(
        (item) => item.value == requestDetail?.type,
      ),
    [requestDetail?.type],
  )
  const hasActionButton = useMemo(
    () =>
      [
        REQUEST_STATUS.APPROVED.value.toLowerCase(),
        REQUEST_STATUS.PENDING.value.toLocaleLowerCase(),
      ].includes(requestDetail?.status.toLocaleLowerCase() ?? ''),
    [requestDetail?.status],
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
            requestDetail?.status.toLowerCase() !==
            RequestStatus.APPROVED.toLowerCase()
              ? 'Approved'
              : 'Edit'
          }
          footer={hasActionButton}
          handleSubmit={() => {
            handleChangeRequestStatus(RequestStatus.APPROVED)
          }}
          handleCancel={() => {
            handleChangeRequestStatus(RequestStatus.CANCEL)
          }}
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
                {dayjs(requestDetail?.created_at).format('hh:mm')}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-x-3 text-sm">
              <span className="font-medium text-bw-9">Status:</span>
              <div className="rounded bg-[#f897070d] px-[10px] py-1 font-inter text-xsm font-medium text-[#f89707]">
                {displayStatus(requestDetail?.status ?? '')}
                {/* Pending */}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-3 border-b border-gray-200 py-3 text-base font-medium text-gray-800">
              Primary Information
            </div>
            <table className="w-full">
              <tr>
                <td className="text-sm text-bw-9">Request Name</td>
                <td className="text-sm">{requestDetail?.name}</td>
              </tr>

              <tr className="">
                <td className="text-sm text-bw-9">Request Type</td>
                <td className="text-sm text-danger">
                  {capitalizeFirstLetter(
                    Object.values(REQUEST_TYPE).find(
                      (item) => item.value == requestDetail?.type,
                    )?.label,
                  )}
                  {/* Busy Schedule */}
                </td>
              </tr>
              <tr>
                <td className="text-sm  text-bw-9">Creator</td>
                <td className="text-sm">
                  {requestDetail?.user_request.detail.full_name}{' '}
                </td>
              </tr>
              <tr>
                <td className="text-sm  text-bw-9">Approver</td>
                <td className="text-sm">
                  {requestDetail?.staff_request?.detail?.full_name}{' '}
                </td>
              </tr>
              <tr>
                <td className="text-sm  text-bw-9">Create Date</td>
                <td className="text-sm">
                  {' '}
                  {dayjs(requestDetail?.created_at).format('DD/MM/YYYY hh:mm')}
                  {/* 10/02/2025 | 22:00 */}
                </td>
              </tr>
              <tr>
                <td className="text-sm  text-bw-9">Note</td>
                <td className="text-sm"> {requestDetail?.description}</td>
              </tr>
            </table>
          </div>

          <div className="">
            <div className="mb-3 border-b border-gray-200 pb-3 text-base font-medium">
              {requestDetail?.type == REQUEST_TYPE.BUSY_SCHEDULE.value
                ? 'Proposal Date & Reason'
                : requestDetail?.type == REQUEST_TYPE.WEEKLY_NORM.value
                  ? 'Proposal Date & Quantity'
                  : 'Proposal Timeoff Date  '}
            </div>

            {requestDetail?.type == REQUEST_TYPE.BUSY_SCHEDULE.value
              ? requestDetail?.teacher_schedules.map((item, index) => {
                  let startTime = dayjs(
                    `${item.schedule.start_date} ${item.schedule.start_time}`,
                  ).format('DD/MM/YYYY | HH:mm')
                  let endTime = dayjs(
                    `${item.schedule.end_date} ${item.schedule.end_time}`,
                  ).format('DD/MM/YYYY | HH:mm')

                  return (
                    <div
                      className={`mb-4 text-sm  ${'border-b border-dashed border-gray-200 pb-4'}`}
                      key={index}
                    >
                      <div className="py-2 font-medium">
                        {startTime + ' - ' + endTime}
                      </div>
                      <div className="py-2 font-medium">
                        {item.schedule.description}
                      </div>
                    </div>
                  )
                })
              : requestDetail?.type == REQUEST_TYPE.WEEKLY_NORM.value
                ? requestDetail?.teacher_weekly_norms.map((item, index) => {
                    let startTime = dayjs(`${item.start_date}`).format(
                      'DD/MM/YYYY',
                    )
                    let endTime = dayjs(`${item.end_date}`).format('DD/MM/YYYY')

                    return (
                      <div
                        className={`mb-4 text-sm  ${'border-b border-dashed border-gray-200 pb-4'}`}
                        key={index}
                      >
                        <div className="py-2">
                          {startTime + ' - ' + endTime}
                        </div>
                        <div className="py-2">
                          {'Số buổi:' + ' ' + item.max_shift}
                        </div>
                      </div>
                    )
                  })
                : requestDetail?.teacher_schedules.map((item, index) => {
                    let startTime = dayjs(
                      `${item.schedule.start_date} ${item.schedule.start_time}`,
                    ).format('DD/MM/YYYY | HH:mm')
                    let endTime = dayjs(
                      `${item.schedule.end_date} ${item.schedule.end_time}`,
                    ).format('DD/MM/YYYY | HH:mm')
                    return (
                      <div
                        className={`mb-4 text-sm  ${'border-b border-dashed border-gray-200 pb-4'}`}
                        key={index}
                      >
                        <div className="py-2 ">
                          {startTime + ' - ' + endTime}
                          {/* Buổi 09 | 12/12/2024 */}
                        </div>
                        <div className="py-2 font-medium">
                          Reason: {item.request_reason}
                        </div>
                      </div>
                    )
                  })}
          </div>
        </SappDrawer>
      </div>
    </div>
  )
}

export default RequestDetail
