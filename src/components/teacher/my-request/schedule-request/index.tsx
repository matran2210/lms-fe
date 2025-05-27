import LayoutFilter from '@components/layout/TeacherFilter'
import { sappFormatDate } from '@utils/index'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ScheduleRequestFilter from 'src/components/teacher/my-request/schedule-request/ScheduleRequestFilter'
import TableContainer from 'src/components/teacher/my-request/schedule-request/TableContainer'
import { FilterRequestScheduleParams } from 'src/type/teachers/request-schedule.interface'

const ScheduleRequestTable = ({ tabId }: { tabId: number }) => {
  const initialValues: FilterRequestScheduleParams = {
    search: '',
    course_category_id: '',
    status: '',
    fromDate: '',
    toDate: '',
    dateField: '',
    tabId: tabId,
  }
  const { control, getValues, reset } = useForm()
  const [params, setParams] =
    useState<FilterRequestScheduleParams>(initialValues)

  /**
   * Hàm reset bộ lọc.
   * Reset giá trị của bộ lọc về giá trị ban đầu.
   */
  const handleResetFilter = () => {
    /**
     * Reset giá trị của bộ lọc về giá trị ban đầu.
     *
     * @param {object} initialValues - Giá trị ban đầu của bộ lọc.
     */
    reset(initialValues)

    /**
     * Cập nhật tham số của bộ lọc về giá trị ban đầu.
     *
     * @param {object} initialValues - Giá trị ban đầu của bộ lọc.
     */
    setParams(initialValues)
  }
  /**
   * Hàm xử lý khi người dùng submit bộ lọc.
   * Lấy giá trị của các trường bộ lọc và tạo tham số tìm kiếm.
   */
  const onSubmit = () => {
    /**
     * Lấy giá trị của trường date_range.
     *
     * @param {array} date_range - Mảng chứa giá trị của trường date_range.
     */
    const fromDate = getValues('date_range')?.[0] || undefined
    const toDate = getValues('date_range')?.[1] || undefined
    /**
     * Tạo tham số tìm kiếm.
     *
     * @param {object} searchParams - Tham số tìm kiếm.
     * @param {string} searchParams.search - Giá trị của trường tìm kiếm.
     * @param {string} searchParams.course_category_id - ID của khóa học.
     * @param {string} searchParams.status - Trạng thái của yêu cầu lịch trình.
     * @param {string} searchParams.fromDate - Ngày bắt đầu của khoảng thời gian.
     * @param {string} searchParams.toDate - Ngày kết thúc của khoảng thời gian.
     */
    const searchParams: FilterRequestScheduleParams = {
      search: getValues('search') || undefined,
      course_category_id: getValues('course_category_id')?.value || undefined,
      status: getValues('status')?.value || undefined,
      fromDate: sappFormatDate(fromDate, 'YYYY-MM-DDTHH:mm:ssZ'),
      toDate: sappFormatDate(toDate, 'YYYY-MM-DDTHH:mm:ssZ'),
    }
    /**
     * Cập nhật tham số tìm kiếm.
     *
     * @param {object} searchParams - Tham số tìm kiếm.
     */
    setParams(searchParams)
  }
  return (
    <div>
      <LayoutFilter
        className="py-6"
        listFilter={<ScheduleRequestFilter control={control} />}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <TableContainer params={params} />
    </div>
  )
}

export default ScheduleRequestTable
