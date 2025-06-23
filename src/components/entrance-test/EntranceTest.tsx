import { ArrowDownIcon } from '@assets/icons/entranceTest'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonText from '@components/base/button/ButtonText'
import CardCourse from '@components/common/CardCourse/CardCourse'
import { formatTime } from '@components/common/timer'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { CoursesAPI } from '@pages/api/courses'
import { Select } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EAttemptStatus } from 'src/constants/attempt'
import { IEntranceTest, IEntranceTestAttempt } from 'src/type/entrance-test'
import EntrancePopup from './EntrancePopup'
import EntrancePopupContinue from './EntrancePopupContinue'

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
    attempts?: IEntranceTestAttempt[]
    limit_count?: number
  }
  test_id_default?: any | undefined
}

const EntranceTest = ({ data, test_id_default }: EntranceTestProps) => {
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [isOpenPopupLastAttempt, setIsOpenPopupLastAttempt] =
    useState<boolean>(false)
  const [remainingTimeLastAttempt, setRemainingTimeLastAttempt] =
    useState<number>(0)
  const [currentAttempt, setCurrentAttempt] = useState<IEntranceTestAttempt>(
    data?.attempts?.[0] || ({} as IEntranceTestAttempt),
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      if (
        data?.quiz_timed &&
        data?.attempt_status === EAttemptStatus['IN_PROGRESS']
      ) {
        const calcTime = dayjs(
          dayjs(currentAttempt?.started_at).add(data?.quiz_timed, 'minutes'),
        ).diff(dayjs(), 'seconds')

        setRemainingTimeLastAttempt(calcTime >= 0 ? calcTime : 0)
        const remainingTimeInterval = setInterval(() => {
          setRemainingTimeLastAttempt((prev) => {
            if (prev <= 0) {
              clearInterval(remainingTimeInterval)
              return 0
            }
            if (prev === 1) {
              handleSubmitQuestion()
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

  const timeTakenFormatted = currentAttempt?.total_attempt_time
    ? formatTime(currentAttempt?.total_attempt_time)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  /**
   * @description state này để đóng mở popup nếu học viên làm 2 lần
   */
  // const [openExpired, setOpenExpired] = useState(false)

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

  const handleSubmitQuestion = async (redirectToResult: boolean = false) => {
    setIsLoading(true)
    try {
      const res = await CoursesAPI.submitAllQuestion(
        currentAttempt?.id as string,
      )
      if (res.success) {
        if (redirectToResult) {
          router.push(`/entrance-test/test-result/${currentAttempt?.id}`)
        }
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
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
          created_at: currentAttempt?.started_at,
        }),
      )
      setIsOpenPopupLastAttempt(true)
    } else {
      setOpen(true)
    }
  }

  const renderButton = () => {
    if (!data?.attempts?.length) {
      //lần đầu làm bài
      return (
        <ButtonSecondary
          title="Begin"
          className="ml-auto"
          size="medium"
          onClick={handleClickBegin}
        />
      )
    }
    if (currentAttempt?.status === EAttemptStatus['IN_PROGRESS']) {
      return (
        <ButtonSecondary
          title="Resume"
          size="medium"
          className="ml-auto"
          onClick={handleClickBegin}
        />
      )
    } else {
      return (
        <>
          <ButtonText
            title="Result"
            size="medium"
            onClick={() =>
              router.push(`/entrance-test/test-result/${currentAttempt?.id}`)
            }
          />
          {data?.attempts?.length < (data?.limit_count ?? 0) && (
            <ButtonSecondary
              title="Retake"
              className="ml-4"
              size="medium"
              onClick={() => {
                localStorage.removeItem('quizAttempt')
                setOpen(true)
              }}
            />
          )}
        </>
      )
    }
  }

  const renderTimeContent = () => {
    if (data?.attempts && data?.attempts?.length > 0) {
      if (
        currentAttempt?.status === EAttemptStatus['IN_PROGRESS'] &&
        remainingTimeLastAttempt >= 0
      ) {
        return (
          <>
            <p>Time Remaining:</p>
            <p
              className={`font-medium ${remainingTimeLastAttempt > 0 ? 'text-gray-800' : 'text-error'}`}
            >
              {formatTime(
                remainingTimeLastAttempt > 0 ? remainingTimeLastAttempt : 0,
              )}
            </p>
          </>
        )
      } else {
        return (
          <>
            <p>Time taken:</p>
            <p className="font-medium text-gray-800">{timeTakenFormatted}</p>
          </>
        )
      }
    } else {
      return (
        <>
          <p>Time allowed: </p>
          <p className="font-medium text-gray-800">{timeAllowFormatted}</p>
        </>
      )
    }
  }

  const cardFooter = (
    <div className="action relative mt-10 flex items-center justify-end">
      {renderButton()}
    </div>
  )

  return (
    <>
      <CardCourse
        title={data?.name || ''}
        attemptStatus={currentAttempt?.status as EAttemptStatus}
        footer={cardFooter}
      >
        <div>
          <div className="info border-l border-[#DCDDDD] px-4">
            <div className="flex justify-between text-base capitalize text-gray">
              {renderTimeContent()}
            </div>
            <div className="flex justify-between pt-4 text-base capitalize text-gray">
              <p>No of Attemps:</p>
              {data?.attempts && data.attempts.length > 0 ? (
                <>
                  {/* {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
                    <span className="text-gray-800">--</span>
                  ) : (
                    <p className="font-medium text-info">
                      {data.attempts.length + '/' + data?.limit_count}
                    </p>
                  )} */}
                  <p className="font-medium text-gray-800">
                    {data.attempts.length + '/' + data?.limit_count}
                  </p>
                </>
              ) : (
                <span className="text-gray-800">--</span>
              )}
            </div>
            <div className="flex justify-between pt-4 text-base capitalize text-gray-800">
              <div className="flex items-center">
                {data?.attempts?.length && data?.attempts?.length > 0 ? (
                  <>
                    <span>Result of Attemps:</span>
                    {data?.attempts?.length > 1 ? (
                      <Select
                        options={data?.attempts
                          ?.map((item, index) => ({
                            value: item.id,
                            label: `${(data?.attempts?.length ?? 0) - index}`,
                          }))
                          .reverse()}
                        classNames={{
                          root: 'select-result-attempt',
                          popup: { root: 'select-result-attempt-option' },
                        }}
                        variant="borderless"
                        value={currentAttempt?.id}
                        onChange={(value) => {
                          setCurrentAttempt(
                            data?.attempts?.find((item) => item.id === value) ||
                              ({} as IEntranceTestAttempt),
                          )
                        }}
                        suffixIcon={<ArrowDownIcon />}
                      />
                    ) : (
                      <span className="ml-1">{data?.attempts?.length}</span>
                    )}
                  </>
                ) : (
                  <span className="mr-1">Result of Attemps:</span>
                )}
              </div>
              {data?.attempts?.length && data?.attempts?.length > 0 ? (
                <>
                  {currentAttempt?.status === EAttemptStatus['IN_PROGRESS'] ? (
                    <span className="text-gray-800">--</span>
                  ) : (
                    <p className="flex items-center font-medium text-info">
                      {/* {data?.total_correct_answer + '/' + data?.total_question} */}
                      {currentAttempt?.ratio_score}
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
        <EntrancePopupContinue
          isOpenPopupLastAttempt={isOpenPopupLastAttempt}
          setIsOpenPopupLastAttempt={setIsOpenPopupLastAttempt}
          data={data as IEntranceTest}
          remainingTimeLastAttempt={remainingTimeLastAttempt}
          handleSubmit={handleSubmitQuestion}
          currentAttempt={currentAttempt}
          isLoading={isLoading}
        />
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
      {/* <PopupExtend open={openExpired} setOpen={setOpenExpired} /> */}
    </>
  )
}

export default EntranceTest
