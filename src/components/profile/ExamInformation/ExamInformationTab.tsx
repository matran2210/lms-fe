import ActionCell from '@components/base/action/ActionCell'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import LoadingRow from '@components/common/LoadingRow'
import { UserKey } from '@pages/api/queryKey'
import { UserApi } from '@pages/api/user'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import TabLayout from '../TabLayout'
import dayjs from 'dayjs'
import ExamEditDrawer from './ExamEditDrawer'
import { Daum } from './type'

const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3'
const commonDataCellStyle = 'col text-start py-5 pr-4 whitespace-nowrap'
const headers = [
  'Course',
  'Class Code',
  'Program',
  'Subject',
  'Duration',
  'Scheduled Exam Date',
].map((label) => ({ label, className: commonHeaderCellStyle }))

const ExamInformationTab = () => {
  const [openActionRowId, setOpenActionRowId] = useState<string | null>(null) // Track open state by row ID
  const [actionOpen, setActionOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<Daum>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  /**
   * @description sử dụng react-query để lấy data
   */
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    // Fetch lại data khi filter thay đổi
    queryKey: [UserKey.ExamList],
    queryFn: () => {
      return UserApi.getExamination(pageIndex || 1, pageSize)
    },
    select: (data) => {
      return data.data.data
    },
    retry: false,
  })

  return (
    <React.Fragment>
      <TabLayout
        title="Exam Information"
        headerButtons={<div className="flex items-center"></div>}
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
              data?.data?.map((row) => {
                return (
                  <tr key={row.id}>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.class.course.name ?? '-'}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.class.code ?? '-'}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.class.course.course_categories[0].name ?? '-'}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.class.course.subject.name ?? '-'}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.started_at &&
                        dayjs(row.started_at).format('DD/MM/YYYY')}{' '}
                      -{' '}
                      {row.finished_at &&
                        dayjs(row.finished_at).format('DD/MM/YYYY')}
                    </td>
                    <td className={clsx(commonDataCellStyle)}>
                      {row.examination_subject.examination.name ?? '-'}
                    </td>
                    <td
                      className={clsx(
                        commonDataCellStyle,
                        'sticky -right-4 bg-white',
                      )}
                    >
                      <ActionCell
                        open={openActionRowId === row.id} // Only open if this row ID matches openActionRowId
                        setOpen={(isOpen) =>
                          setOpenActionRowId(isOpen ? row.id : null)
                        } // Toggle by row ID
                        customWidth="w-[150px] top-0"
                      >
                        <div className="py-3">
                          <p
                            className="cursor-pointer rounded-md p-2 text-action transition-all hover:bg-primary-light hover:text-primary"
                            onClick={(e) => {
                              setCurrentRow(row)
                              setIsDrawerOpen(true)
                            }}
                          >
                            Edit
                          </p>
                        </div>
                      </ActionCell>
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
          data={currentRow}
        />
      )}
    </React.Fragment>
  )
}

export default ExamInformationTab
