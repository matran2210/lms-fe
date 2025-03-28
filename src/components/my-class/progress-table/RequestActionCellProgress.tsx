import SAPPDropdown from '@components/base/Dropdown/SAPPDropdown'
import { useRequestContext } from '@contexts/RequestContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface Iprops {
  id: string
}

const RequestActionCellProgress = ({ id }: Iprops) => {
  const router = useRouter()
  const { setIsOpenViewModal, setOpenAddModal, isOpenAddModal } =
    useRequestContext()
  return (
    <SAPPDropdown>
      <Link href={`${router.pathname}?id=${id}`}>
        <div onClick={() => setIsOpenViewModal(true)}>View</div>
      </Link>
      <Link
        href={`${router.pathname}?id=${id}`}
        onClick={() => setOpenAddModal(true)}
      >
        <div onClick={() => setOpenAddModal(true)}>Edit</div>
      </Link>
    </SAPPDropdown>
  )
}

export default RequestActionCellProgress
