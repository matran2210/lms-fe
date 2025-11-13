import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { TeacherAPI } from '@pages/api/teacher'
import { useState } from 'react'
import { isEmpty } from 'lodash'
import HookFormDateRangePicker from '@components/base/date-range/HookFormDateRangePicker'
import { StatusRequestSchedule } from '@utils/constants/Teacher'
import { Control, FieldValues } from 'react-hook-form'

interface ScheduleRequestFilterProps {
  control: Control<FieldValues, any>
}

interface Metadata {
  page_index: number
  page_size: number
  total_pages: number
}
interface Subject {
  id: string
  name: string
}

interface CourseCategoryResponse {
  course_categories: Subject[]
  metadata: Metadata
}

const listStatus = [
  {
    label: 'Pending',
    value: StatusRequestSchedule.PENDING,
  },
  {
    label: 'Approved',
    value: StatusRequestSchedule.APPROVED,
  },
  {
    label: 'Rejected',
    value: StatusRequestSchedule.REJECT,
  },
  {
    label: 'Cancel',
    value: StatusRequestSchedule.CANCEL,
  },
]
const ScheduleRequestFilter: React.FC<ScheduleRequestFilterProps> = ({
  control,
}) => {
  const [subjectCourse, setSubjectCourse] = useState<CourseCategoryResponse>({
    course_categories: [],
    metadata: { page_index: 0, page_size: 10, total_pages: 0 },
  })
  /**
   * Hàm lấy dữ liệu khóa học theo chủ đề.
   * Gửi yêu cầu lên server để lấy dữ liệu khóa học theo chủ đề.
   *
   * @param {number} page_index - Chỉ số trang hiện tại.
   * @param {number} page_size - Số lượng khóa học trên mỗi trang.
   * @param {object} [params] - Thông tin tìm kiếm khóa học (không bắt buộc).
   *
   * @returns {Promise<void>} - Hàm trả về một promise không có giá trị trả về.
   */
  const fetchSubjectCourse = async (
    page_index: number,
    page_size: number,
    params?: object,
  ) => {
    try {
      /**
       * Gửi yêu cầu lên server để lấy dữ liệu khóa học theo chủ đề.
       *
       * @param {number} page_index - Chỉ số trang hiện tại.
       * @param {number} page_size - Số lượng khóa học trên mỗi trang.
       * @param {object} [params] - Thông tin tìm kiếm khóa học (không bắt buộc).
       *
       * @returns {Promise<object>} - Hàm trả về một promise chứa dữ liệu khóa học theo chủ đề.
       */
      const { data } = await TeacherAPI.getCourseCategory(
        page_index,
        page_size,
        params,
      )
      /**
       * Cập nhật dữ liệu khóa học theo chủ đề vào state.
       *
       * @param {object} prev - Dữ liệu khóa học theo chủ đề hiện tại.
       * @returns {object} - Dữ liệu khóa học theo chủ đề mới.
       */
      setSubjectCourse((prev) => ({
        course_categories: [
          ...prev.course_categories,
          ...data.course_categories,
        ],
        metadata: data.metadata,
      }))
    } catch (error) {
      // Xử lý lỗi
    }
  }
  /**
   * Hàm xử lý khi người dùng cuộn xuống danh sách khóa học.
   * Kiểm tra xem có thể tải thêm khóa học hay không.
   * Nếu có, sẽ gọi hàm fetchSubjectCourse để tải thêm khóa học.
   */
  const handleScrollCourse = () => {
    /**
     * Kiểm tra xem có thể tải thêm khóa học hay không.
     *
     * @description
     * Kiểm tra xem page_size và total_pages có được định nghĩa hay không.
     * Nếu có, sẽ kiểm tra xem page_index có nhỏ hơn total_pages hay không.
     */
    if (
      subjectCourse.metadata.page_size &&
      subjectCourse.metadata.total_pages > subjectCourse.metadata.page_index
    ) {
      /**
       * Gọi hàm fetchSubjectCourse để tải thêm khóa học.
       *
       * @param {number} page_index - Chỉ số trang hiện tại + 1.
       * @param {number} page_size - Số lượng khóa học trên mỗi trang.
       * @param {object} params - Thông tin tìm kiếm khóa học (không bắt buộc).
       */
      fetchSubjectCourse(
        subjectCourse.metadata.page_index + 1,
        subjectCourse.metadata.page_size,
        {},
      )
    }
  }

  return (
    <div className="flex gap-6">
      <HookFormTextField
        control={control}
        name="search"
        placeholder="Search code"
        inputClassName="placeholder:text-sm placeholder:text-[#99A1B8]"
        style={{ borderRadius: '6px', height: 40 }}
      />
      <SappHookFormSelect
        control={control}
        onFocus={() => {
          if (isEmpty(subjectCourse.course_categories)) {
            fetchSubjectCourse(1, 10, {})
          }
        }}
        name="course_category_id"
        required
        className="w-full"
        placeholder="Program"
        options={subjectCourse.course_categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        onMenuScrollToBottom={handleScrollCourse}
        isClearable
        isSelectCustom
      />
      <SappHookFormSelect
        control={control}
        name="status"
        required
        className="w-full"
        placeholder="Status"
        options={listStatus}
        isClearable
        isSelectCustom
      />
      <HookFormDateRangePicker
        control={control}
        name="date_range"
        className="sapp-daterange-picker h-10 w-full"
      />
    </div>
  )
}

export default ScheduleRequestFilter
