const apiURL = process.env.NEXT_PUBLIC_BASE_API_URL!

export { apiURL }
export const listStatusMyClass = [
  {
    label: 'Chưa học',
    value: 'NOT_STARTED',
  },
  {
    label: 'Đang học',
    value: 'IN_PROGRESS',
  },
  {
    label: 'Đã học xong',
    value: 'COMPLETED',
  },
]
