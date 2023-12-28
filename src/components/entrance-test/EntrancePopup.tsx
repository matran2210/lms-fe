// ConfirmDialog.tsx
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  entrancePopupContent?: any
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  entrancePopupContent,
}) => {
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
        refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
        size="max-w-screen-sm"
        // size="max-w-1/2"
        footerButtonClassName="justify-between flex"
        childClass=""
        parentChildClass=""
        position="center"
        closeAfterSubmit={false}
        buttonSize="extra"
      >
        <h2 className="text-4xl font-bold text-bw-1 mb-4 max-w-screen-sm">
          Entrance Test Info
        </h2>
        <div
          className="cursor-pointer"
          // onClick={() => {
          //   handleOnClick()
          // }}
        >
          <EntrancePopupContent
            name={entrancePopupContent?.name || ''}
            score={entrancePopupContent?.score}
            timeAllow={entrancePopupContent?.quiz_timed}
            attemps={`${entrancePopupContent?.attempt_times || '0'}`}
            status={entrancePopupContent.is_attempt}
          />
        </div>
      </SappModal>
      <EntranceTestFillForm
        open={openFillForn}
        setOpen={setOpenFillForm}
        entrancePopupContent={entrancePopupContent}
      />
    </>
  )
}

export default EntrancePopup
