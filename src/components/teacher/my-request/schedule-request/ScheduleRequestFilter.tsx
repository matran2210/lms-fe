import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { listStatusMyClass } from 'src/pages/teachers/my-class/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import HookFormDateRangePicker from '@components/base/date-range/HookFormDateRangePicker'
import { StatusRequestSchedule } from '@utils/constants/Teacher'

interface ScheduleRequestFilterProps {
  placeholder?: string
  width?: string
  control: any
  setValue: (name: string, value: string) => void
  courseCategoryId?: { value: string }
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
    label: 'Chờ Duyệt',
    value: StatusRequestSchedule.PENDING,
  },
  {
    label: 'Đồng ý',
    value: StatusRequestSchedule.APPROVED,
  },
  {
    label: 'Từ chối',
    value: StatusRequestSchedule.REJECT,
  },
  {
    label: 'Huỷ',
    value: StatusRequestSchedule.CANCEL,
  },
  // {
  //   label: 'Đã xem',
  //   value: StatusRequestSchedule.VIEWED,
  // },
]
const ScheduleRequestFilter: React.FC<ScheduleRequestFilterProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
  control,
  setValue,
  courseCategoryId,
}) => {
  const [subjectCourse, setSubjectCourse] = useState<CourseCategoryResponse>({
    course_categories: [],
    metadata: { page_index: 0, page_size: 10, total_pages: 0 },
  })

  const fetchSubjectCourse = async (
    page_index: number,
    page_size: number,
    params?: object,
  ) => {
    try {
      const { data } = await TeacherAPI.getCourseCategory(
        page_index,
        page_size,
        params,
      )
      setSubjectCourse((prev) => ({
        course_categories: [
          ...prev.course_categories,
          ...data.course_categories,
        ],
        metadata: data.metadata,
      }))
    } catch (error) {}
  }

  const handleScrollCourse = () => {
    if (
      subjectCourse.metadata.page_size &&
      subjectCourse.metadata.total_pages > subjectCourse.metadata.page_index
    ) {
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
        className="select-single-custom w-full"
        placeholder="Program"
        options={subjectCourse.course_categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        onMenuScrollToBottom={handleScrollCourse}
      />
      <SappHookFormSelect
        control={control}
        name="status"
        required
        className="select-single-custom w-full"
        placeholder="Status"
        options={listStatus}
      />
      <HookFormDateRangePicker
        control={control}
        name="date_range"
        required
        className="sapp-daterange-picker w-full"
      />
    </div>
  )
}

export default ScheduleRequestFilter
