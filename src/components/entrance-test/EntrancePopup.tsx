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
  entranceTest?: Record<any, any> | undefined
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  entrancePopupContent,
  openFillForn,
  setOpenFillForm,
  entranceTest,
}) => {
  const handleOnClick = () => {
    setOpen && setOpen(false)
    // setOpenFillForm(true)
  }

  const { count } = useAppSelector(entranceTestReducer)
  const router = useRouter()

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
        cancelButtonCaption="Back"
        okButtonCaption="Start"
        handleCancel={handleOnClick}
        onOk={() => {
          router.push({
            pathname: `/test/${count === 1 ? entranceTest?.id : entrancePopupContent?.id}`,
            query: {
              type: 'entrance',
            },
          })
        }}
        showOkButton={!checkLimit || count >= 1}
        showHeader={false}
        buttonSize="medium"
        title={undefined}
      >
        <h2 className="mb-4 max-w-screen-sm text-4xl font-bold text-bw-1">
          Test Information
        </h2>
        <div className="text-sm text-gray-1">Let’s start!</div>
        <EntrancePopupContent
          name={
            count === 1 ? entranceTest?.name : entrancePopupContent?.name || ''
          }
          timeAllow={
            count === 1
              ? entranceTest?.quiz_timed
              : entrancePopupContent?.quiz_timed
          }
          attemps={`${count === 1 ? entranceTest?.attempt_times || 0 : entrancePopupContent?.attempt_times || '0'}`}
          limit_count={
            count === 1
              ? entranceTest?.limit_count
              : entrancePopupContent?.limit_count
          }
          total_question={
            count === 1
              ? entranceTest?.total_question
              : entrancePopupContent?.total_question
          }
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
