import SappDrawer from '@components/base/SappDrawer'
import CalendarApi from '@pages/api/calendar'
import getConfig from 'next/config'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { IEvent } from 'sapp-common-package-test-final/dist/types'
import { ICalendarDetail } from 'src/type/calendar'
import CourseTree from './CourseTree'
import SappIcon from 'src/common/SappIcon'
import dayjs from 'dayjs'
import { CALENDAR_FILTER_TYPE, LEARNING_USER_STATUS } from 'src/constants'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

interface IProps {
  open: { isOpen: boolean; data: IEvent | null }
  setOpen: Dispatch<SetStateAction<{ isOpen: boolean; data: IEvent | null }>>
}

const DetailCalendar = ({ open, setOpen }: IProps) => {
  const [data, setData] = useState<ICalendarDetail>()
  const [loading, setLoading] = useState<boolean>(false)
  const [collapse, setCollapse] = useState<{ top: boolean; bottom: boolean }>({
    top: true,
    bottom: true,
  })

  const getMode = () => {
    if (data?.schedule.is_holiday) {
      return (
        <div className="max-w-fit bg-[#F897070D]/5 px-[19px] py-[4.5px] text-base font-normal text-[#F89707]">
          Online
        </div>
      )
    }
    switch (data?.mode) {
      case CALENDAR_FILTER_TYPE.OFFLINE:
        return (
          <div className="max-w-fit bg-[#07AF17]/5 px-[19px] py-[4.5px] text-base font-normal text-[#07AF17]">
            Offline
          </div>
        )
      case CALENDAR_FILTER_TYPE.ONLINE:
        return (
          <div className="max-w-fit bg-[#176CDD]/5  px-[19px] py-[4.5px] text-[#176CDD]">
            Online
          </div>
        )
      case CALENDAR_FILTER_TYPE.LIVE_ONLINE:
        return (
          <div className="max-w-fit bg-[#8F6FEA]/5 px-[19px] py-[4.5px] text-[#8F6FEA]">
            Live Online
          </div>
        )
    }
  }

  const getKeyContent = () => {
    return data?.key_before_contents.map((item) => {
      return (
        <div
          key={item.id}
          className="max-w-[111px] bg-[#F9F9F9] px-[8px] py-[4px] text-sm text-[#404041]"
        >
          {item.name}
        </div>
      )
    })
  }

  const togglePopup = (position: 'top' | 'bottom') => {
    setCollapse((prev) => ({ ...prev, [position]: !prev[position] }))
  }

  const renderTime = useMemo(() => {
    const start = dayjs(
      `${data?.schedule?.start_date}T${data?.schedule?.start_time}Z`,
    )
    const end = dayjs(
      `${data?.schedule?.end_date}T${data?.schedule?.end_time}Z`,
    )
    if (data?.schedule.is_holiday) {
      return (
        <>
          <div className="col-span-1 text-[#A1A1A1]">Lesson Date</div>
          <div className="col-span-1">{start.format('MMM DD, YYYY')}</div>
        </>
      )
    }
    if (data?.mode === 'ONLINE') {
      return (
        <>
          <div className="col-span-1 text-[#A1A1A1]">Lesson Date</div>
          <div className="col-span-1">{`${start.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
          <div className="col-span-1 text-[#A1A1A1]">Deadline</div>
          <div className="col-span-1">{`${end.format('HH:mm')} | ${end.format('MMM DD YYYY')}`}</div>
        </>
      )
    }
    return (
      <>
        <div className="col-span-1 text-[#A1A1A1]">Lesson Date</div>
        <div className="col-span-1">{`${start.format('HH:mm')} - ${end.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
      </>
    )
  }, [data])

  async function fetchData() {
    setLoading(true)
    try {
      if (!open?.data?.id) return
      const res = await CalendarApi.getDetailEvent(
        open?.data?.id,
        open?.data?.type === 'HOLIDAY',
      )
      setData(res.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open.isOpen) {
      fetchData()
    }
  }, [open])

  return (
    <SappDrawer
      isOpen={open.isOpen}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => {
        setOpen({ isOpen: false, data: null })
      }}
      title="Event Infomation"
      confirmOnClose={false}
      footer={data?.mode === 'ONLINE'}
      drawerSubId={'-notes-list'}
      heightBody={'h-[calc(100vh-112px)]'}
      showCancelButton={false}
      showSubmitButton={data?.mode === 'ONLINE'}
      btnSubmitTile={
        LEARNING_USER_STATUS.READY_TO_LEARN === data?.status
          ? 'Start'
          : LEARNING_USER_STATUS.IN_PROGRESS === data?.status
            ? 'Continue'
            : 'Review'
      }
      footerClassName="!justify-end w-full"
      loading={loading}
    >
      <div>
        <div>
          <div className="border border-solid border-[#F1F1F1] px-[28px] py-[16px]">
            <div className="flex items-center justify-between border-b-[1px] pb-[16px] text-base  font-semibold text-[#404041]">
              <div>Primary Information</div>
              <div
                className="hover:cursor-pointer"
                onClick={() => togglePopup('top')}
              >
                {collapse.top ? (
                  <SappIcon icon="arrowDown" />
                ) : (
                  <SappIcon icon="arrowUp" />
                )}
              </div>
            </div>
            {collapse.top && (
              <div className="grid grid-cols-2 gap-y-[21.5px] pt-[21.5px] text-sm">
                <div className="col-span-1 text-[#A1A1A1]">
                  {data?.schedule.is_holiday ? 'Event Name' : 'Class Code'}
                </div>
                <div className="col-span-1">
                  {data?.schedule.is_holiday ? data?.name : data?.class?.code}
                </div>
                <div className="col-span-1 text-[#A1A1A1]">
                  {data?.schedule.is_holiday ? 'Type' : 'Learning Mode'}
                </div>
                <div className="col-span-1 flex gap-x-2">
                  <div>{getMode()}</div>
                  {!data?.schedule.is_holiday &&
                    dayjs(
                      `${data?.schedule.end_date}T${data?.schedule.end_time}`,
                    ).isBefore(new Date()) && (
                      <div className="flex max-w-fit items-center gap-x-2 px-[19px] py-[4.5px]">
                        <SappIcon icon={'warningIcon'}></SappIcon>
                        <div className="font-medium text-[#F01919]">
                          Overdue
                        </div>
                      </div>
                    )}
                </div>
                {renderTime}
                {!data?.schedule.is_holiday && (
                  <>
                    <div className="col-span-1 text-[#A1A1A1]">
                      Key Content Before
                    </div>
                    <div className="col-span-1 flex flex-wrap gap-2">
                      {getKeyContent()}
                    </div>
                  </>
                )}
                {data?.is_test && (
                  <>
                    <div className="col-span-1 text-[#A1A1A1]">Test Name</div>
                    <div className="col-span-1 break-words">{data?.name}</div>
                  </>
                )}
                {data?.mode === 'OFFLINE' && (
                  <>
                    <div className="col-span-1 text-[#A1A1A1]">Classroom</div>
                    <div className="col-span-1 break-words">
                      {data?.room?.name}
                    </div>
                    <div className="col-span-1 text-[#A1A1A1]">
                      Classroom Address
                    </div>
                    <div className="col-span-1 break-words">
                      {data?.room?.address}
                    </div>
                  </>
                )}
                {data?.mode &&
                  ['ONLINE', 'LIVE_ONLIVE'].includes(data?.mode) && (
                    <>
                      <div className="col-span-1 text-[#A1A1A1]">
                        Link meeting
                      </div>
                      <div className="col-span-1">
                        {data?.class?.link_meeting}
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        </div>
        {!(
          data?.is_test ||
          data?.is_case_study ||
          data?.schedule?.is_holiday
        ) && (
          <div className="mt-[16px] border border-solid border-[#F1F1F1] px-[28px] py-[16px]">
            <div className="flex items-center justify-between border-b-[1px] pb-[16px] text-base font-semibold text-[#404041]">
              <div>Course Content</div>
              <div
                className="hover:cursor-pointer"
                onClick={() => togglePopup('bottom')}
              >
                {collapse.bottom ? (
                  <SappIcon icon="arrowDown" />
                ) : (
                  <SappIcon icon="arrowUp" />
                )}
              </div>
            </div>
            {collapse.bottom && (
              <div className="pt-[16px]">
                <CourseTree data={data?.sections ?? []} />
              </div>
            )}
          </div>
        )}
      </div>
    </SappDrawer>
  )
}

export default DetailCalendar
