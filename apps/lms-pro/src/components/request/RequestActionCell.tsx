import { SAPPDropdown } from '@lms/ui'
import { useRequestContext } from '@contexts/RequestContext'
import { MyRequestAPI } from '@pages/api/my-request'
import { RequestAPI } from '@pages/api/request'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import {
  CONFIRM_CANCEL,
  CONFIRM_DELETE,
  E_REQUEST_STATUS,
  E_REQUEST_TYPE,
} from '@lms/core'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { IRequest } from '@lms/core'

interface Iprops {
  item: IRequest
  reloadPage: () => void
}

const RequestActionCell = ({ item, reloadPage }: Iprops) => {
  const router = useRouter()
  const { setIsOpenViewModal, setOpenAddModal, setIsReFetch } =
    useRequestContext()
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_DELETE, onConfirm: onDelete }),
    )
  }

  const onDelete = async () => {
    try {
      const res = await RequestAPI.deleteRequest(item.id)
      if (res.success) {
        reloadPage()
        toast.success('Delete request successfully')
        setIsReFetch(true)
      }
    } catch (error) {
      // Handled by axios interceptor
    }
  }

  const handleCancel = () => {
    dispatch(
      confirmDialog.open({ message: CONFIRM_CANCEL, onConfirm: onCancel }),
    )
  }

  const onCancel = async () => {
    try {
      let res
      switch (item.type) {
        case E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY:
          res = await MyRequestAPI.editBusySchedule(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
          })

          break
        case E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS:
          res = await MyRequestAPI.editWeeklyNorm(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
          })
          break
        case E_REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF:
          res = await MyRequestAPI.editTimeoffRequest(item.id, {
            status: E_REQUEST_STATUS.CANCEL,
            scheduleAdjustments: item.teacher_schedules.map((item) => ({
              id: item.id,
              reason: item.request_reason || '',
            })),
          })
          break
        default:
          return
      }
      if (res.success) {
        toast.success('Cancel request successfully')
        setIsReFetch(true)
      }
    } catch (error: any) {
      if (error.response.data.error.code == '400|50001') {
        toast.error('All class schedules have already assigned!')
      }
    }
  }

  return (
    <SAPPDropdown>
      <Link href={`${router.pathname}?id=${item.id}`}>
        <div onClick={() => setIsOpenViewModal(true)}>View</div>
      </Link>
      {item.status === E_REQUEST_STATUS.PENDING && (
        <Link href={`${router.pathname}?id=${item.id}`}>
          <div onClick={() => setOpenAddModal(true)}>Edit</div>
        </Link>
      )}
      {item.status === E_REQUEST_STATUS.APPROVED && (
        <div onClick={handleCancel}>Cancel</div>
      )}
      {item.status === E_REQUEST_STATUS.PENDING && (
        <div onClick={handleDelete}>Delete</div>
      )}
    </SAPPDropdown>
  )
}

export default RequestActionCell
