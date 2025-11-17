import SappTable from '@components/base/SappTable'
import { TEST_TYPE } from '@lms/core'
import { getTimeFromInput } from '@utils/index'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { QuizActivity } from 'src/type/results'

interface ResultQuizModalProps {
  quizActivities: QuizActivity[]
}

const commonHeaderCellStyle =
  'text-left text-sm font-normal text-[#A1A1A1] pb-3 min-w-16 h-14'
export const commonDataCellStyle = 'col py-5 pr-4 whitespace-nowrap'

const ResultQuizModal = ({ quizActivities }: ResultQuizModalProps) => {
  const headers = [
    {
      label: '#',
      className: clsx(commonHeaderCellStyle),
    },
    {
      label: 'Type',
      className: clsx(commonHeaderCellStyle, 'min-w-28'),
    },
    {
      label: 'Graded Activity',
      className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
    },
    {
      label: 'Status',
      className: clsx(commonHeaderCellStyle),
    },
    {
      label: 'Score',
      className: clsx(commonHeaderCellStyle, 'text-center'),
    },
    {
      label: 'Time Spent',
      className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
    },
    {
      label: 'Last submission',
      className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
    },
  ] as {
    label: string
    className: string
  }[]

  return (
    <SappTable
      headers={headers}
      hasCheck={false}
      isCheckedAll={false}
      classTable="w-full"
      theadClass="sticky top-0 bg-white"
      tbodyClass="divide-y divide-[#e5e7eb]"
      classTableRes="max-h-96 overflow-y-auto mt-4"
    >
      {quizActivities?.map((row, index) => {
        return (
          <tr
            className={clsx({
              'row h-auto border-b border-dashed border-[#DCDDDD]': true,
              'text-[#DCDDDD]': !row?.attempts || row?.attempts.length === 0,
            })}
            key={row?.id}
          >
            {/* Index */}
            <td className={clsx(commonDataCellStyle, 'text-[#A1A1A1]')}>
              {index + 1}
            </td>

            {/* Type */}
            <td
              className={clsx(
                commonDataCellStyle,
                'font-medium text-[#050505]',
              )}
            >
              {TEST_TYPE[row?.quiz_type]}
            </td>

            {/* Graded Activity */}
            <td
              className={clsx(
                commonDataCellStyle,
                'text-center  text-[#050505]',
              )}
            >
              {row?.is_graded ? 'Yes' : 'No'}
            </td>

            {/* Status */}
            <td className={clsx(commonDataCellStyle, ' text-[#050505]')}>
              {row?.attempts.length > 0 ? row?.attempts?.[0]?.status : '-'}
            </td>

            {/* Score */}
            <td
              className={clsx(
                commonDataCellStyle,
                'text-center  text-[#050505]',
              )}
            >
              {row?.attempts[0]?.score ?? '-'}
            </td>

            {/* Time Spent */}
            <td
              className={clsx(
                commonDataCellStyle,
                'text-center text-[#050505]',
              )}
            >
              {getTimeFromInput(row?.attempts[0]?.total_attempt_time)}
            </td>

            {/* Last Submission */}
            <td
              className={clsx('!pr-0', commonDataCellStyle, ' text-[#050505]')}
            >
              {row?.attempts.length > 0
                ? dayjs(row?.attempts[0]?.finished_at).format(
                    'DD/MM/YYYY hh:mm',
                  )
                : '-'}
            </td>
          </tr>
        )
      })}
    </SappTable>
  )
}

export default ResultQuizModal
