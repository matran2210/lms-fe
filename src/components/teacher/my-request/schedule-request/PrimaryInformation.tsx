import { Collapse, CollapseProps } from 'antd'
import React from 'react'
import {
  IScheduleRequestItem,
  ScheduleRequestDetail,
  ScheduleTimeItem,
} from 'src/type/teachers/request-schedule.interface'
import { sappFormatDate } from '@utils/index'
import ScheduleSkeleton from '@components/base/skeleton/ScheduleSkeleton'
import InfoItem from 'src/components/teacher/my-request/schedule-request/InfoItem'

interface IProps {
  dataDetail: ScheduleRequestDetail
  selectedRequest: IScheduleRequestItem
  isLoading: boolean
}
const PrimaryInformation = ({
  dataDetail,
  selectedRequest,
  isLoading,
}: IProps) => {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Thông tin chính',
      classNames: {
        header:
          ' text-black bg-white !rounded-md font-bold !text-base flex flex-row-reverse items-center gap-2',
        body: '',
      },
      children: (
        <div className="flex flex-col gap-5 py-4">
          {/* Class Code */}
          <InfoItem title="Class Code" value={selectedRequest?.class?.code} />
          {/* Program */}
          <InfoItem
            title="Program"
            value={selectedRequest?.subject.course_category?.name}
          />
          {/* Subject */}
          <InfoItem title="Subject" value={selectedRequest?.subject?.code} />
          {/* Construction Mode */}
          <InfoItem
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
                  {(dataDetail.schedules ?? []).map(
                    (item: ScheduleTimeItem, index: number) => (
                      <div
                        key={index}
                      >{`${item.start_time} - ${item.end_time}`}</div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Address */}
          <InfoItem title="Classroom Address" value={''} />
          {/* Start and end date */}
          <InfoItem
            title="Start Date - End Date"
            value={`${sappFormatDate(selectedRequest?.schedule_time.start_date) ?? '-'} - ${sappFormatDate(selectedRequest?.schedule_time.end_date) ?? '-'}`}
          />
          {/* Sent Date */}
          <InfoItem
            title="Sent Date"
            value={sappFormatDate(selectedRequest?.created_at) ?? '-'}
          />
        </div>
      ),
    },
  ]
  return <Collapse defaultActiveKey={['1']} items={items} />
}
export default PrimaryInformation
