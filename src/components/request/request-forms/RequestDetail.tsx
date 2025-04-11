import { useLayoutEffect, useMemo, useState } from 'react'
import SappDrawer from '../../base/SappDrawer'

import CollapseBox from '@components/layout/CollapseBox'
import CollapseItem from '@components/layout/CollapseBox/CollapseItem'
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
  const displayStatus = (status: string) => {
    return `${RequestStatus[status as keyof typeof RequestStatus] || 'Unknown'}`
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
          end_date: dayjs(`${item.start_date}`).format('YYYY-MM-DDT16:59:59Z'),
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
      // Handled by axios interceptor
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
        REQUEST_STATUS.APPROVED.value.toLowerCase(),
        REQUEST_STATUS.PENDING.value.toLocaleLowerCase(),
      ].includes(requestDetail?.status.toLocaleLowerCase() ?? ''),
    [requestDetail?.status],
  )
  const handleEdit = () => {
    setOpenEdit(true)
    setOpen(false)
  }

  return (
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
          : ''
      }
      showSubmitButton={
        requestDetail?.status.toLowerCase() ==
        RequestStatus.PENDING.toLowerCase()
      }
      showCancelButton={
        requestDetail?.status.toLowerCase() !==
        RequestStatus.PENDING.toLowerCase()
      }
      confirmOnClose
      footer={hasActionButton}
      handleSubmit={() => {
        handleChangeRequestStatus(RequestStatus.APPROVED)
      }}
      handleCancel={() => {
        handleChangeRequestStatus(RequestStatus.CANCEL)
      }}
      onClickOutside={() => {
        setOpen(false)
      }}
    >
      <div className="mb-7">
        <div className="mb-4 text-xl font-medium text-gray-800">
          {requestDetail?.name}
        </div>
        <div className="mb-4 flex gap-x-3 text-sm">
          <span className="font-medium text-bw-9 ">Approval Deadline: </span>
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
        <CollapseBox title=" Primary Information">
          <div className="grid gap-y-4">
            <CollapseItem title={'Request Name'} body={requestDetail?.name} />

            <CollapseItem
              title="Request Type"
              body={
                <span className="text-danger">
                  {capitalizeFirstLetter(
                    Object.values(REQUEST_TYPE).find(
                      (item) => item.value == requestDetail?.type,
                    )?.label,
                  )}
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
              <CollapseItem title="Note" body={requestDetail?.description} />
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
          {requestDetail?.type === REQUEST_TYPE.BUSY_SCHEDULE.value &&
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
                    body={`${item.description}`}
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
                  <CollapseItem title={`Reason`} body={item.request_reason} />
                </div>
              )
            })}
        </CollapseBox>
      </div>
    </SappDrawer>
  )
}

export default RequestDetail
