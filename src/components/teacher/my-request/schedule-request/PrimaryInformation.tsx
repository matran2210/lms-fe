import { Collapse, CollapseProps } from 'antd'
import React from 'react'
import dayjs from 'dayjs'
import {
  IScheduleRequestItem,
  ScheduleRequestDetail,
  ScheduleTimeItem,
} from 'src/type/teachers/request-schedule.interface'
import { sappFormatDate } from '@utils/index'

interface IProps {
  dataDetail: ScheduleRequestDetail
  selectedRequest: IScheduleRequestItem
}
const PrimaryInformation = ({ dataDetail, selectedRequest }: IProps) => {
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Class Code</span>
            </div>
            <div className="col-span-2">{selectedRequest?.class.code}</div>
          </div>
          {/* Program */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Program</span>
            </div>
            <div className="col-span-2">
              {selectedRequest?.subject.course_category.name}
            </div>
          </div>
          {/* Subject */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Subject</span>
            </div>
            <div className="col-span-2">{selectedRequest?.subject.code}</div>
          </div>
          {/* Construction Mode */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Construction Mode</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#025EFF]">{selectedRequest?.type}</span>
            </div>
          </div>
          {/* Schedule */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Schedule</span>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-8">
                {(dataDetail.schedules ?? []).map(
                  (item: ScheduleTimeItem, index: number) => (
                    <div
                      key={index}
                    >{`${item.start_time} - ${item.end_time}`}</div>
                  ),
                )}
              </div>
            </div>
          </div>
          {/* Address */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Classroom Address</span>
            </div>
            <div className="col-span-2">{''}</div>
          </div>
          {/* Start and end date */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">
                Start Date - End Date
              </span>
            </div>
            <div className="col-span-2">
              {`${sappFormatDate(selectedRequest?.schedule_time.start_date) ?? '-'} - ${sappFormatDate(selectedRequest?.schedule_time.end_date) ?? '-'}`}
            </div>
          </div>
          {/* Sent Date */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-[#9CA3AF]">Sent Date</span>
            </div>
            <div className="col-span-2">
              {sappFormatDate(selectedRequest?.created_at)}
            </div>
          </div>
        </div>
      ),
    },
  ]
  return <Collapse defaultActiveKey={['1']} items={items} />
}

export default PrimaryInformation
