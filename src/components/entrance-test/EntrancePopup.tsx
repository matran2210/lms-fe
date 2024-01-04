// ConfirmDialog.tsx
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { useRouter } from 'next/router'

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
  const { user } = useAppSelector(userReducer)
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()

  const checkInfo = useMemo(() => {
    if (user.university && user.university_program && user.english_level) {
      return true
    }
    return false
  }, [user])
  const checkLimit = useMemo(() => {
    if (entrancePopupContent.is_limited) {
      if (
        entrancePopupContent.attempt_times === entrancePopupContent.limit_count
      ) {
        return true
      }
    }
    return false
  }, [entrancePopupContent])
  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        cancelButtonCaption="Cancel"
        okButtonCaption={`${!checkInfo ? 'Next' : 'Start'}`}
        handleCancel={handleOnClick}
        handleSubmit={() => {
          if (checkInfo) {
            router.push(`/test/${entrancePopupContent.id}`)
          } else {
            setOpenFillForm(true)
          }
        }}
        showOkButton={!checkLimit}
        showHeader={false}
        refClass="md:px-5 py-5 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
        size="max-w-screen-sm"
        // size="max-w-1/2"
        footerButtonClassName="justify-between flex"
        childClass=""
        parentChildClass=""
        position="center"
        closeAfterSubmit={true}
        buttonSize="extra"
        footerClassName="md:!px-16 !pb-12"
      >
        <h2 className="text-4xl font-bold text-bw-1 mb-4 max-w-screen-sm md:px-16 pt-12">
          Entrance Test Info
        </h2>
        <div
          className="cursor-pointer md:px-16"
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
