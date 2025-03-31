import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { listStatusMyClass } from 'src/pages/teachers/my-class/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useState } from 'react'
import { debounce, isEmpty } from 'lodash'

interface MyClassFilterProps {
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
  const [subjectCourse, setSubjectCourse] =
    useState<CourseCategoryResponse>(initialCourseValues)
  const createDebouncedSearch = (
    fetchFunction: (text: string) => void,
    delay = 350,
  ) => debounce((text: string) => fetchFunction(text), delay)
  const fetchSubjectCourse = async (
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
      setSubjectCourse((prev) => ({
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
      subjectCourse.metadata.page_size &&
      subjectCourse.metadata.total_pages > subjectCourse.metadata.page_index
    ) {
      fetchSubjectCourse(
        subjectCourse.metadata.page_index + 1,
        subjectCourse.metadata.page_size,
        {},
        false,
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
  const debouncedSearchCourse = createDebouncedSearch((text) =>
    fetchSubjectCourse(1, 10, { name: text }, true),
  )
  const debouncedSearchSubject = createDebouncedSearch((text) =>
    fetchSubject(1, 10, { name: text }, false),
  )

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
          if (isEmpty(subjectCourse.course_categories)) {
            fetchSubjectCourse(1, 10, {}, true)
          }
        }}
        name="course_category_id"
        isCustom
        placeholder="Program"
        options={subjectCourse.course_categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        onSearch={(text) => {
          if (text) {
            debouncedSearchCourse(text)
          }
        }}
        onChange={(courseCategoryId: { value: string }) => {
          if (courseCategoryId) {
            fetchSubject(
              1,
              10,
              { course_category_id: courseCategoryId.value },
              false,
            )
          } else {
            setSubjects(initialSubjectsValues)
            setValue('subject_id', '')
            fetchSubjectCourse(1, 10, {}, true)
          }
        }}
        isClearable
        onMenuScrollToBottom={handleScrollCourse}
      />
      <SappHookFormSelect
        control={control}
        name="subject_id"
        isCustom
        placeholder="Subject"
        options={subjects?.subjects?.map((subject) => ({
          label: subject.name,
          value: subject.id,
        }))}
        onSearch={(text) => {
          if (text) {
            debouncedSearchSubject(text)
          }
        }}
        onChange={(subjectId: { value: string }) => {
          setValue('subject_id', subjectId ? subjectId.value : '')
        }}
        onMenuScrollToBottom={handleScrollSubject}
        isClearable
      />
      <SappHookFormSelect
        control={control}
        name="class_teacher_status"
        isCustom
        placeholder="Status"
        options={listStatusMyClass}
      />
    </div>
  )
}

export default MyClassFilter
