import SAPPDropdown from '@components/base/Dropdown/SAPPDropdown'
import { useRequestContext } from '@contexts/RequestContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { REQUEST_STATUS } from 'src/constants'
import { RequestStatus } from 'src/type'

interface Iprops {
  id: string
  status: RequestStatus
}

const RequestActionCell = ({ id, status }: Iprops) => {
  const router = useRouter()
  const { setIsOpenViewModal, setOpenAddModal, isOpenAddModal } =
    useRequestContext()
  return (
    <SAPPDropdown>
      <Link href={`${router.pathname}?id=${id}`}>
        <div onClick={() => setIsOpenViewModal(true)}>View</div>
      </Link>
      {status === REQUEST_STATUS.PENDING && (
        <Link
          href={`${router.pathname}?id=${id}`}
          onClick={() => setOpenAddModal(true)}
        >
          <div onClick={() => setOpenAddModal(true)}>Edit</div>
        </Link>
      )}
      {status === REQUEST_STATUS.PENDING && <div>Delete</div>}
    </SAPPDropdown>
  )
}

export default RequestActionCell
