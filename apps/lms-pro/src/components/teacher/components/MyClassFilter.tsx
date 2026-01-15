import { SappHookFormSelect } from '@lms/ui'
import { HookFormTextField } from '@lms/ui'
import { TeacherAPI } from 'src/api/teacher'
import { useState } from 'react'
import { Control } from 'react-hook-form'
import { debounce } from '@utils/helpers'
import { isEmpty } from 'lodash'
import { listStatusMyClass } from 'src/constants'

interface MyClassFilterProps {
  control: Control<any>
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
const initialSubjectsValues = {
  subjects: [],
  metadata: { page_index: 0, page_size: 10, total_pages: 0 },
}
const initialCourseValues = {
  course_categories: [],
  metadata: { page_index: 0, page_size: 10, total_pages: 0 },
}
const MyClassFilter: React.FC<MyClassFilterProps> = ({
  control,
  setValue,
  courseCategoryId,
}) => {
  const [subjects, setSubjects] = useState<SubjectResponse>(
    initialSubjectsValues,
  )
  const [courseCategory, setCourseCategory] =
    useState<CourseCategoryResponse>(initialCourseValues)

  const fetchCourseCategory = async (
    page_index: number,
    page_size: number,
    params?: object,
    isSearch: boolean = false,
  ): Promise<void> => {
    try {
      const { data } = await TeacherAPI.getCourseCategory(
        page_index,
        page_size,
        params,
      )
      setCourseCategory((prev) => ({
        course_categories: isSearch
          ? data.course_categories
          : [...prev.course_categories, ...data.course_categories],
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
      courseCategory.metadata.page_size &&
      courseCategory.metadata.total_pages > courseCategory.metadata.page_index
    ) {
      fetchCourseCategory(
        courseCategory.metadata.page_index + 1,
        courseCategory.metadata.page_size,
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
  const debouncedSearchCourse = debounce(
    (text) => fetchCourseCategory(1, 10, { name: text }, true),
    500,
  )
  const debouncedSearchSubject = debounce(
    (text) => fetchSubject(1, 10, { name: text }),
    500,
  )
  const onChangeCourse = (courseCategoryId: { value: string }) => {
    setValue('subject_id', '')
    if (courseCategoryId) {
      fetchSubject(1, 10, { course_category_id: courseCategoryId.value })
    } else {
      setSubjects(initialSubjectsValues)
      fetchCourseCategory(1, 10, {}, true)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
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
          if (isEmpty(courseCategory.course_categories)) {
            fetchCourseCategory(1, 10, {}, true)
          }
        }}
        name="course_category_id"
        isSelectCustom
        placeholder="Program"
        options={courseCategory.course_categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        onSearch={(text) => text && debouncedSearchCourse(text)}
        onChange={(courseCategoryId: { value: string }) =>
          onChangeCourse(courseCategoryId)
        }
        isClearable
        onMenuScrollToBottom={handleScrollCourse}
      />
      <SappHookFormSelect
        control={control}
        name="subject_id"
        isSelectCustom
        placeholder="Subject"
        options={subjects?.subjects?.map((subject) => ({
          label: subject.name,
          value: subject.id,
        }))}
        onSearch={(text) => text && debouncedSearchSubject(text)}
        onChange={(subject_id) => {
          setValue('subject_id', subject_id)
        }}
        onMenuScrollToBottom={handleScrollSubject}
        isClearable
      />
      <SappHookFormSelect
        control={control}
        name="class_teacher_status"
        isSelectCustom
        placeholder="Status"
        options={listStatusMyClass}
      />
    </div>
  )
}

export default MyClassFilter
