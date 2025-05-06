import { Collapse, CollapseProps } from 'antd'
import React from 'react'
import {
  ClassStandardScheduleItem,
  IScheduleRequestItem,
  ScheduleRequestDetail,
} from 'src/type/teachers/request-schedule.interface'
import {
  capitalizeFirstLetter,
  sappFormatDate,
  truncateString,
} from '@utils/index'
import ScheduleSkeleton from '@components/base/skeleton/ScheduleSkeleton'
import PrimaryInfoItem from '@components/teacher/my-request/schedule-request/PrimaryInfoItem'
import { formatTimeOnlyHourMinute } from '@utils/helpers'
import { CONSTRUCTION_MODE } from 'src/constants/my-request'
import { CollapseArrowIcon } from '@assets/icons'
import Link from 'next/link'
interface IProps {
  dataDetail: ScheduleRequestDetail | undefined
  selectedRequest: IScheduleRequestItem
  isLoading: boolean
}
const PrimaryInformation = ({
  dataDetail,
  selectedRequest,
  isLoading,
}: IProps) => {
  const renderDayOfWeek = (dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 0:
      case 7:
        return 'Chủ Nhật'
      case 1:
        return 'Thứ Hai'
      case 2:
        return 'Thứ Ba'
      case 3:
        return 'Thứ Tư'
      case 4:
        return 'Thứ Nam'
      case 5:
        return 'Thứ Sáu'
      case 6:
        return 'Thứ Bảy'
      default:
        return ''
    }
  }

  const isOffline = dataDetail?.mode === CONSTRUCTION_MODE.OFFLINE
  const isOnline = dataDetail?.mode === CONSTRUCTION_MODE.ONLINE
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Primary Information',
      classNames: {
        header:
          '!px-7 text-black bg-white !rounded-md font-bold !text-base flex flex-row-reverse items-center gap-2',
        body: '!px-7 !border-none !py-0',
      },
      children: (
        <div className="">
          <div className="flex flex-col gap-5 border-t border-gray-5  py-4">
            {/* Class Code */}
            <PrimaryInfoItem
              title="Class Code"
              value={selectedRequest?.class?.code}
            />
            {/* Program */}
            <PrimaryInfoItem
              title="Program"
              value={selectedRequest?.subject.course_category?.name}
            />
            {/* Subject */}
            <PrimaryInfoItem
              title="Subject"
              value={selectedRequest?.subject?.code}
            />
            {/* Construction Mode */}
            <PrimaryInfoItem
              title="Construction Mode"
              value={dataDetail?.class?.instruction_mode}
              isLoading={isLoading}
            />
            {/* Schedule */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-12">Schedule</span>
              </div>
              <div className="col-span-2">
                {isLoading ? (
                  <ScheduleSkeleton />
                ) : (
                  <div className="flex items-center gap-8">
                    {(dataDetail?.class?.class_standard_schedules ?? []).map(
                      (item: ClassStandardScheduleItem, index: number) => (
                        <div
                          key={index}
                        >{`${capitalizeFirstLetter(renderDayOfWeek(item.day_of_week))} | ${formatTimeOnlyHourMinute(item.start_time)} - ${formatTimeOnlyHourMinute(item.end_time)}`}</div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Address */}
            {isOffline && (
              <PrimaryInfoItem
                title={'Classroom Address'}
                value={dataDetail?.room?.address}
                isLoading={isLoading}
              />
            )}
            {isOnline && (
              <PrimaryInfoItem
                title={'Link Meeting'}
                value={
                  <div className="w-full truncate overflow-ellipsis ">
                    <Link
                      className="text-wrap"
                      href={dataDetail?.class?.link_meeting ?? ''}
                    >
                      {truncateString(dataDetail?.class?.link_meeting, 100)}
                    </Link>
                  </div>
                }
                isLoading={isLoading}
              />
            )}
            {/* Start and end date */}
            <PrimaryInfoItem
              title="Start Date - End Date"
              value={`${sappFormatDate(selectedRequest?.schedule_time.start_date) ?? '-'} - ${sappFormatDate(selectedRequest?.schedule_time.end_date) ?? '-'}`}
            />
            {/* Sent Date */}
            <PrimaryInfoItem
              title="Sent Date"
              value={sappFormatDate(selectedRequest?.created_at) ?? '-'}
            />
          </div>
        </div>
      ),
    },
  ]
  return (
    <Collapse
      defaultActiveKey={['1']}
      items={items}
      className="sapp-collapse"
      expandIcon={(panelProps) => {
        return panelProps.isActive ? (
          <CollapseArrowIcon selected />
        ) : (
          <CollapseArrowIcon />
        )
      }}
    />
  )
}
export default PrimaryInformation
