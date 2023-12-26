// ConfirmDialog.tsx
import SappTable from '@components/base/SappTable'
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Icon from '@components/icons'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({ open, setOpen }) => {
  // Config ListResults
  const entrancePopupContent = {
    name: 'ACCA F1 Entrance Test',
    score: 0,
    timeAllow: 10800,
    attemps: 'Unlimited',
    status: 'Unfinish',
  }
  const { user } = useAppSelector(userReducer)

  const handleOnClick = () => {
    setOpen && setOpen(false)
    // setOpenFillForm(true)
  }
  const [openFillForn, setOpenFillForm] = useState(false)
  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        cancelButtonCaption="Cancel"
        okButtonCaption="Start"
        handleCancel={handleOnClick}
        handleSubmit={() => setOpenFillForm(true)}
        showHeader={false}
        // size="max-w-1/2"
        footerButtonClassName="justify-between flex"
        childClass=""
        parentChildClass=""
        position="center"
        closeAfterSubmit={false}
      >
        <h2 className="text-xl font-bold text-bw-1 mb-4">Entrance Test</h2>
        <div
          className="cursor-pointer"
          // onClick={() => {
          //   handleOnClick()
          // }}
        >
          <EntrancePopupContent
            name={entrancePopupContent.name}
            score={entrancePopupContent.score}
            timeAllow={entrancePopupContent.timeAllow}
            attemps={entrancePopupContent.attemps}
            status={entrancePopupContent.status}
          />
        </div>
      </SappModal>
      <EntranceTestFillForm open={openFillForn} setOpen={setOpenFillForm} />
    </>
  )
}

export default EntrancePopup
