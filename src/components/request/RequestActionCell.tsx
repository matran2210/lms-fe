import SAPPDropdown from '@components/base/Dropdown/SAPPDropdown'
import { useRequestContext } from '@contexts/RequestContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'

interface Iprops {
  id: string
}

const RequestActionCell = ({ id }: Iprops) => {
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
      <div>Delete</div>
    </SAPPDropdown>
  )
}

export default RequestActionCell
