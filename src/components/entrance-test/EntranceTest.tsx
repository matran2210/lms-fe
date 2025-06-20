import { ClockIcon } from '@assets/icons'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonText from '@components/base/button/ButtonText'
import SappModalV3 from '@components/base/modal/SappModalV3'
import CardCourse from '@components/common/CardCourse/CardCourse'
import { formatTime } from '@components/common/timer'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EAttemptStatus } from 'src/constants/attempt'
import EntrancePopup from './EntrancePopup'
import PopupExtend from './PopupExtend'
import { Select } from 'antd'
import { ArrowDownIcon } from '@assets/icons/entranceTest'

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
    attempts?: IAttempt[]
    limit_count?: number
  }
  test_id_default?: any | undefined
}

interface IAttempt {
  answers?: []
  created_at?: string
  id?: string
  is_graded?: boolean
  number_of_attempts?: number
  status?: string
  ratio_score?: string
  total_attempt_time?: number
  started_at?: string
}

const EntranceTest = ({ data, test_id_default }: EntranceTestProps) => {
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [isOpenPopupLastAttempt, setIsOpenPopupLastAttempt] =
    useState<boolean>(false)
  const [remainingTimeLastAttempt, setRemainingTimeLastAttempt] =
    useState<number>(0)
  const [currentAttempt, setCurrentAttempt] = useState<IAttempt>(
    data?.attempts?.[0] || ({} as IAttempt),
  )

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
          onClick={handleClickBegin}
        />
      )
    }
    if (currentAttempt?.status === EAttemptStatus['IN_PROGRESS']) {
      return (
        <ButtonSecondary
          title="Resume"
          className="ml-auto"
          onClick={handleClickBegin}
        />
      )
    } else {
      return (
        <>
          <ButtonText
            title="Result"
            onClick={() =>
              router.push(`/entrance-test/test-result/${currentAttempt?.id}`)
            }
            className="mr-4"
          />
          <ButtonSecondary
            title="Retake"
            onClick={() => {
              if (data?.attempts?.length === data?.limit_count) {
                setOpenExpired(true)
              } else {
                localStorage.removeItem('quizAttempt')
                setOpen(true)
              }
            }}
          />
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
        <div className="mt-10">
          <div className="info border-l border-[#DCDDDD] px-4">
            <div className="flex justify-between text-base capitalize text-gray">
              {data?.is_attempt ? (
                <>
                  <p>Time taken:</p>
                  {currentAttempt?.status === EAttemptStatus['IN_PROGRESS'] ? (
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
                              ({} as IAttempt),
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
