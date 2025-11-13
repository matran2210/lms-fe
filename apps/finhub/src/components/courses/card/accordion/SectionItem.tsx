import TestModal from '@components/courses/popup/TestModal'
import { TEST_TYPE_ENUM } from '@utils/constants'
import { clearStylesHtml } from '@utils/index'
import { useState } from 'react'
import { ICourseSectionProps } from 'src/type/courses-3-level'
import SectionActionButtons from './SectionActionButtons'
import { renderBadge } from './utils'

export default function SectionItem({
  section,
  class_user_id,
}: ICourseSectionProps) {
  const [open, setOpen] = useState(false)
  const totalActivities = section.subsections.reduce((sum, item) => {
    return sum + item.activity_count
  }, 0)

  const isFinish = section?.user_section_learning_status === 'COMPLETED'

  return (
    <div
      className="flex flex-col justify-between md:flex-row md:items-center"
      // data-aos={ANIMATION.DATA_AOS}
    >
      <div>
        <div
          className={`flex flex-col-reverse gap-2 md:flex-row md:items-center md:gap-3`}
        >
          <span className="text-base font-medium text-bw-15 md:text-xl md:leading-7">
            {section?.name}
          </span>
          <div className="flex items-center gap-3">
            {!isFinish &&
              section?.course_section_type == TEST_TYPE_ENUM.PART && (
                <span className="hidden text-nowrap text-sm text-gray-1 md:inline-block">
                  {totalActivities} Activities
                </span>
              )}
            {section?.course_section_type !== TEST_TYPE_ENUM.PART
              ? section?.user_section_learning_status === 'COMPLETED'
                ? renderBadge('Finished')
                : null
              : renderBadge(isFinish ? 'Finished' : 'Learning')}
          </div>
        </div>
        {section?.course_section_type == TEST_TYPE_ENUM.PART && (
          <span className="mb-2 text-nowrap text-sm text-gray-1 md:hidden">
            {totalActivities} Activities
          </span>
        )}
        {section?.cta_status !== 'Finished' && section?.description && (
          <p
            className="mt-2 line-clamp-3 text-sm text-bw-15 md:line-clamp-1 md:text-base md:text-bw-15"
            dangerouslySetInnerHTML={{
              __html: clearStylesHtml(section?.description),
            }}
          />
        )}
      </div>
      {section?.course_section_type !== TEST_TYPE_ENUM.PART && (
        <div
          className="collapse-button -mr-5 ml-auto flex justify-end pl-4 md:mr-0 md:pl-8"
          onClick={(e) => e.stopPropagation()}
        >
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
        setOpen={setOpen}
        class_user_id={class_user_id}
      />
    </div>
  )
}
