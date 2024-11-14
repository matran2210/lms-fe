import clsx from 'clsx'

// Là essay nên không có điểm
const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3 min-w-28'

const headers = [
  ...['Name', 'Type'].map((label) => ({
    label,
    className: commonHeaderCellStyle,
  })),
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
  {
    label: 'Quizzes/Tests',
    className: commonHeaderCellStyle,
  },
] as {
  label: string
  className: string
}[]

export default headers
