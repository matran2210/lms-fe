import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import StudentCell from '@components/teacher/components/StudentCell'
import { ConfirmIcon } from '@lms/assets'
import { reset } from '@lms/contexts'
import {
  FOUNDATION,
  IOpenChooseItem,
  ISection,
  IStudentClassDetail,
  SectionDropdownFormValues,
  StudentKey,
  backTypeMap,
  getTypeName,
} from '@lms/core'
import { CardResultTest, CollapseActivity } from '@lms/feature-courses'
import { useSappPaging } from '@lms/hooks'
import {
  CarouselSlideAnimation,
  FilterCourseSection,
  ListFilterMobile,
  ListItemFilterMobile,
  NoCoursesAvailable,
  SappBaseTable,
  SappDrawerV3,
  SappModalV3,
  SappTable,
} from '@lms/ui'
import { formatDateFromUTC } from '@lms/utils'
import { TeacherAPI } from '@pages/api/teacher'
import { Avatar, List, Skeleton } from 'antd'
import clsx from 'clsx'
import { isEmpty, round } from 'lodash'
import { useRouter } from 'next/router'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useInfiniteQuery } from 'react-query'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'

const ClassResourceTable = ({
  openFilter,
  setOpenFilter,
}: {
  openFilter: boolean
  setOpenFilter: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const [direction, setDirection] = useState<1 | -1>(1)
  const pageSize = 10
  const studentId = ''
  const params = {}
  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: StudentKey.Student,
      queryFn: () =>
        TeacherAPI.getStudentById(
          studentId,
          pagination.current as number,
          pagination.pageSize as number,
          params,
        ),
      params,
    })

  // Hàm tính toán tiến độ học tập của học viên
  const calculateProgress = (record: IStudentClassDetail): number => {
    // Lấy tổng số phần trong khóa học, nếu không có thì gán mặc định là 0
    const totalSections = record?.learning_progress?.total_course_sections ?? 0

    // Lấy số phần đã hoàn thành trong khóa học, nếu không có thì gán mặc định là 0
    const completedSections =
      record?.learning_progress?.total_course_sections_completed ?? 0

    // Nếu tổng số phần lớn hơn 0, tính tiến độ học tập dưới dạng phần trăm
    return totalSections > 0
      ? // Tính tiến độ (completedSections / totalSections) và nhân với 100 để có phần trăm, sau đó làm tròn kết quả đến 2 chữ số thập phân
        round((completedSections / totalSections) * 100, 2)
      : // Nếu không có phần nào trong khóa học (totalSections = 0), trả về tiến độ là 0%
        0
  }

  const commonHeaderCellStyle =
    'text-left text-base font-medium text-[#6b7280] pb-3 min-w-16 h-14 '

  const headers = [
    {
      label: 'Q#',
      className: clsx(commonHeaderCellStyle),
    },
    {
      label: 'File name',
      className: clsx(commonHeaderCellStyle, 'min-w-28'),
    },
    {
      label: 'Type',
      className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
    },
    {
      label: 'Lesson',
      className: clsx(commonHeaderCellStyle),
    },
    {
      label: 'Location',
      className: clsx(commonHeaderCellStyle, 'text-center'),
    },
  ] as {
    label: string
    className: string
  }[]

  return (
    <div className="mt-6 rounded-2xl  bg-white p-8">
      <SappBaseTable
        headers={headers}
        hasCheck={false}
        isCheckedAll={false}
        classTable="w-full"
        theadClass="sticky top-0 bg-white divide-y divide-[#e5e7eb] border-b border-gray-300"
        tbodyClass="divide-y divide-[#e5e7eb]"
        classTableRes="max-h-96 overflow-y-auto"
      >
        sappbase
      </SappBaseTable>
    </div>
  )
}

export default ClassResourceTable
