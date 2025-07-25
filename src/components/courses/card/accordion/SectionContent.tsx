import React, { useState } from 'react'
import { SectionCourseProp } from 'src/type/courses-3-level'
import SubSectionItem from './SubSectionItem'
import SectionAttempts from './SectionAttempts'
import SectionActionButtons from './SectionActionButtons'
import TestModal from '@components/courses/popup/TestModal'
import { TEST_TYPE_ENUM } from '@utils/constants'

export default function SectionContent({
  class_user_id,
  section,
  sectionIndex,
}: SectionCourseProp) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      {section?.subsections?.map((sub, j) => (
        <SubSectionItem
          key={j}
          sub={sub}
          index={j}
          sectionIndex={sectionIndex}
          class_user_id={class_user_id}
        />
      ))}

      {(section.course_section_type === TEST_TYPE_ENUM.MID_TERM_TEST ||
        section.course_section_type === TEST_TYPE_ENUM.FINAL_TEST) && (
        <SectionAttempts class_user_id={class_user_id} section={section} />
      )}

      {section?.course_section_type !== TEST_TYPE_ENUM.PART && (
        <div className="flex items-center justify-end gap-2 md:hidden">
          <SectionActionButtons
            section={section}
            class_user_id={class_user_id}
            setOpenTest={setOpen}
          />
        </div>
      )}
      <TestModal
        title={
          section.course_section_type === TEST_TYPE_ENUM.FINAL_TEST
            ? 'Final Test'
            : 'Mid-Term Test'
        }
        open={open}
        data={section}
        setOpen={() => setOpen(false)}
        class_user_id={class_user_id}
      />
    </div>
  )
}
