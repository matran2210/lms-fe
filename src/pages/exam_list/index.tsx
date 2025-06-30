import { ColumnsType } from 'antd/es/table'
import SappTable from '@components/table/SappTable'
import Layout from '@components/layout'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { TitleSidebar } from 'src/constants'
import { UserApi } from '@pages/api/user'
import { useMemo, useState } from 'react'
import { IExamInformation } from '@components/profile/ExamInformation/type'
import { useQuery } from 'react-query'
import { UserKey } from '@pages/api/queryKey'
import PaginationSappV2 from '@components/base/pagination/PaginationSappV2'
import { isEmpty } from 'lodash'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { getDuration } from '@utils/index'
import ActionCellV2 from '@components/base/action/ActionCellV2'
import { PencilV2Icon } from '@assets/icons'
import ExaminationInfo from '@components/mycourses/course-detail/ExaminationInfo'

const ExamInformation = () => {
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<IExamInformation>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  /**
   * @description sử dụng react-query để lấy data
   */
  const { data, isLoading, refetch } = useQuery({
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
      width: 250,
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
                <ActionCellV2
                  icon={<PencilV2Icon className="h-4 w-4" />}
                  nameAction="Edit"
                  action={() => {
                    setIsDrawerOpen(true)
                    setCurrentRow(record)
                  }}
                />
              )}
          </>
        )
      },
      fixed: 'right',
    },
  ]

  return (
    <Layout title={TitleSidebar.EXAM_LIST} showSidebar={isAlwaysShowSidebar}>
      <div className="mt-10">
        <div className="text-3xl font-semibold leading-[46px] text-gray-800">
          {TitleSidebar.EXAM_LIST}
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
            loading={isLoading}
            isShowPagination={false}
            className="style-table-v2"
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
      {currentRow && isDrawerOpen && currentRow?.class?.id && (
        <ExaminationInfo
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          classIdProps={currentRow.class.id}
          currentValue={currentRow.examination_subject_id}
          onSuccess={() => {
            refetch()
          }}
          isEditProps
          isExamList
        />
      )}
    </Layout>
  )
}

export default ExamInformation
