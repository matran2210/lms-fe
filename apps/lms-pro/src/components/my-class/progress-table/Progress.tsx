import FormAddProgress from '@components/my-class/progress-form/FormAddProgress'
import FormViewProgress from '@components/my-class/progress-form/FormViewProgress'
import ProgressTable from '@components/my-class/progress-table/ProgressTable'
import { Plus } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import {
  CONSTRUCTION,
  IClassDetail,
  IProgressFilterForm,
  OPTIONS_PROGRESS_CLASS,
  PROGRAM,
} from '@lms/core'
import { useSappPaging } from '@lms/hooks'
import {
  ButtonPrimary,
  ButtonSecondary,
  FilterGrid,
  SAPPInput,
  SAPPRangePicker,
  SAPPSelect,
} from '@lms/ui'
import { cleanParams } from '@lms/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProgressAPI } from 'src/api/progress'
import { ProgressKey } from 'src/api/queryKey'
interface FilterParams {
  progress?: string
  fromDate?: string
  toDate?: string
  section?: string
}

const initialValues: FilterParams = {
  progress: '',
  section: '',
  fromDate: '',
  toDate: '',
}

const Progress = ({ classDetail }: { classDetail: IClassDetail }) => {
  const [isOpenAddModal, setOpenAddModal] = useState(false)
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [idProgress, setIdProgress] = useState<string | null>(null)
  const [isView, setIsView] = useState<boolean>(false)
  const [params, setParams] = useState<FilterParams>(initialValues)
  const { params: classParams } = useFeature()
  const { params: progressParams } = useFeature()
  const { control, getValues, reset } = useForm<IProgressFilterForm>()
  const allowSection = !classDetail?.course?.course_categories?.some(
    (item) => item?.name === PROGRAM.ACCA || item?.name === PROGRAM.CD,
  )
  const allowCreateProgress =
    classDetail?.course?.course_categories?.some((item) =>
      [PROGRAM.ACCA, PROGRAM.CMA, PROGRAM.CFA, PROGRAM.CD].includes(
        item?.name as PROGRAM,
      ),
    ) &&
    [
      CONSTRUCTION.LIVE_ONLINE,
      CONSTRUCTION.BLENDED,
      CONSTRUCTION.OFFLINE,
    ].includes(classDetail?.instruction_mode as CONSTRUCTION)
  const getValuesFilter = () => ({
    progress: getValues('progress'),
    fromDate: getValues('rangeDate')?.[0]?.toISOString(),
    toDate: getValues('rangeDate')?.[1]?.toISOString(),
    section: getValues('section'),
  })
  const cleanedParams = cleanParams(getValuesFilter())
  const {
    data,
    pagination,
    isLoading,
    handleChangeParams,
    setPagination,
    refetch,
  } = useSappPaging({
    uniqueKey: ProgressKey.ProgressList,
    queryFn: () =>
      ProgressAPI.getProgressList({
        page_index: pagination.current ?? 1,
        page_size: pagination.pageSize ?? 10,
        params: { ...cleanedParams, class_id: classParams?.id },
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
    refetch()
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
            allowClear
          />
          {allowSection && (
            <SAPPInput
              control={control}
              name="section"
              placeholder={'Section'}
            ></SAPPInput>
          )}
          <SAPPRangePicker name="rangeDate" control={control} />
        </FilterGrid>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <ButtonSecondary
              title="Reset"
              onClick={handleResetFilter}
              disabled={isLoading}
              className="h-10"
            />
            <ButtonPrimary
              title="Search"
              onClick={handleFilter}
              disabled={isLoading}
              className="h-10"
            />
          </div>
          {allowCreateProgress && (
            <ButtonPrimary
              title="Add Progress"
              startIcon={<Plus />}
              onClick={handleOpenAddModal}
              size="small"
              className="h-10"
            />
          )}
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
        allowSection={allowSection}
        allowCreateProgress={allowCreateProgress}
      />
      {isOpenAddModal ? (
        <FormAddProgress
          refresh={handleRefetchData}
          open={isOpenAddModal}
          setOpen={setOpenAddModal}
          allowSection={allowSection}
        />
      ) : null}
      {isOpenViewModal ? (
        <FormViewProgress
          isView={isView}
          id={idProgress}
          open={isOpenViewModal}
          setOpen={setIsOpenViewModal}
          refresh={handleRefetchData}
          allowSection={allowSection}
          classId={progressParams?.id as string}
        />
      ) : null}
    </div>
  )
}

export default Progress
