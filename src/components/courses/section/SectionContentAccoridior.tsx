import { TEST_TYPE_ENUM } from '@utils/constants'
import { Collapse } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ROUTES } from 'src/constants'
import { SectionContentProps } from 'src/type/courses-3-level'
import {
  formatDuration,
  renderBadge,
  renderIconActivity,
} from '../card/accordion/utils'
import { ArrowDownIcon } from '../icons'
import TestModal from '../popup/TestModal'

const { Panel } = Collapse

export default function SectionContentAccoridior({
  sections,
}: SectionContentProps) {
  const router = useRouter()
  const courseId = router.query.courseId
  const [open, setOpen] = useState(false)
  const [dataTest, setDataTest] = useState<any>(null)

  return (
    <div className="section-content-3lv">
      <Collapse
        defaultActiveKey={['0']}
        accordion
        bordered={false}
        expandIcon={({ isActive }) => (
          <div className="md:mr-1">
            <ArrowDownIcon
              className={`h-5 w-5 transition-transform ${isActive ? 'rotate-180' : ''}`}
            />
          </div>
        )}
        expandIconPosition="end"
      >
        {sections.map((section, index) => {
          const totalDuration = formatDuration(
            section.children.reduce((sum, act) => sum + act?.duration, 0),
          )

          if (!section.children.length) {
            return (
              <Panel
                header={
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      if (
                        section?.course_section_type ==
                        TEST_TYPE_ENUM.TOPIC_TEST
                      ) {
                        setDataTest({
                          id: section.id,
                          name: section.name,
                          quiz: section.quiz,
                        })
                        setOpen(true)
                      }
                    }}
                    className={`flex ${
                      section?.course_section_type == TEST_TYPE_ENUM.TOPIC_TEST
                        ? 'cursor-pointer'
                        : ''
                    } flex-col`}
                  >
                    <span className="font-medium">{section.name}</span>
                    {section?.course_section_type ===
                      TEST_TYPE_ENUM.CHAPTER && (
                      <span className="text-xs md:text-ssm">
                        {section.activity_count} Activities{' '}
                        <span className="text-gray-1 font-normal">
                          ({totalDuration})
                        </span>
                      </span>
                    )}
                  </div>
                }
                key={index}
                className="border-none"
                showArrow={false}
                disabled={true}
              ></Panel>
            )
          }

          return (
            <Panel
              header={
                <span className="flex flex-col">
                  <span className="font-medium">{section.name}</span>
                  <span className="text-xs font-medium md:text-ssm">
                    {section.activity_count} Activities{' '}
                    <span className="text-gray-1 font-normal">
                      ({totalDuration})
                    </span>
                  </span>
                </span>
              }
              key={index}
              className="border-none"
            >
              <div className="flex max-h-[310px] flex-col">
                <div className="mb-2 flex items-center gap-2 text-ssm md:mb-4 md:text-sm md:leading-5.5">
                  <span className="text-gray-1 md:font-medium md:text-bw-15">
                    {section.activity_count} Activities
                  </span>
                  <span className="text-gray-1 md:hidden">|</span>
                  <span className="text-gray-1 md:hidden">{totalDuration}</span>
                  <span className="text-gray-1 hidden md:inline-block">
                    ({totalDuration})
                  </span>
                </div>

                <div className="result-scroll flex-1 overflow-y-auto pr-2">
                  {section.children.map((activity, activityIndex) => {
                    const isActivityFinished =
                      activity?.learning_progress?.total_course_sections ===
                        activity?.learning_progress
                          ?.total_course_sections_completed &&
                      activity?.learning_progress
                        ?.total_course_sections_completed > 0

                    return (
                      <div
                        key={activityIndex}
                        className="group mb-3 flex cursor-pointer flex-col justify-between gap-1 rounded p-0 hover:bg-gray-4 hover:text-primary md:mb-2 md:flex-row md:items-center md:gap-0 md:p-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (activity?.course_section_type === 'ACTIVITY') {
                            router.push(
                              ROUTES.ACTIVITY(courseId as string, activity?.id),
                            )
                          } else {
                            setDataTest({
                              id: activity.id,
                              name: activity.name,
                              quiz: activity.quiz,
                            })
                            setOpen(true)
                          }
                        }}
                      >
                        <div className="flex gap-2 md:items-center">
                          <div className="flex-shrink-0">
                            {renderIconActivity(
                              activity?.course_section_type === 'ACTIVITY'
                                ? activity?.display_icon
                                : 'TEST',
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span
                              className="cursor-pointer text-sm font-medium leading-5.5 md:font-normal"
                              onClick={() => {
                                if (
                                  activity?.course_section_type === 'ACTIVITY'
                                ) {
                                  router.push(
                                    ROUTES.ACTIVITY(
                                      courseId as string,
                                      activity?.id,
                                    ),
                                  )
                                }
                              }}
                            >
                              {activity.name}
                            </span>

                            <div className="text-gray-1 flex gap-3 text-ssm md:hidden">
                              {activity?.course_section_type === 'ACTIVITY' && (
                                <span className="group-hover:text-primary">
                                  Duration: {formatDuration(activity.duration)}
                                </span>
                              )}
                              <span>|</span>
                              {renderBadge(
                                isActivityFinished ? 'Finished' : 'Learning',
                              )}
                            </div>
                          </div>
                        </div>
                        {activity?.course_section_type ==
                          TEST_TYPE_ENUM.ACTIVITY && (
                          <span className="text-gray-1 hidden text-xs group-hover:text-primary md:block">
                            {formatDuration(activity?.duration)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Panel>
          )
        })}
      </Collapse>

      <TestModal
        title={dataTest?.name || ''}
        open={open}
        data={dataTest}
        setOpen={() => setOpen(false)}
      />
    </div>
  )
}
