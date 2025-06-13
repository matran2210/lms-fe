import { ClockIcon } from '@assets/icons'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappButton from '@components/base/button/SappButton'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { formatTime } from '@components/common/timer'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import EntrancePopup from './EntrancePopup'
import PopupExtend from './PopupExtend'
import CardCourse from '@components/common/CardCourse/CardCourse'
import { AccessIcon } from '@assets/icons/entranceTest'
import Link from 'next/link'
import ButtonText from '@components/base/button/ButtonText'

interface EntranceTestProps {
  data: {
    id: string
    name: string
    attempt_status?: EAttemptStatus
    quiz_timed?: number
    created_at?: string
    quiz_attempt_id?: string
    is_attempt?: boolean
    total_attempt_time?: number
    total_correct_answer?: number
    total_question?: number
    attempt_times?: number
    is_limited?: boolean
  }
  test_id_default?: any | undefined
}

enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
}

const EntranceTest = ({ data, test_id_default }: EntranceTestProps) => {
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [isOpenPopupLastAttempt, setIsOpenPopupLastAttempt] =
    useState<boolean>(false)
  const [remainingTimeLastAttempt, setRemainingTimeLastAttempt] =
    useState<number>(0)

  useEffect(() => {
    if (data) {
      if (
        data?.quiz_timed &&
        data?.attempt_status === EAttemptStatus['IN_PROGRESS']
      ) {
        const calcTime = dayjs(
          dayjs(data?.created_at).add(data?.quiz_timed, 'minutes'),
        ).diff(dayjs(), 'seconds')

        setRemainingTimeLastAttempt(calcTime >= 0 ? calcTime : 0)
        const remainingTimeInterval = setInterval(() => {
          setRemainingTimeLastAttempt((prev) => {
            if (prev <= 0) {
              clearInterval(remainingTimeInterval)
              return 0
            }
            return prev - 1
          })
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
  // const isAttemptValid =
  //   data.is_attempt &&
  //   [
  //     EAttemptStatus.SUBMITTED,
  //     EAttemptStatus.UN_FINISHED,
  //     EAttemptStatus.UN_SUBMITTED,
  //   ].includes(data?.attempt_status)

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

  const handleClickBegin = () => {
    //reset local storage
    localStorage.removeItem('quizAttempt')

    if (data?.attempt_status === EAttemptStatus['IN_PROGRESS']) {
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
      setIsOpenPopupLastAttempt(true)
    } else {
      setOpen(true)
    }
  }

  const cardFooter = (
    <div className="action relative mt-10 flex items-center justify-end">
      {/* chưa làm bài hoặc đang làm bài thì button sẽ là begin */}
      {!data?.attempt_status ||
      data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
        <ButtonSecondary
          title="Begin"
          className="ml-auto"
          onClick={handleClickBegin}
        />
      ) : (
        // đã làm bài xong
        <>
          <ButtonText
            title="Result"
            onClick={() =>
              router.push(`/entrance-test/test-result/${data?.quiz_attempt_id}`)
            }
            className="mr-4"
          />
          <ButtonSecondary
            title="Retake"
            onClick={() => setOpenExpired(true)}
          />
        </>
      )}
    </div>
  )

  return (
    <>
      <CardCourse
        title={data?.name || ''}
        attemptStatus={data?.attempt_status}
        footer={cardFooter}
      >
        <div className="mt-10">
          <div className="info border-l border-[#DCDDDD] px-4">
            <div className="text-ink flex justify-between text-base capitalize">
              {data?.is_attempt ? (
                <>
                  <p>Time taken:</p>
                  {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
                    <span>--</span>
                  ) : (
                    <p className="font-medium text-[#050505]">
                      {timeTakenFormatted}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>Time allowed: </p>
                  <p className="font-medium text-[#050505]">
                    {timeAllowFormatted}
                  </p>
                </>
              )}
            </div>
            <div className="text-ink flex justify-between pt-4 text-base capitalize">
              <p>Results:</p>
              {data?.is_attempt ? (
                <>
                  {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
                    <span className="text-gray-800">--</span>
                  ) : (
                    <p className="font-medium text-info">
                      {data?.total_correct_answer + '/' + data?.total_question}
                    </p>
                  )}
                </>
              ) : (
                <span className="text-gray-800">--</span>
              )}
            </div>
          </div>
        </div>
      </CardCourse>
      <PopUpRemindEntrance
        setOpenFillForm={setOpenFillForm}
        setOpenTest={setOpen}
      />

      {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
        <SappModalV3
          title={
            <div className="flex items-center justify-between gap-2">
              <div>Entrance Test</div>
              {!!data?.quiz_timed &&
                (!!remainingTimeLastAttempt ||
                  remainingTimeLastAttempt === 0) && (
                  <div
                    className={`item-center flex gap-2 font-normal ${remainingTimeLastAttempt > 0 ? 'text-[#3964EA]' : 'text-error'}`}
                  >
                    <div className="m-auto">
                      <ClockIcon
                        color={
                          remainingTimeLastAttempt > 0 ? '#3964EA' : '#B90E0A'
                        }
                        size={24}
                      />
                    </div>
                    <div className="text-[20px]">
                      {formatTime(
                        remainingTimeLastAttempt > 0
                          ? remainingTimeLastAttempt
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
          onOk={handleSubmit}
          okButtonCaption={'Continue'}
          footerButtonClassName="flex justify-between item-center"
          cancelButtonCaption={'Cancel'}
          cancelButtonClass={'!px-0'}
          buttonSize="medium"
          icon={undefined}
        >
          <div className="my-4 text-start text-sm text-[#A1A1A1]">
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
