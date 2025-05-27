import { ClockIcon } from '@assets/icons'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappButton from '@components/base/button/SappButton'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { formatTime } from '@components/common/timer'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import EntrancePopup from './EntrancePopup'
import PopupExtend from './PopupExtend'

interface EntranceTestProps {
  data: any
  test_id_default?: any | undefined
}

enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
}

const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, 'minutes').toDate()
}

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed)
  return dayjs().isAfter(endTime)
}

const EntranceTest = ({ data, test_id_default }: EntranceTestProps) => {
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<number>()
  const [isOpenPopupLastAttempt, setIsOpenPopupLastAttempt] =
    useState<boolean>(false)
  let remainingTimeLastAttempt = useRef<number>(0)

  const isContinueAttempt = useMemo(() => {
    if (data) {
      //check điều kiện xem có được tiếp tục làm bài hay không
      let isExpired = false
      if (data?.quiz_timed) {
        isExpired = isQuizExpired(new Date(data?.created_at), data?.quiz_timed)
      }

      const isContinueAttempt = data?.attempt_status === 'IN_PROGRESS'
      if (isContinueAttempt && !isExpired) {
        localStorage.setItem(
          'quizAttempt',
          JSON.stringify({
            id: data?.quiz_attempt_id,
            number_of_attempts: data?.attempt_times,
            is_limited: data?.is_limited,
            quiz_timed: data?.quiz_timed,
            created_at: data?.created_at,
          }),
        )
        return true
      } else {
        localStorage.removeItem('quizAttempt')
        return false
      }
    }
    return false
  }, [data])

  useEffect(() => {
    if (open && data) {
      if (data?.quiz_timed && data?.attempt_status === 'IN_PROGRESS') {
        const calcTime = dayjs(
          dayjs(data?.created_at).add(data?.quiz_timed, 'minutes'),
        ).diff(dayjs(), 'seconds')

        remainingTimeLastAttempt.current = calcTime >= 0 ? calcTime : 0
        const remainingTimeInterval = setInterval(() => {
          setRemainingTime(
            remainingTimeLastAttempt?.current >= 0
              ? remainingTimeLastAttempt?.current
              : 0,
          )
          remainingTimeLastAttempt.current -= 1
          if (remainingTimeLastAttempt.current <= 0) {
            clearInterval(remainingTimeInterval)
          }
        }, 1000)

        return () => {
          clearInterval(remainingTimeInterval)
        }
      }
    }
  }, [data])

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTime(data?.total_attempt_time)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  /**
   * @description state này để đóng mở popup nếu học viên làm 2 lần
   */
  const [openExpired, setOpenExpired] = useState(false)

  /**
   * @description Kiểm tra điều kiện có hiệu lực
   */
  const isAttemptValid =
    data.is_attempt &&
    [
      EAttemptStatus.SUBMITTED,
      EAttemptStatus.UN_FINISHED,
      EAttemptStatus.UN_SUBMITTED,
    ].includes(data?.attempt_status)

  const onSubmit = async () => {
    if (remainingTimeLastAttempt.current <= 0 && isContinueAttempt) {
      // Call api finish test
      handleFinishTest()
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    //to do: start test
    try {
      router.push({
        pathname: `/test/${data?.id}`,
        query: {
          type: 'entrance',
        },
      })
      trackGAEvent('Click Button Continue Modal Test')
    } catch (err) {}
  }

  const handleFinishTest = async () => {
    localStorage.setItem(
      'quizAttempt',
      JSON.stringify({
        id: data?.quiz_attempt_id,
        number_of_attempts: data?.attempt_times,
        is_limited: data?.is_limited,
        quiz_timed: data?.quiz_timed,
        created_at: data?.created_at,
      }),
    )
    handleSubmit()
  }

  return (
    <>
      <div className="name">
        <h2 className="mb-5 line-clamp-2 text-2xl font-medium text-bw-1">
          {data?.name}
        </h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between border-b border-gray-2 pb-4 text-base capitalize text-gray-1">
            {data?.is_attempt ? (
              <>
                <p>Time taken:</p>
                <p className="font-medium text-bw-1">{timeTakenFormatted}</p>
              </>
            ) : (
              <>
                <p>Time allowed: </p>
                <p className="font-medium text-bw-1">{timeAllowFormatted}</p>
              </>
            )}
          </div>
          <div className="flex justify-between pt-4 text-base capitalize text-gray-1">
            <p>Results:</p>
            {data?.is_attempt ? (
              <>
                <p className="text-state-success">
                  {data?.total_correct_answer + '/' + data?.total_question}
                </p>
              </>
            ) : (
              <span>--</span>
            )}
          </div>
        </div>
        <div className="action relative mt-10 flex items-center justify-between">
          {isAttemptValid ? (
            <>
              <ButtonSecondary
                title="Retake"
                size="small"
                full={false}
                onClick={() => setOpenExpired(true)}
              />
              <SappButton
                title="Result"
                onClick={() =>
                  router.push(
                    `/entrance-test/test-result/${data?.quiz_attempt_id}`,
                  )
                }
                isUnderLine
                color="text"
                className="!p-0 font-medium underline"
                size="small"
              />
            </>
          ) : (
            <ButtonSecondary
              title="Begin"
              full={false}
              size={'small'}
              className="ml-auto"
              onClick={() => {
                if (isContinueAttempt) {
                  setIsOpenPopupLastAttempt(true)
                } else {
                  setOpen(true)
                }
              }}
            />
          )}
        </div>
      </div>
      <PopUpRemindEntrance
        setOpenFillForm={setOpenFillForm}
        setOpenTest={setOpen}
      />

      {isContinueAttempt ? (
        <SappModalV3
          title={
            <div className="flex items-center justify-between gap-2">
              <div>Entrance Test</div>
              {!!data?.quiz_timed && !!remainingTimeLastAttempt.current && (
                <div
                  className={`item-center flex gap-2 font-normal ${remainingTimeLastAttempt.current > 0 ? 'text-[#3964EA]' : 'text-state-error'}`}
                >
                  <div className="m-auto">
                    <ClockIcon
                      color={
                        remainingTimeLastAttempt.current > 0
                          ? '#3964EA'
                          : '#B90E0A'
                      }
                      size={24}
                    />
                  </div>
                  <div className="text-[20px]">
                    {formatTime(
                      remainingTimeLastAttempt.current > 0
                        ? remainingTimeLastAttempt.current
                        : 0,
                    )}
                  </div>
                </div>
              )}
            </div>
          }
          open={isOpenPopupLastAttempt}
          handleCancel={() => {
            setIsOpenPopupLastAttempt(false)
            trackGAEvent('Click Button Cancel Modal Test')
          }}
          onOk={onSubmit}
          okButtonCaption={'Continue'}
          footerButtonClassName="flex justify-between item-center"
          cancelButtonCaption={'Cancel'}
          cancelButtonClass={'!px-0'}
          buttonSize="medium"
          icon={undefined}
        >
          <div className="my-4 text-start text-medium-sm text-gray-1">
            <div>
              {`Your last attempt was unexpectedly ended. Please click 'Continue'
              to proceed with the test.`}
            </div>
          </div>
        </SappModalV3>
      ) : (
        <EntrancePopup
          open={open}
          setOpen={setOpen}
          data={data}
          openFillForn={openFillForn}
          setOpenFillForm={setOpenFillForm}
          entranceTest={test_id_default}
        />
      )}
      <PopupExtend open={openExpired} setOpen={setOpenExpired} />
    </>
  )
}

export default EntranceTest
