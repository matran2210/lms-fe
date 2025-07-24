import React from 'react'
import { Collapse } from 'antd'
import { DetailCourseProps } from 'src/type/courses-3-level'
import { ArrowDownIcon } from '@components/courses/icons'
import SectionItem from './accordion/SectionItem'
import SectionContent from './accordion/SectionContent'
import { TEST_TYPE_ENUM } from '@utils/constants'

const { Panel } = Collapse

export default function CourseAccordion({
  class_user_id,
  data,
}: DetailCourseProps) {
  return (
    <div className="detail-course-3lv space-y-4 py-4 md:py-6">
      <Collapse
        defaultActiveKey={['0']}
        bordered={false}
        expandIcon={({ isActive }) => (
          <ArrowDownIcon
            className={`h-5 w-5 transition-transform ${isActive ? 'rotate-180 text-white' : 'text-bw-15'}`}
          />
        )}
      >
        {data.map((section, i) => (
          <Panel
            key={i}
            header={
              <SectionItem section={section} class_user_id={class_user_id} />
            }
            className={`section-course-3lv ${section.course_section_type !== TEST_TYPE_ENUM.PART ? 'course-test' : ''} ${section?.learning_progress?.total_course_sections_completed === section?.learning_progress?.total_course_sections ? 'course-finished' : ''}`}
          >
            <SectionContent
              class_user_id={class_user_id}
              section={section}
              sectionIndex={i}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  )
}
