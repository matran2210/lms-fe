import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { ISubjectList, IUniversityProgram } from 'src/type/classes'
import { listStatusMyClass } from 'src/pages/teachers/my-class/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
interface MyClassFilterProps {
  placeholder?: string
  width?: string
  control?: any
  setValue?: any
  courseCategoryId?: any
}

const MyClassFilter: React.FC<MyClassFilterProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
  control,
  setValue,
  courseCategoryId,
}) => {
  const [subjects, setSubjects] = useState<any>({})
  const [subjectCourse, setSubjectCourse] = useState<any>({})

  const fetchSubjectCourse = async (
    page_index: number,
    page_size: number,
    params?: Object,
  ) => {
    try {
      const { data } = await TeacherAPI.getCourseCategory(
        page_index,
        page_size,
        params,
      )
      const dataTemp = {
        course_categories: [
          ...(subjectCourse?.course_categories || []),
          ...data?.course_categories,
        ],
        metadata: data?.metadata,
      }
      setSubjectCourse(dataTemp)
    } catch (error) {}
  }
  const fetchSubject = async (
    page_index: number,
    page_size: number,
    params?: Object,
    isScroll?: boolean,
  ) => {
    try {
      const { data } = await TeacherAPI.getSubjects(
        page_index,
        page_size,
        params,
      )
      const dataTemp = {
        subjects: [
          ...(isScroll ? subjects?.subjects || [] : []),
          ...data?.subjects,
        ],
        metadata: data?.meta,
      }
      setSubjects(dataTemp)
    } catch (error) {}
  }
  const handleScrollCourse = () => {
    if (
      subjectCourse?.metadata?.page_size &&
      subjectCourse?.metadata?.total_pages > subjectCourse?.metadata?.page_index
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
      subjects?.metadata?.page_size &&
      subjects?.metadata?.total_pages > subjects?.metadata?.page_index
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
        style={{
          borderRadius: '6px',
          height: 40,
        }}
      />
      <SappHookFormSelect
        control={control}
        onFocus={async () => {
          if (isEmpty(subjectCourse)) {
            fetchSubjectCourse(1, 10, {})
          }
          return
        }}
        // onChange={(e: any) => {
        //   if (e.value) {
        //     fetchSubjectCourse(1, 10, {
        //       params: {
        //         name: e.value,
        //       },
        //     })
        //   }
        // }}
        name="course_category_id"
        required
        className="select-single-custom w-full"
        placeholder="Program"
        options={subjectCourse?.course_categories?.map((category: any) => ({
          label: category?.name,
          value: category?.id,
        }))}
        onChange={(courseCategoryId: any) => {
          setValue('subject_id', '')
          fetchSubject(
            1,
            10,
            {
              course_category_id: courseCategoryId?.value,
            },
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
        options={subjects?.subjects?.map((subject: any) => ({
          label: subject?.name,
          value: subject?.id,
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
