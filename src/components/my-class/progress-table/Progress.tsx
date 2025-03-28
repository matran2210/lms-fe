import { Plus } from '@assets/icons'
import SAPPRangePicker from '@components/base/RangePicker/SAPPRangePicker'
import SAPPSelect from '@components/base/select/SAPPSelect'
import FilterGrid from '@components/layout/FilterGrid/FilterGrid'
import { useRequestContext } from '@contexts/RequestContext'
import { cleanParams } from '@utils/common'
import { TablePaginationConfig } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import SAPPButton from '@components/base/button/SappButton'
import RequestDetail from '@components/my-request/RequestDetail'
import ProgressTable from '@components/my-class/progress-table/ProgressTable'
import { IProgress, IProgressFilterForm } from '../../../type/progress'
import { ProgressAPI } from '@pages/api/progress'
import FormAddProgress from '@components/my-class/progress-form/FormAddProgress'
import FormViewProgress from '@components/my-class/progress-form/FormViewProgress'

const Progress = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<IProgress[]>([])
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
  } = useRequestContext()
  const router = useRouter()

  const { control, getValues, reset } = useForm<IProgressFilterForm>()

  const getValuesFilter = () => ({
    progress: getValues('progress'),
    from_date: getValues('rangeDate')?.[0]?.toISOString(),
    to_date: getValues('rangeDate')?.[1]?.toISOString(),
  })

  const getParams = () => ({
    progress: router.query?.progress,
    from_date: router.query?.from_date,
    to_date: router.query?.to_date,
  })

  const fetchRequests = async (
    page_index: number,
    page_size: number,
    otherParams: Record<string, any> = {},
  ) => {
    setIsLoading(true)
    try {
      const res = await ProgressAPI.getProgress({
        page_index,
        page_size,
        otherParams,
      })

      if (res.success) {
        const data = res.data
        setProgress(data.results)
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
  }, [pagination.current, pagination.pageSize])

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
  const handleOpenViewModal = () => {
    setIsOpenViewModal(true)
  }
  return (
    <div className="flex flex-col gap-6 p-8 pt-1">
      <div className="flex flex-col gap-4">
        <FilterGrid>
          <SAPPSelect
            name="progress"
            control={control}
            placeholder="Progress"
            options={[]}
          />
          <SAPPRangePicker name="rangeDate" control={control} />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <SAPPButton
              title="Reset"
              color="secondary"
              onClick={handleResetFilter}
              disabled={isLoading}
            />
            <SAPPButton
              title="Search"
              onClick={handleFilter}
              disabled={isLoading}
            />
          </div>
          <div>
            <SAPPButton
              title="Add Progress"
              className="flex"
              icon={<Plus />}
              onClick={handleOpenAddModal}
            />
          </div>
          <div>
            <SAPPButton
              title="View Progress"
              className="flex"
              icon={<Plus />}
              onClick={handleOpenViewModal}
            />
          </div>
        </div>
      </div>

      <ProgressTable
        loading={isLoading}
        progress={progress}
        pagination={pagination}
        setPagination={setPagination}
        setIsEdit={setOpenAddModal}
        setIsInspect={setIsOpenViewModal}
      />
      {isOpenAddModal ? (
        <FormAddProgress
          open={isOpenAddModal}
          setOpen={setOpenAddModal}
          reloadPage={handleFilter}
        />
      ) : null}
      {isOpenViewModal ? (
        <FormViewProgress
          open={isOpenViewModal}
          setOpen={setIsOpenViewModal}
          reloadPage={handleFilter}
        />
      ) : null}
    </div>
  )
}

export default Progress
