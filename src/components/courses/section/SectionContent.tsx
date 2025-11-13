import React from 'react'
import { SectionContentProps } from 'src/type/courses-3-level'
import SectionContentAccoridior from '@components/courses/section/SectionContentAccoridior'

function SectionContent({
  title = 'Section Content',
  sections,
  class_user_id,
}: SectionContentProps) {

  return (
    <div className="hidden rounded-xl bg-white p-6 shadow-search lg:block">
      <h2 className="mb-4 select-none text-xl font-semibold text-bw-15">
        {title}
      </h2>
      <SectionContentAccoridior
        sections={sections}
        class_user_id={class_user_id}
      />
    </div>
  )
}




export default React.memo(SectionContent)