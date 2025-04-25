import { Plus } from '@assets/icons'
import SAPPRangePicker from '@components/base/RangePicker/SAPPRangePicker'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SAPPSelect from '@components/base/select/SAPPSelect'
import FilterGrid from '@components/layout/FilterGrid/FilterGrid'
import FormAddProgress from '@components/my-class/progress-form/FormAddProgress'
import FormViewProgress from '@components/my-class/progress-form/FormViewProgress'
import ProgressTable from '@components/my-class/progress-table/ProgressTable'
import { ProgressAPI } from '@pages/api/progress'
import { ProgressKey } from '@pages/api/queryKey'
import { cleanParams } from '@utils/common'
import { OPTIONS_PROGRESS_CLASS } from '@utils/constants/Progress'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IProgressFilterForm } from 'src/type/progress'
import useSappPaging from '../../../hooks/useSappPaging'

interface FilterParams {
  progress?: string
  fromDate?: string
  toDate?: string
}

const initialValues: FilterParams = {
  progress: '',
  fromDate: '',
  toDate: '',
}

const Progress = () => {
  const [isOpenAddModal, setOpenAddModal] = useState(false)
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [idProgress, setIdProgress] = useState<string | null>(null)
  const [isView, setIsView] = useState<boolean>(false)
  const [params, setParams] = useState<FilterParams>(initialValues)
  const router = useRouter()
  const { id } = router.query
  const { control, getValues, reset } = useForm<IProgressFilterForm>()

  const getValuesFilter = () => ({
    progress: getValues('progress'),
    fromDate: getValues('rangeDate')?.[0]?.toISOString(),
    toDate: getValues('rangeDate')?.[1]?.toISOString(),
  })
  const cleanedParams = cleanParams(getValuesFilter())
  const {
    data,
    pagination,
    isLoading,
    handleChangeParams,
    setPagination,
    other,
  } = useSappPaging({
    uniqueKey: ProgressKey.ProgressList,
    queryFn: () =>
      ProgressAPI.getProgressList({
        page_index: pagination.current ?? 1,
        page_size: pagination.pageSize ?? 10,
        params: { ...cleanedParams, class_id: id },
      }),
    params,
  })

  const handleFilter = () => {
    const cleanedParams = cleanParams(getValuesFilter())
    setParams({ ...cleanedParams })
  }

  const handleResetFilter = () => {
    reset()
    setParams(initialValues)
    handleChangeParams(1, 10)
  }

  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }
  const handleRefetchData = () => {
    other?.refetch()
  }
  return (
    <div className="flex flex-col gap-6 p-8 pt-1">
      <div className="flex flex-col gap-4">
        <FilterGrid>
          <SAPPSelect
            name="progress"
            control={control}
            placeholder="Progress"
            options={OPTIONS_PROGRESS_CLASS}
          />
          <SAPPRangePicker name="rangeDate" control={control} />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <ButtonSecondary
              title="Reset"
              color="secondary"
              onClick={handleResetFilter}
              disabled={isLoading}
              size="small"
              className="h-10 rounded-md"
            />
            <ButtonPrimary
              title="Search"
              onClick={handleFilter}
              disabled={isLoading}
              size="small"
              className="h-10 rounded-md"
            />
          </div>
          <div>
            <ButtonPrimary
              title="Add Progress"
              icon={<Plus />}
              onClick={handleOpenAddModal}
              size="small"
              className="flex h-10 items-center rounded-md"
            />
          </div>
        </div>
      </div>

      <ProgressTable
        setIdProgress={setIdProgress}
        setIsView={setIsView}
        loading={isLoading}
        progress={data?.data}
        pagination={pagination}
        setPagination={setPagination}
        setIsEdit={setIsOpenViewModal}
        setIsInspect={setIsOpenViewModal}
        handleChangeParams={handleChangeParams}
      />
      {isOpenAddModal ? (
        <FormAddProgress
          refresh={handleRefetchData}
          open={isOpenAddModal}
          setOpen={setOpenAddModal}
        />
      ) : null}
      {isOpenViewModal ? (
        <FormViewProgress
          isView={isView}
          id={idProgress}
          open={isOpenViewModal}
          setOpen={setIsOpenViewModal}
          refresh={handleRefetchData}
        />
      ) : null}
    </div>
  )
}

export default Progress
