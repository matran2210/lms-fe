import { CollapseArrowIcon } from '@lms/assets'
import {
  ClassStandardScheduleItem,
  CONSTRUCTION_MODE,
  PROGRAM,
  TYPE_TEACHING_REQUEST,
} from '@lms/core'
import { ScheduleSkeleton, TooltipParagraph } from '@lms/ui'
import { Collapse, CollapseProps } from 'antd'
import Link from 'next/link'
import {
  IScheduleRequestItem,
  ScheduleRequestDetail,
} from '../../../../type/teachers/request-schedule.interface'
import {
  capitalizeFirstLetter,
  convertSlugToTitle,
  sappFormatDate,
  truncateString,
} from '@lms/utils'
import PrimaryInfoItem from './PrimaryInfoItem'
import { formatTimeOnlyHourMinute } from '@utils/helpers'

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
    switch (Number(dayOfWeek)) {
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
        return 'Thứ Năm'
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
  const isACCAProgram = selectedRequest?.subject?.course_category?.name === PROGRAM.ACCA
  const courseName = selectedRequest?.subject.name
  const renderStartEndDate = (data: ScheduleRequestDetail | undefined) => {
    // case schedules.length === 0
    if (data?.schedules?.length === 0 || !data?.schedules) {
      return '-- - --'
    }
    // case schedules.length === 1
    if (data?.schedules?.length === 1) {
      return `${sappFormatDate(data?.schedules[0]?.start_date ?? '') ?? '--'} - ${sappFormatDate(data?.schedules[0]?.end_date ?? '') ?? '--'}`
    }
    // case schedules.length > 1
    return `${sappFormatDate(data?.schedules[0]?.start_date ?? '') ?? '--'} - ${sappFormatDate(data?.schedules[data?.schedules.length - 1]?.end_date ?? '') ?? '--'}`
  }
  const renderACCAStartEndDate = (data: IScheduleRequestItem | undefined) => {
    // case schedules.length === 0
    if (!data?.schedule_time) {
      return '-- - --'
    }
    // case schedules.length > 1
    return `${sappFormatDate(data?.schedule_time?.start_date ?? '') ?? '--'} - ${sappFormatDate(data?.schedule_time?.end_date ?? '') ?? '--'}`
  }

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
          <div className="flex flex-col gap-5 border-t border-gray  py-4">
            {/* Class Code */}
            <PrimaryInfoItem
              title="Class Code"
              value={selectedRequest?.class?.code}
            />
            {/* Program */}
            <PrimaryInfoItem
              title="Program"
              value={selectedRequest?.subject?.course_category?.name}
            />
            {/* Subject */}
            <PrimaryInfoItem
              title="Subject"
              value={
                <TooltipParagraph className="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {isACCAProgram ? courseName : `${convertSlugToTitle(selectedRequest?.subject?.code)}_${selectedRequest?.course_section?.name}`}
                </TooltipParagraph>
                // <span className="flex w-full cursor-pointer overflow-hidden whitespace-nowrap">
                //   <Tooltip
                //     placement="topLeft"
                //     className="inline-block w-full overflow-hidden whitespace-nowrap"
                //     title={`${convertSlugToTitle(selectedRequest?.subject?.code)}_${selectedRequest?.course_section?.name}`}
                //   >{`${convertSlugToTitle(selectedRequest?.subject?.code)}_${selectedRequest?.course_section?.name}`}</Tooltip>
                // </span>
              }
            />
            {/* Construction Mode */}
            <PrimaryInfoItem
              title="Construction Mode"
              value={dataDetail?.class?.instruction_mode}
              isLoading={isLoading}
            />
            {/* Schedule */}
            {selectedRequest?.type ===
              TYPE_TEACHING_REQUEST.TEACHER_SECTION && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-accent">Schedule</span>
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
            )}
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
                  <div className="w-full truncate overflow-ellipsis">
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
              value={isACCAProgram ? renderACCAStartEndDate(selectedRequest) : renderStartEndDate(dataDetail)}
              isLoading={isLoading}
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
