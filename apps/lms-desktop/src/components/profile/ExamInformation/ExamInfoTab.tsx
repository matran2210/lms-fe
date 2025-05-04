import SappButton from '@components/base/button/SappButton'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import LoadingRow from '@components/common/LoadingRow'
import { UserKey } from '@pages/api/queryKey'
import { UserApi } from '@pages/api/user'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React, { SetStateAction, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import TabLayout from '../TabLayout'
import ExamEditDrawer from './ExamEditDrawer'
import ExamInfoActionCell from './ExamInfoActionCell'
import { IExamInformation } from './type'

const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3'
const commonDataCellStyle = 'col text-start py-5 pr-6 whitespace-nowrap'
const headers = [
  'Course',
  'Class Code',
  'Program',
  'Subject',
  'Duration',
  'Scheduled Exam Date',
].map((label) => ({ label, className: commonHeaderCellStyle }))

interface IProp {
  onBack?: (value: SetStateAction<boolean>) => void
}
const ExamInfoTab = ({ onBack }: IProp) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<IExamInformation>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const queryClient = useQueryClient()
  /**
   * @description sử dụng react-query để lấy data
   */
  const { data, isLoading, isFetching, isSuccess, refetch } = useQuery({
    queryKey: [UserKey.ExamList],
    queryFn: () => {
      return UserApi.getExamination(pageIndex || 1, pageSize)
    },
    select: (data) => {
      return data.data.data
    },
    staleTime: 0,
  })

  return (
    <React.Fragment>
      <TabLayout
        title="Exam Information"
        headerButtons={
          <SappButton
            onClick={onBack}
            size="medium"
            title={'Back'}
            color="textUnderline"
            className="block min-w-[120px] pr-0 text-base lg:hidden"
            loading={isLoading || isFetching}
          />
        }
      >
        <div className="relative mx-auto my-0 mb-6 max-w-xxl bg-white px-8 pb-3 pt-8">
          <SappTable
            headers={headers}
            hasCheck={false}
            isCheckedAll={false}
            classTable="w-full"
          >
            {isLoading || isFetching ? (
              <>
                {headers.map((header, i) => (
                  <LoadingRow key={header.label} headers={headers} />
                ))}
              </>
            ) : (
              isSuccess &&
              data?.data?.map((row, index) => {
                return (
                  <tr key={row.id ?? index}>
                    <td className={clsx(commonDataCellStyle)}>
                      <Tooltip
                        title={row.class.course.name ?? '-'}
                        color="white"
                      >
                        <div className="ellipsis-text">
                          {row.class.course.name ?? '-'}
                        </div>
                      </Tooltip>
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      <Tooltip title={row.class.code ?? '-'} color="white">
                        <div className="ellipsis-text">
                          {row.class.code ?? '-'}
                        </div>
                      </Tooltip>
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.class.course.course_categories[0].name ?? '-'}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      <Tooltip
                        title={row.class.course.subject.name ?? '-'}
                        color="white"
                      >
                        <div className="ellipsis-text ">
                          {row.class.course.subject.name ?? '-'}
                        </div>
                      </Tooltip>
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.started_at &&
                        dayjs(row.started_at).format('DD/MM/YYYY')}{' '}
                      -{' '}
                      {row.finished_at &&
                        dayjs(row.finished_at).format('DD/MM/YYYY')}
                    </td>
                    <td className={clsx(commonDataCellStyle, 'min-w-36')}>
                      {row?.examination_subject?.examination?.name ?? '-'}
                    </td>
                    <td
                      className={clsx(
                        commonDataCellStyle,
                        'sticky -right-4 bg-white',
                      )}
                    >
                      {!row?.is_final_examination_subject &&
                        row?.remaining_changes > 0 && (
                          <ExamInfoActionCell>
                            <p
                              className="cursor-pointer rounded-md p-1 pl-2 transition-colors hover:bg-primary-light hover:text-primary"
                              onClick={() => {
                                setIsDrawerOpen(true)
                                setCurrentRow(row)
                              }}
                            >
                              Edit
                            </p>
                          </ExamInfoActionCell>
                        )}
                    </td>
                  </tr>
                )
              })
            )}
          </SappTable>
          <PaginationSAPP
            currentPage={data?.metadata.page_index as number}
            pageSize={data?.metadata?.page_size as number}
            totalItems={data?.metadata?.total_records as number}
            setCurrentPage={setPageIndex}
            setPageSize={setPageSize}
            type={'table'}
            classname="mt-3"
          />
        </div>
      </TabLayout>
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
    </React.Fragment>
  )
}

export default ExamInfoTab
