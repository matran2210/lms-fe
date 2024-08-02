import SappModalV2 from '@components/base/modal/SappModalV2'
import { formatTime } from '@components/common/timer'
import PopupCanNotRetakeTest from '@components/mycourses/PogupCannotRetakeTest'
import { TEST_TYPE } from '@utils/constants'
import { trackGAEvent } from '@utils/google-analytics'
import { isNull } from 'lodash'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
enum StatusQuizAttempt {
  Passed = 'Passed',
  Failed = 'Failed',
  Unsubmitted = 'Unsubmitted',
}
interface IProps {
  open: boolean
  setOpen: any
  title?: string
  data?: any
  class_user_id?: string
  activeCourse?: any
  is_passed_course: boolean
}
const TestModal = ({
  open,
  setOpen,
  title,
  data,
  class_user_id,
  activeCourse,
  is_passed_course,
}: IProps) => {
  const router = useRouter()
  const [openResource, setOpenPopup] = useState(false)
  const onCancel = () => {
    setTimeout(() => {
      setOpen(false)
    })
  }

  const can_retake = useMemo(() => {
    if (!data?.quiz?.attempt) {
      return true
    }
    if (data.quiz.is_graded && is_passed_course) {
      return false
    }
    return true
  }, [data?.quiz?.attempt])
  const status = useMemo(() => {
    if (!data?.quiz?.attempt) {
      return StatusQuizAttempt.Unsubmitted
    }
    if (data.quiz.attempt.score < data?.quiz?.required_percent_score) {
      return StatusQuizAttempt.Failed
    }
    return StatusQuizAttempt.Passed
  }, [data?.quiz?.attempt])

  const onSubmit = async () => {
    if (!can_retake) {
      setOpenPopup(true)
      return
    }
    //to do: start test
    try {
      activeCourse && (await activeCourse())
      router.push({
        pathname: `/test/${data.quiz.id}`,
        query: {
          class_user_id: class_user_id,
        },
      })
      status
        ? () => trackGAEvent('Click Button Retake Modal Test')
        : () => trackGAEvent('Click Button Start Modal Test')
    } catch (err) {}
  }

  return (
    <SappModalV2
      title={TEST_TYPE[data?.course_section_type]}
      open={open}
      handleCancel={() => {
        setOpen(false)
        trackGAEvent('Click Button Cancel Modal Test')
      }}
      showOkButton={
        !data?.quiz?.is_limited
          ? true
          : (data?.quiz?.is_limited &&
                data?.quiz?.attempt?.number_of_attempts <
                  data?.quiz?.limit_count) ||
              isNull(data?.quiz?.attempt)
            ? true
            : false
      }
      onOk={onSubmit}
      okButtonCaption={
        status === StatusQuizAttempt.Unsubmitted ? 'Start' : 'Retake'
      }
      cancelButtonCaption={'Cancel'}
      buttonSize="medium"
    >
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8 text-base">
        <div className="text-gray-1">Name:</div>
        <div className="text-bw-1 line-clamp-2 pr-0.5 font-medium">
          {data?.name}
        </div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8 text-base">
        <div className="text-gray-1">Pass Point:</div>
        <div className="text-bw-1 pr-0.5 font-medium">
          {data?.quiz?.is_graded ? (
            <>{data?.quiz?.required_percent_score ?? '- -'}</>
          ) : (
            <>--</>
          )}
        </div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8 text-base">
        <div className="text-gray-1">Time Allowed:</div>
        <div className="text-bw-1 pr-0.5 font-medium">
          {data?.quiz?.quiz_timed
            ? formatTime(data?.quiz?.quiz_timed * 60)
            : 'Unlimited'}
        </div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8 text-base">
        <div className="text-gray-1">No of Attempts:</div>
        <div className="text-bw-1 pr-0.5 font-medium">
          {data?.quiz?.attempt?.number_of_attempts || 0}/
          {data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'}
        </div>
      </div>
      {data?.quiz && (
        <div className="flex justify-between py-6 border-b border-slate-100 gap-8 text-base">
          <div className="text-gray-1">Latest Result:</div>
          <div className="flex flex-row">
            <div className={` pr-0.5 font-medium`}>
              {data?.quiz?.attempt?.ratio_score ?? '--'}
            </div>
            {status !== StatusQuizAttempt.Unsubmitted && (
              <div
                className="underline ml-2 text-state-info cursor-pointer"
                onClick={() => {
                  router.push(
                    `/courses/test/test-result/${data?.quiz?.attempt?.id}`,
                  )
                  trackGAEvent('Click Button View Modal Result')
                }}
              >
                View
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between py-6 gap-8 text-base">
        <div className="text-gray-1">Status:</div>
        <div
          className={`${status === StatusQuizAttempt.Passed ? 'text-state-success' : status === StatusQuizAttempt.Failed ? 'text-state-error' : 'text-bw-1'} pr-0.5 font-medium`}
        >
          {status}
        </div>
      </div>
      <PopupCanNotRetakeTest
        open={openResource}
        setOpen={setOpenPopup}
        onCancel={() => onCancel()}
      />
    </SappModalV2>
  )
}

export default TestModal
