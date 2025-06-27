import { ColumnsType } from 'antd/es/table'
import SappTable from '@components/table/SappTable'
import Layout from '@components/layout'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { TitleSidebar } from 'src/constants'
import { UserApi } from '@pages/api/user'
import { useState } from 'react'
import { IExamInformation } from '@components/profile/ExamInformation/type'
import { useQuery } from 'react-query'
import { UserKey } from '@pages/api/queryKey'
import PaginationSappV2 from '@components/base/pagination/PaginationSappV2'
import { isEmpty } from 'lodash'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { getDuration } from '@utils/index'
import ExamEditDrawer from '@components/profile/ExamInformation/ExamEditDrawer'
import ExamInfoActionCell from '@components/profile/ExamInformation/ExamInfoActionCell'

const ExamInformation = () => {
  const screens = useTailwindBreakpoint()
  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    screens,
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<IExamInformation>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  /**
   * @description sử dụng react-query để lấy data
   */
  const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
    queryKey: [UserKey.ExamList, pageIndex, pageSize],
    queryFn: () => {
      return UserApi.getExamination(pageIndex || 1, pageSize)
    },
    select: (data) => {
      return data.data.data
    },
    staleTime: 0,
  })

  const textStyle = 'text-base font-medium text-gray-800'

  const columnsValue: ColumnsType<IExamInformation> = [
    {
      title: 'Course',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.class?.course?.name}
          className={textStyle}
        />
      ),
    },
    {
      title: 'Class Code',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.class?.code}
          className={textStyle}
        />
      ),
    },
    {
      title: 'Program',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.class?.course?.course_categories[0].name}
          className={textStyle}
        />
      ),
    },
    {
      title: 'Duration',
      render: (record) => (
        <NameNoActionCell
          dataColumn={getDuration(record?.started_at, record?.finished_at)}
          className={textStyle}
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (record) => {
        return (
          <>
            {!record?.is_final_examination_subject &&
              record?.remaining_changes > 0 && (
                <ExamInfoActionCell>
                  <p
                    className="hover:bg-primary-light cursor-pointer rounded-md p-1 pl-2 transition-colors hover:text-primary"
                    onClick={() => {
                      setIsDrawerOpen(true)
                      setCurrentRow(record)
                    }}
                  >
                    Edit
                  </p>
                </ExamInfoActionCell>
              )}
          </>
        )
      },
      fixed: 'right',
    },
  ]

  return (
    <Layout
      title={TitleSidebar.EXAM_INFORMATION}
      showSidebar={isAlwaysShowSidebar}
    >
      <div className="mt-10">
        <div className="text-3xl font-semibold leading-[46px] text-gray-800">
          {TitleSidebar.EXAM_INFORMATION}
        </div>
        <div className="mt-8">
          <SappTable
            columns={columnsValue}
            data={data?.data ?? []}
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: data?.metadata?.total_records,
            }}
            loading={isLoading || isFetching}
            isShowPagination={false}
          />
          {!isEmpty(data?.data) && (
            <PaginationSappV2
              currentPage={data?.metadata?.page_index || 1}
              pageSize={data?.metadata?.page_size || 10}
              totalItems={data?.metadata?.total_records || 0}
              setCurrentPage={setPageIndex}
              setPageSize={setPageSize}
            />
          )}
        </div>
      </div>
      {currentRow && (
        <ExamEditDrawer
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          classId={currentRow.class.id}
          onSuccess={() => {
            refetch()
          }}
          currentValue={currentRow.examination_subject_id}
          remainingChanges={currentRow.remaining_changes}
        />
      )}
    </Layout>
  )
}

export default ExamInformation
