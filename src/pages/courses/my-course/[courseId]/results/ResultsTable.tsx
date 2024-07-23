import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { getTimeFromInput, truncateString } from '@utils/index'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { CoursesAPI } from 'src/pages/api/courses'

interface Iprops {
  courseId: string
}

const ResultsTable = ({ courseId }: Iprops) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const router = useRouter()

  /**
   * @description config params khi filter
   */
  const params = {
    parentId: router.query.parentId || undefined,
  }

  /**
   * @description fetch API course result
   */
  const fetchCourseResults = async ({
    pageIndex,
    params,
  }: {
    pageIndex: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseResults(
      courseId,
      pageIndex || 1,
      pageSize,
      params,
    )
    return data
  }

  /**
   * @description sử dụng react-query để lấy data sau khi call API
   */
  const {
    data: resultData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['courseResults', currentPage, pageSize],
    queryFn: () => {
      return fetchCourseResults({ pageIndex: currentPage, params })
    },
    enabled: router.query.courseId !== undefined,
  })

  const headers = [
    {
      label: 'Name',
      className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
    },
    {
      label: 'Belong To',
      className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
    },
    {
      label: 'Type',
      className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
    },
    {
      label: 'Grade',
      className: 'text-center pb-3 text-medium-sm text-gray-1 font-semibold',
    },
    {
      label: 'Time Spent',
      className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
    },
    {
      label: 'Last submission',
      className: 'text-left pb-3 text-medium-sm text-gray-1 font-semibold',
    },
  ]

  isLoading && <></>

  // const [activity, setActivity] = useState<any>(null)
  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' },
  // ]

  const commonDataCellStyle = 'px-0 pr-4 text-start py-5'
  return (
    <>
      {/* <div className="flex gap-6 mb-8">
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Section"
          isClearable={true}
          value={activity}
          onChange={(selectedOption) => setActivity(selectedOption)}
          options={options}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Subsection"
          isClearable={true}
          value={activity}
          onChange={(selectedOption) => setActivity(selectedOption)}
          options={options}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Unit"
          isClearable={true}
          value={activity}
          onChange={(selectedOption) => setActivity(selectedOption)}
          options={options}
        />
        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Activity"
          isClearable={true}
          value={activity}
          onChange={(selectedOption) => setActivity(selectedOption)}
          options={options}
        />
      </div> */}
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
                  'border-dashed border-b border-gray-2 px-5 h-12': true,
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
