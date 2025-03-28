import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { listStatusMyClass } from 'src/pages/teachers/my-class/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useState } from 'react'
import { isEmpty } from 'lodash'

interface MyClassFilterProps {
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

interface SubjectResponse {
  subjects: Subject[]
  metadata: Metadata
}

const MyClassFilter: React.FC<MyClassFilterProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
  control,
  setValue,
  courseCategoryId,
}) => {
  const [subjects, setSubjects] = useState<SubjectResponse>({
    subjects: [],
    metadata: { page_index: 0, page_size: 10, total_pages: 0 },
  })
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

  const fetchSubject = async (
    page_index: number,
    page_size: number,
    params?: object,
    isScroll: boolean = false,
  ) => {
    try {
      const { data } = await TeacherAPI.getSubjects(
        page_index,
        page_size,
        params,
      )
      setSubjects((prev) => ({
        subjects: isScroll
          ? [...prev.subjects, ...data.subjects]
          : data.subjects,
        metadata: data.meta,
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

  const handleScrollSubject = () => {
    if (
      subjects.metadata.page_size &&
      subjects.metadata.total_pages > subjects.metadata.page_index
    ) {
      fetchSubject(
        subjects.metadata.page_index + 1,
        subjects.metadata.page_size,
        { course_category_id: courseCategoryId?.value },
        true,
      )
    }
  }

  return (
    <div className="flex gap-6">
      <HookFormTextField
        control={control}
        name="search"
        placeholder="Search course name"
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
        onChange={(courseCategoryId: { value: string }) => {
          setValue('subject_id', '')
          fetchSubject(
            1,
            10,
            { course_category_id: courseCategoryId.value },
            false,
          )
        }}
        onMenuScrollToBottom={handleScrollCourse}
      />
      <SappHookFormSelect
        control={control}
        name="subject_id"
        required
        className="select-single-custom w-full"
        placeholder="Subject"
        options={subjects.subjects.map((subject) => ({
          label: subject.name,
          value: subject.id,
        }))}
        onMenuScrollToBottom={handleScrollSubject}
      />
      <SappHookFormSelect
        control={control}
        name="class_teacher_status"
        required
        className="select-single-custom w-full"
        placeholder="Status"
        options={listStatusMyClass}
      />
    </div>
  )
}

export default MyClassFilter
