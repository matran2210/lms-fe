import { useLayoutEffect, useState } from 'react'
import SappDrawer from '../base/SappDrawer'

import { MyRequestAPI } from '@pages/api/my-request'
import { useRouter } from 'next/router'
import { REQUEST_TYPE } from 'src/constants/my-request'
import { IBusyRequestDetailResponse } from 'src/type/my-request'
import { RequestStatus } from 'src/type/my-request/enum'
import { capitalizeFirstLetter } from '@utils/index'
import moment from 'moment'
import toast from 'react-hot-toast'

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

  // const handleChangeRequestStatus = async (id: string, status: string) => {
  //   try {
  //     setLoading(true)
  //     await MyRequestAPI.changeRequestStatus({ id: id, status: status })
  //   } catch (error) {
  //     console.error('Error while change request&:', error)
  //     toast.error('An error occurred. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
          handleSubmit={() => {}}
          //   handleCancel={() => handleChangeRequestStatus(params?.id ?? '', RequestStatus.REJECT)}
        >
          <div className="mb-7">
            <div className="mb-4 text-xl font-medium text-gray-800">
              {requestDetail?.name}
            </div>
            <div className="mb-4 flex gap-x-3 text-sm">
              <span className="font-medium text-bw-9 ">
                Approval Deadline:{' '}
              </span>
              <span className="">{requestDetail?.due_date}</span>
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
                  {requestDetail?.staff_request.detail.full_name}{' '}
                </td>
              </tr>
              <tr>
                <td className="text-sm  text-bw-9">Create Date</td>
                <td className="text-sm">
                  {' '}
                  {moment(requestDetail?.created_at).format('DD/MM/YYYY hh:mm')}
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

            {
              requestDetail?.type == REQUEST_TYPE.BUSY_SCHEDULE.value ? (
                requestDetail?.teacher_schedules.map((item, index) => {
                  let startTime = moment(
                    `${item.schedule.start_date} ${item.schedule.start_time}`,
                  ).format('DD/MM/YYYY | HH:mm')
                  let endTime = moment(
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
              ) : requestDetail?.type == REQUEST_TYPE.WEEKLY_NORM.value ? (
                //   )
                // })
                requestDetail?.teacher_weekly_norms.map((item, index) => {
                  let startTime = moment(`${item.start_date}`).format(
                    'DD/MM/YYYY',
                  )
                  let endTime = moment(`${item.end_date}`).format('DD/MM/YYYY')

                  return (
                    <div
                      className={`mb-4 text-sm  ${'border-b border-dashed border-gray-200 pb-4'}`}
                      key={index}
                    >
                      <div className="py-2">{startTime + ' - ' + endTime}</div>
                      <div className="py-2">
                        {'Số buổi:' + ' ' + item.max_shift}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div
                  className={`mb-4 text-sm  ${'border-b border-dashed border-gray-200 pb-4'}`}
                  //   key={index}
                >
                  <div className="py-2 ">
                    {/* {startTime + ' - ' + endTime} */}
                    Buổi 09 | 12/12/2024
                  </div>
                  <div className="py-2 font-medium">
                    {/* {'Số buổi:' + ' ' + item.max_shift} */}
                    Reason: Đi công tác
                  </div>
                </div>
              )
              //   )
              // })
            }
          </div>
        </SappDrawer>
      </div>
    </div>
  )
}

export default RequestDetail
