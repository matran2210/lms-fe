// ConfirmDialog.tsx
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { useRouter } from 'next/router'
import SappModalV2 from '@components/base/modal/SappModalV2'

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
    if (user?.university && user?.university_program && user?.english_level) {
      return true
    }
    return false
  }, [user])
  const checkLimit = useMemo(() => {
    if (entrancePopupContent?.is_limited) {
      if (
        entrancePopupContent?.attempt_times ===
        entrancePopupContent?.limit_count
      ) {
        return true
      }
    }
    return false
  }, [entrancePopupContent])

  return (
    <>
      <SappModalV2
        open={open}
        cancelButtonCaption="Cancel"
        okButtonCaption={`${!checkInfo ? 'Next' : 'Start'}`}
        handleCancel={handleOnClick}
        onOk={() => {
          if (checkInfo) {
            // router.push(`/test/${entrancePopupContent.id}`)
            router.push({
              pathname: `/test/${entrancePopupContent?.id}`,
              query: {
                type: 'entrance',
              },
            })
          } else {
            setOpenFillForm(true)
            setOpen && setOpen(false)
          }
        }}
        showOkButton={!checkLimit}
        showHeader={false}
        buttonSize="medium"
        title={undefined}
      >
        <h2 className="mb-4 max-w-screen-sm text-4xl font-bold text-bw-1">
          Entrance Test Info
        </h2>
        <EntrancePopupContent
          name={entrancePopupContent?.name || ''}
          score={entrancePopupContent?.score}
          timeAllow={entrancePopupContent?.quiz_timed}
          attemps={`${entrancePopupContent?.attempt_times || '0'}`}
          status={entrancePopupContent?.is_attempt}
        />
      </SappModalV2>
      <EntranceTestFillForm
        open={openFillForn}
        setOpen={setOpenFillForm}
        entrancePopupContent={entrancePopupContent}
      />
    </>
  )
}

export default EntrancePopup
