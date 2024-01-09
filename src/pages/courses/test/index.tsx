import SappModal from '@components/base/modal/SappModal'
import { formatTime } from '@components/common/timer'
import { TEST_TYPE } from '@utils/constants'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  title: string
  data?: any
}
const TestModal = ({ open, setOpen, title, data }: IProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  // const {} = useAppSelector()
  //to do: call api to get datail
  const getData = useEffect(() => {
    //dispatch(getDetailTest)
  }, [])
  const onSubmit = () => {
    //to do: start test
    router.push(`/test/${data.quiz.id}`)
  }
  const checkFinished = useMemo(() => {
    if (data?.quiz?.attempts.length === 0) {
      return false
    }
    for (let i in data?.quiz?.attempts) {
      if (data?.quiz?.attempts[i]?.status === 'SUBMITTED') {
        return true
      }
    }
    return false
  }, [data?.quiz?.attempts])
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      cancelButtonCaption="Cancel"
      okButtonCaption="Start"
      handleCancel={() => {
        setOpen(false)
      }}
      handleSubmit={onSubmit}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-screen-sm "
      footerButtonClassName="justify-between flex"
      childClass=""
      parentChildClass=""
      position="center"
      buttonSize="extra"
    >
      <div className="text-bw-1 text-4xl font-bold mb-4">
        {TEST_TYPE[data?.course_section_type]}
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Name:</div>
        <div className="text-bw-1">{data?.name}</div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Pass Mark:</div>
        <div className="text-bw-1">
          {data?.quiz?.attempts?.[0]?.score ?? '- -'}
        </div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Time Allowed:</div>
        <div className="text-bw-1">
          {data?.quiz?.quiz_timed
            ? formatTime(data?.quiz?.quiz_timed)
            : 'Unlimited'}
        </div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">No of Attempts:</div>
        <div className="text-bw-1">
          {data?.quiz?.attempts?.length}/
          {data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'}
        </div>
      </div>
      <div className="flex justify-between py-6 gap-8">
        <div className="text-gray-1">Status:</div>
        <div
          className={`${checkFinished ? 'text-state-success' : 'text-danger'}`}
        >
          {checkFinished ? 'Finished' : 'Unfinished'}
        </div>
      </div>
    </SappModal>
  )
}

export default TestModal
