// ConfirmDialog.tsx
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { useRouter } from 'next/router'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { entranceTestReducer } from 'src/redux/slice/EntranceTest/EntranceTest'

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  entrancePopupContent?: any
  setOpenFillForm: Dispatch<SetStateAction<boolean>>
  openFillForn: boolean
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  entrancePopupContent,
  openFillForn,
  setOpenFillForm,
}) => {
  const handleOnClick = () => {
    setOpen && setOpen(false)
    // setOpenFillForm(true)
  }

  const { count } = useAppSelector(entranceTestReducer)
  const { user } = useAppSelector(userReducer)
  const router = useRouter()

  const checkInfo = useMemo(() => {
    if (
      (user?.detail?.university as any)?.id &&
      user?.university_program?.id &&
      user?.english_level?.id
    ) {
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
          }
          if (count === 1) {
            router.push({
              pathname: `/test/${entrancePopupContent?.id}`,
              query: {
                type: 'entrance',
              },
            })
          } else {
            if (!checkInfo) {
              setOpenFillForm(true)
              setOpen && setOpen(false)
            }
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
        setOpenTestInfo={setOpen}
      />
    </>
  )
}

export default EntrancePopup
