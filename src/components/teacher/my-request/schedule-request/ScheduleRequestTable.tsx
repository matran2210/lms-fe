import React, { useState } from 'react'
import ScheduleRequestFilter from './ScheduleRequestFilter'
import { useForm } from 'react-hook-form'
import TableContainer from './TableContainer'
import LayoutFilter from '@components/layout/Filter'
import SappButtonIcon from '@components/base/button/SappButtonIcon'

interface FilterParams {
  code?: string
  program_id?: string
  status?: string
  date_range?: string
}

const initialValues: FilterParams = {
  code: '',
  program_id: '',
  status: '',
  date_range: '',
}

const ScheduleRequestTable = () => {
  const { control, getValues, reset, setValue, watch } = useForm()
  const [params, setParams] = useState<FilterParams>(initialValues)

  const handleResetFilter = () => {
    reset(initialValues)
    setParams(initialValues)
  }

  const onSubmit = () => {
    const searchParams: FilterParams = {
      code: getValues('search') || undefined,
      program_id: getValues('program_id')?.value || undefined,
      status: getValues('status')?.value || undefined,
      date_range: getValues('date_range') || undefined,
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
          <SappButtonIcon
            className="rounded-md px-5 py-3"
            title="Create Request"
            isBgPrimary
            isTextPrimary
          >
            +
          </SappButtonIcon>
        }
      />

      <TableContainer />
    </div>
  )
}

export default ScheduleRequestTable
