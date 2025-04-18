import { Plus } from '@assets/icons'

import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import SAPPInput from '@components/base/Input/SAPPInput'
import SAPPRangePicker from '@components/base/RangePicker/SAPPRangePicker'
import SAPPSelect from '@components/base/select/SAPPSelect'
import FilterGrid from '@components/layout/FilterGrid/FilterGrid'
import { useRequestContext } from '@contexts/RequestContext'
import { RequestAPI } from '@pages/api/request'
import { cleanParams } from '@utils/common'
import { TablePaginationConfig } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  OPTIONS_PERSONAL_SCHEDULE_REQUEST_TYPE,
  OPTIONS_REQUEST_STATUS,
  REQUEST_TYPE,
} from 'src/constants/request'
import { IRequest, IRequestFilterForm } from 'src/type'
import FormRequest from '../request-forms/FormRequest'
import RequestDetail from '../request-forms/RequestDetail'
import PersonalScheduleTable from '../request-tables/PersonalScheduleTable'

const PersonalScheduleTab = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState<IRequest[]>([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    defaultCurrent: 1,
    defaultPageSize: 10,
    showSizeChanger: true,
  })
  const {
    setOpenAddModal,
    isOpenAddModal,
    setIsOpenViewModal,
    isOpenViewModal,
    isReFetch,
    setIsReFetch,
  } = useRequestContext()
  const router = useRouter()

  const { control, getValues, reset } = useForm<IRequestFilterForm>()

  const getValuesFilter = () => ({
    request_name: getValues('request_name')?.trim(),
    type: getValues('type'),
    status: getValues('status'),
    from_date: getValues('rangeDate')?.[0]?.startOf('day')?.toISOString(),
    to_date: getValues('rangeDate')?.[1]
      ?.add(1, 'day')
      .startOf('day')
      ?.toISOString(),
  })

  const getParams = () => ({
    request_name: router.query?.request_name,
    type: router.query?.type,
    status: router.query?.status,
    from_date: router.query?.from_date,
    to_date: router.query?.to_date,
  })

  const fetchRequests = async (
    page_index: number,
    page_size: number,
    otherParams: Record<string, any> = {},
  ) => {
    otherParams['type'] = otherParams['type']
      ? [otherParams['type']]
      : [REQUEST_TYPE.TEACHER_SCHEDULE_BUSY, REQUEST_TYPE.TEACHER_WEEKLY_NORMS]

    setIsLoading(true)
    try {
      const res = await RequestAPI.getRequests({
        page_index,
        page_size,
        otherParams,
      })

      if (res.success) {
        const data = res.data
        setRequests(data.results)
        setPagination({
          ...pagination,
          current: data.meta_data.page_index,
          pageSize: data.meta_data.page_size,
          total: data.meta_data.total_records,
        })
      }
    } catch (error) {
      // Handled by axios interceptor
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cleanedParams = !isFirstLoad ? cleanParams(getParams()) : {} // Refetch params in first load
    handleChangeParams(cleanedParams)
    fetchRequests(
      pagination?.current || 1,
      pagination?.pageSize || 10,
      cleanedParams,
    )

    isFirstLoad && setIsFirstLoad(false)
    isReFetch && setIsReFetch(false)
  }, [pagination.current, pagination.pageSize, isReFetch])

  const handleChangeParams = (params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString()

    router.replace(`?${queryString}`)
  }

  const handleFilter = () => {
    const cleanedParams = cleanParams(getValuesFilter())
    handleChangeParams(cleanedParams)
    fetchRequests(1, 10, cleanedParams)
  }

  const handleResetFilter = () => {
    reset()
    router.push('')
    fetchRequests(1, 10)
  }

  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }
  return (
    <div className="flex flex-col gap-6 p-8 pt-1">
      <div className="flex flex-col gap-4">
        <FilterGrid>
          <SAPPInput
            name="request_name"
            control={control}
            placeholder="Search name"
          />

          <SAPPSelect
            name="type"
            control={control}
            placeholder="Request type"
            options={OPTIONS_PERSONAL_SCHEDULE_REQUEST_TYPE}
          />

          <SAPPSelect
            name="status"
            control={control}
            placeholder="Status"
            options={OPTIONS_REQUEST_STATUS}
          />

          <SAPPRangePicker name="rangeDate" control={control} />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <SAPPButtonV2
              title="Reset"
              color="secondary"
              onClick={handleResetFilter}
              disabled={isLoading}
            />
            <SAPPButtonV2
              title="Search"
              onClick={handleFilter}
              disabled={isLoading}
            />
          </div>
          <div>
            <SAPPButtonV2
              title="Create Request"
              className="flex"
              icon={<Plus />}
              onClick={handleOpenAddModal}
            />
          </div>
        </div>
      </div>

      <PersonalScheduleTable
        loading={isLoading}
        requests={requests}
        pagination={pagination}
        setPagination={setPagination}
        setIsEdit={setOpenAddModal}
        setIsInspect={setIsOpenViewModal}
      />
      {isOpenAddModal && (
        <FormRequest
          open={isOpenAddModal}
          setOpen={setOpenAddModal}
          reloadPage={handleFilter}
        />
      )}
      {isOpenViewModal && (
        <RequestDetail
          open={isOpenViewModal}
          setOpen={setIsOpenViewModal}
          setOpenEdit={setOpenAddModal}
          reloadPage={handleFilter}
        />
      )}
    </div>
  )
}

export default PersonalScheduleTab
