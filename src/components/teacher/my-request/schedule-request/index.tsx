import React, { useState } from 'react'
import ScheduleRequestFilter from 'src/components/teacher/my-request/schedule-request/ScheduleRequestFilter'
import { useForm } from 'react-hook-form'
import TableContainer from 'src/components/teacher/my-request/schedule-request/TableContainer'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import { FilterRequestScheduleParams } from 'src/type/teachers/request-schedule.interface'
import { sappFormatDate } from '@utils/index'
import LayoutFilter from '@components/layout/TeacherFilter'
import ButtonIconSapp from '@components/base/button/ButtonIconSapp'

const initialValues: FilterRequestScheduleParams = {
  search: '',
  course_category_id: '',
  status: '',
  fromDate: '',
  toDate: '',
  dateField: '',
}

const ScheduleRequestTable = () => {
  const { control, getValues, reset, setValue, watch } = useForm()
  const [params, setParams] =
    useState<FilterRequestScheduleParams>(initialValues)

  const handleResetFilter = () => {
    reset(initialValues)
    setParams(initialValues)
  }

  const onSubmit = () => {
    const fromDate = getValues('date_range')?.[0] || undefined
    const toDate = getValues('date_range')?.[1] || undefined
    const searchParams: FilterRequestScheduleParams = {
      search: getValues('search') || undefined,
      course_category_id: getValues('course_category_id')?.value || undefined,
      status: getValues('status')?.value || undefined,
      fromDate: sappFormatDate(fromDate, 'YYYY-MM-DDTHH:mm:ssZ'),
      toDate: sappFormatDate(toDate, 'YYYY-MM-DDTHH:mm:ssZ'),
    }
    setParams(searchParams)
  }
  return (
    <div>
      <LayoutFilter
        className="py-6"
        listFilter={
          <ScheduleRequestFilter control={control} setValue={setValue} />
        }
        loading={false}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
        layoutAction={
          <ButtonIconSapp
            className="rounded-md px-5 py-3"
            title="Create Request"
            variant="primary"
            icon="plus"
            iconColorProps="#fff"
            position="start"
            onClick={() => {}}
          ></ButtonIconSapp>
        }
      />

      <TableContainer params={params} />
    </div>
  )
}

export default ScheduleRequestTable
