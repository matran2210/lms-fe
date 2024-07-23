import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { getTimeFromInput, truncateString } from '@utils/index'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import useSelectedSectionCombo from 'src/hooks/useSelectSection'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'

interface Iprops {
  courseId: string
}

const ResultsTable = ({ courseId }: Iprops) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  // const { sections } = useSelectedSectionCombo(router.query.courseId)

  /**
   * @description config params khi filter
   */
  const params = {
    parentId: router.query.parentId || undefined,
  }

  /**
   * @description sử dụng react-query để lấy data
   */
  const {
    data: resultData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [CourseKey.resultsList, currentPage, pageSize],
    queryFn: () => {
      return CoursesAPI.getCourseResults(
        courseId,
        currentPage || 1,
        pageSize,
        params,
      )
    },
    enabled: router.query.courseId !== undefined,
    select: (data) => {
      return data.data
    },
  })

  const commonDataCellStyle = 'text-start py-5'
  const commonHeaderCellStyle =
    'text-left text-medium-sm text-gray-1 font-semibold pb-3'
  const headers = [
    'Name',
    'Belong To',
    'Type',
    'Grade',
    'Time Spent',
    'Last submission',
  ].map((label) => ({ label, className: commonHeaderCellStyle }))

  isLoading && <></>

  const DEFAULT_SELECT_SECTION = [{ label: 'All Section', value: '' }]

  return (
    <>
      <div className="flex gap-6 mb-8">
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Section"
          isClearable={true}
          // value={selectedSection}
          // onChange={(selectedOption) =>
          //   handleDropdownChange(
          //     selectedOption,
          //     setSelectedSection,
          //     setSelectedSubsection,
          //   )
          // }
          // options={
          //   sections &&
          //   DEFAULT_SELECT_SECTION.concat(
          //     sections?.map((section) => ({
          //       label: section.name,
          //       value: section.id,
          //     })),
          //   )
          // }
          // onMenuScrollToBottom={handleMenuScrollToSections}
        />
      </div>
      <SappTable
        headers={headers}
        hasCheck={false}
        isCheckedAll={false}
        classTable="table-auto w-full"
      >
        {isSuccess &&
          resultData.data?.map((row: any, index: number) => {
            const lastSubmission = dayjs(row?.last_submit_time).format(
              'DD/MM/YYYY hh:mm',
            )

            return (
              <tr
                className={clsx({
                  'border-dashed border-b border-gray-2 h-auto': true,
                  'text-gray-2': !row.is_studied,
                })}
                key={row?.id}
              >
                {/* Name */}
                <td className={clsx(commonDataCellStyle)}>
                  {truncateString(row?.name, 35)}
                </td>

                {/* Belong to */}
                <td className={clsx(commonDataCellStyle)}>{row.path}</td>

                {/* Type */}
                <td className={clsx(commonDataCellStyle)}>
                  {row?.course_section_type.toLowerCase()}
                </td>

                {/* Grade */}
                <td className={clsx(commonDataCellStyle)}>
                  {row.score_percentage}
                </td>

                {/* Time Spent */}
                <td className={clsx(commonDataCellStyle)}>
                  {row.total_attempt_time
                    ? getTimeFromInput(row.total_attempt_time)
                    : '-'}
                </td>

                {/* Last Submission */}
                <td className={clsx(commonDataCellStyle)}>{lastSubmission}</td>
              </tr>
            )
          })}
      </SappTable>
      <PaginationSAPP
        currentPage={resultData?.metadata?.page_index}
        pageSize={resultData?.metadata?.page_size}
        totalItems={resultData?.metadata?.total_records}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        type={'table'}
        classname="mt-3"
      />
    </>
  )
}

export default ResultsTable
