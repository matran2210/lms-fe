// ConfirmDialog.tsx
import SappTable from '@components/base/SappTable'
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Icon from '@components/icons'
import EntrancePopupContent from './EntrancePopupContent'

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

  const handleOnClick = () => {
    setOpen && setOpen(false)
  }

  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        size="w-[614px]"
        refClass="max-h-100vh animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all top-1/2 -translate-y-1/2"
        childClass=""
        parentChildClass="py-17.5 px-19"
        footerButtonClassName="justify-center flex flex-row-reverse"
        color="danger"
        showHeader={false}
        showFooter={false}
      >
        <h2 className="text-xl font-bold text-bw-1 mb-4">Entrance Test</h2>
        <div
          className="cursor-pointer"
          onClick={() => {
            handleOnClick()
          }}
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
    </>
  )
}

export default EntrancePopup
