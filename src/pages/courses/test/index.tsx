import SappModal from '@components/base/modal/SappModal'
import { formatTime } from '@components/common/timer'
import { TEST_TYPE } from '@utils/constants'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  title?: string
  data?: any
  class_user_id?: string
  activeCourse?: any
}
const TestModal = ({
  open,
  setOpen,
  title,
  data,
  class_user_id,
  activeCourse,
}: IProps) => {
  const router = useRouter()
  const onSubmit = async () => {
    //to do: start test
    try {
      activeCourse && (await activeCourse())
      router.push({
        pathname: `/test/${data.quiz.id}`,
        query: {
          class_user_id: class_user_id,
        },
      })
    } catch (err) {}
  }
  const checkFinished = useMemo(() => {
    if (data?.quiz?.attempts) {
      if (data?.quiz?.attempts?.length > 0) {
        return true
      }
      // for (let i in data?.quiz?.attempts) {
      //   if (data?.quiz?.attempts[i]?.status === 'SUBMITTED') {
      //     return true
      //   }
      // }
      return false
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
        <div className="text-bw-1 line-clamp-2">{data?.name}</div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Pass Point:</div>
        <div className="text-bw-1 pr-0.5">
          {data?.quiz?.required_percent_score ?? '- -'}
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
          {data?.quiz?.attempt_count || 0}/
          {data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'}
        </div>
      </div>
      {data?.quiz?.attempts?.[0]?.ratio_score && (
        <div className="flex justify-between py-6 gap-8">
          <div className="text-gray-1">Latest Result:</div>
          <div className="text-state-info font-medium underline">
            {data?.quiz?.attempts?.[0]?.ratio_score ?? '- -'}
          </div>
        </div>
      )}
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
