import SappModalV2 from '@components/base/modal/SappModalV2'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react'
import { useAppSelector } from 'src/redux/hook'
import { entranceTestReducer } from 'src/redux/slice/EntranceTest/EntranceTest'
import EntrancePopupContent from './EntrancePopupContent'
import dayjs from 'dayjs'

const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, 'minutes').toDate()
}

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed)
  return dayjs().isAfter(endTime)
}

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  data?: any
  setOpenFillForm: Dispatch<SetStateAction<boolean>>
  openFillForn: boolean
  entranceTest?: Record<any, any> | undefined
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  data,
  // openFillForn,
  // setOpenFillForm,
  entranceTest,
}) => {
  const handleOnClick = () => {
    setOpen && setOpen(false)
  }

  const { count } = useAppSelector(entranceTestReducer)
  const router = useRouter()

  const checkLimit = useMemo(() => {
    if (data?.is_limited) {
      if (data?.attempt_times === data?.limit_count) {
        return true
      }
    }
    return false
  }, [data])

  return (
    <>
      <SappModalV2
        open={open}
        cancelButtonCaption="Back"
        okButtonCaption="Start"
        handleCancel={handleOnClick}
        onOk={() => {
          router.push({
            pathname: `/test/${count === 1 ? entranceTest?.id : data?.id}`,
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
        <h2 className="max-w-screen-sm mb-4 text-4xl font-bold text-[#050505]">
          Test Information
        </h2>
        <div className="text-sm text-[#A1A1A1]">Let’s start!</div>
        <EntrancePopupContent
          name={count === 1 ? entranceTest?.name : data?.name || ''}
          timeAllow={count === 1 ? entranceTest?.quiz_timed : data?.quiz_timed}
          attemps={`${count === 1 ? entranceTest?.attempt_times || 0 : data?.attempt_times || '0'}`}
          limit_count={
            count === 1 ? entranceTest?.limit_count : data?.limit_count
          }
          total_question={
            count === 1 ? entranceTest?.total_question : data?.total_question
          }
        />
      </SappModalV2>
      {/* <EntranceTestFillForm
        open={openFillForn}
        setOpen={setOpenFillForm}
        entrancePopupContent={data}
        setOpenTestInfo={setOpen}
      /> */}
    </>
  )
}

export default EntrancePopup
