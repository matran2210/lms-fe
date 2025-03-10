import { Plus } from '@assets/icons'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SAPPRangePicker from '@components/base/RangePicker/SAPPRangePicker'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import FilterGrid from '@components/layout/FilterGrid/FilterGrid'

import { useRequestContext } from '@contexts/RequestContext'
import { useForm } from 'react-hook-form'
import {
  OPTIONS_REQUEST_STATUS,
  OPTIONS_REQUEST_TYPE,
} from 'src/constants/request'
import { IRequestFilterForm } from 'src/type'
import RequestTable from '../request-tables/PersonalScheduleTable'

const PersonalScheduleTab = () => {
  const { setOpenAddModal } = useRequestContext()

  const { control, reset } = useForm<IRequestFilterForm>()

  const handleFilter = () => {}

  const handleResetFilter = () => {
    reset()
  }

  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-1">
      <div className="flex flex-col gap-4">
        <FilterGrid>
          <HookFormTextField
            name="search"
            control={control}
            placeholder="Search name"
            inputClassName="rounded"
          />

          <SappHookFormSelect
            name="request-type"
            control={control}
            placeholder="Request type"
            options={OPTIONS_REQUEST_TYPE}
          />

          <SappHookFormSelect
            name="request-status"
            control={control}
            placeholder="Status"
            options={OPTIONS_REQUEST_STATUS}
          />

          <SAPPRangePicker name="range-date" control={control} />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <ButtonSecondary title="Reset" onClick={handleResetFilter} />
            <ButtonPrimary title="Search" onClick={handleFilter} />
          </div>
          <div>
            <ButtonPrimary
              title="Create Request"
              className="flex"
              icon={<Plus />}
              onClick={handleOpenAddModal}
            />
          </div>
        </div>
      </div>
      <RequestTable />
    </div>
  )
}

export default PersonalScheduleTab
