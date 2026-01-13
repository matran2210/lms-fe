import { CompletedIcon } from '@assets/icons'
import Tooltip from '@components/common/Tooltip'
import { LockClosedIcon } from '@lms/assets'
import { useCourseContext } from '@lms/contexts'
import { ROUTES, TEST_TYPE_ENUM } from '@lms/core'
import { Collapse } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { SectionContentProps } from 'src/type/courses-3-level'
import {
  formatDuration,
  formatDurationMenuActivity,
  renderBadge,
  renderIconActivity,
} from '../card/accordion/utils'
import { ArrowDownIcon } from '../icons'
import TestModal from '../popup/TestModal'
import { useParams, useRouter } from 'next/navigation'

const { Panel } = Collapse

export default function SectionContentAccoridior({
  sections,
  class_user_id,
  // refetch,
}: SectionContentProps) {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId
  const [open, setOpen] = useState(false)
  const [dataTest, setDataTest] = useState<any>(null)
  const [activePanelKey, setActivePanelKey] = useState<string[]>([])
  const { setOpenPopupCTA } = useCourseContext()
  const pluralize = (count: number, singular: string, plural?: string) => {
    return `${count} ${count === 1 ? singular : plural || `${singular}s`}`
  }

  const activeKey = sections.findIndex((section) => {
    if (section.children.length > 0) {
      return section.children.some((child) => child.id === params.id)
    }
    return false
  })

  useEffect(() => {
    if (activeKey >= 0) {
      setActivePanelKey([activeKey.toString()])
    }
  }, [activeKey])

  return (
    <div className="section-content-3lv max-h-[calc(100vh-354px)] overflow-y-auto">
      <Collapse
        activeKey={activePanelKey}
        onChange={(key) => {
          return setActivePanelKey(Array.isArray(key) ? key : [key])
        }}
        accordion
        bordered={false}
        expandIcon={({ isActive }) => (
          <div className="md:mr-1">
            <ArrowDownIcon
              className={clsx('transition-transform', {
                'rotate-180': isActive,
              })}
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
            const isStorySection =
              (section?.course_section_type as any) === TEST_TYPE_ENUM.STORY
            const storyInstances = (section as any)?.quiz?.case_study_story
              ?.instances
            const isFinished =
              section?.learning_progress?.total_course_sections ===
              section?.learning_progress?.total_course_sections_completed

            return (
              <Panel
                header={
                  <div
                    onClick={() => {
                      if (
                        section?.course_section_type ==
                        TEST_TYPE_ENUM.TOPIC_TEST
                      ) {
                        setDataTest(section)
                        setOpen(true)
                      }
                    }}
                    className={`flex w-full items-center justify-between ${
                      section?.course_section_type == TEST_TYPE_ENUM.TOPIC_TEST
                        ? 'cursor-pointer'
                        : ''
                    } select-none flex-row`}
                  >
                    <Tooltip title={section.name}>
                      <span className="line-clamp-1 select-none font-medium">
                        {section.name}
                      </span>
                    </Tooltip>
                    {isFinished && <CompletedIcon className="ml-2 shrink-0" />}
                  </div>
                }
                key={index}
                className="border-none"
                showArrow={Boolean(isStorySection && storyInstances?.length)}
                disabled={!isStorySection}
              >
                {isStorySection && storyInstances?.length ? (
                  <>
                    {storyInstances?.length > 0 && (
                      <div className="mb-2 select-none text-ssm md:mb-2 md:text-sm md:leading-5.5">
                        <div className="select-none text-gray-1 md:font-medium md:text-bw-15">
                          {pluralize(
                            storyInstances?.length,
                            'Case study',
                            'Case studies',
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex flex-col gap-2">
                      {storyInstances.map((instance: any, idx: number) => {
                        const isFinishedCaseStudy =
                          !!instance?.learning_progress
                            ?.total_course_sections &&
                          !!instance?.learning_progress
                            ?.total_course_sections_completed &&
                          instance?.learning_progress?.total_course_sections ===
                            instance?.learning_progress
                              ?.total_course_sections_completed
                        return (
                          <div
                            key={idx}
                            className="group flex items-center justify-between gap-4 overflow-hidden rounded-md hover:bg-gray-4 md:px-2 md:py-2"
                          >
                            <div className="flex gap-2">
                              <div className="flex-shrink-0">
                                {renderIconActivity('TEXT')}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-row gap-1">
                                  <span
                                    className="cursor-pointer text-sm font-medium leading-5.5 md:font-normal"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const quizId = (section as any)?.quiz
                                        ?.id as string
                                      const topicId =
                                        instance?.question_topic_id as String
                                      const caseStudyId = instance?.id as string

                                      const isCompleted = (instance as any)
                                        ?.attempt?.number_of_attempts

                                      const attemptId = instance?.attempt
                                        ?.id as string | undefined

                                      if (isCompleted && attemptId) {
                                        router.push(`/case-study/result/${attemptId}?class_user_id=${class_user_id}&class_id=${params?.courseId}&course_section_id=${params?.id}&is_from_activity=true`)
                                      } else {
                                        router.push(`/case-study/${topicId}?quiz_id=${quizId}&class_user_id=${class_user_id}&caseStudyId=${caseStudyId}&class_id=${params?.courseId}&course_section_id=${params?.id}&is_from_activity=true`)
                                      }
                                    }}
                                  >
                                    <Tooltip
                                      title={instance?.question_topic?.name}
                                    >
                                      <div className="truncate lg:max-w-[200px]">
                                        {instance?.question_topic?.name}
                                      </div>
                                    </Tooltip>
                                  </span>
                                </div>

                                {/* {(instance as any)?.attempt
                                  ?.number_of_attempts > 0 && (
                                    <span>{renderBadge('Finished')}</span>
                                  )} */}
                              </div>
                            </div>
                            {isFinishedCaseStudy && <CompletedIcon />}
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : null}
              </Panel>
            )
          }

          return (
            <Panel
              header={
                <span className="flex select-none flex-col">
                  <Tooltip title={section.name}>
                    <span className="line-clamp-1 font-medium">
                      {section.name}
                    </span>
                  </Tooltip>
                </span>
              }
              key={index}
              className="border-none"
            >
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-2 text-ssm md:mb-4 md:text-sm md:leading-5.5">
                  <span className="select-none text-gray-1 md:font-medium md:text-bw-15">
                    {pluralize(
                      section.activity_count,
                      'Activity',
                      'Activities',
                    )}
                  </span>
                  <span className="select-none text-gray-1 md:hidden">|</span>
                  <span className="select-none text-gray-1 md:hidden">
                    {totalDuration}
                  </span>
                  <span className="hidden select-none text-gray-1 md:inline-block">
                    ({totalDuration})
                  </span>
                </div>

                <div className="result-scroll flex-1 pr-2">
                  {section.children.map((activity, activityIndex) => {
                    const isActivityFinished =
                      activity?.learning_progress?.total_course_sections ===
                        activity?.learning_progress
                          ?.total_course_sections_completed &&
                      activity?.learning_progress
                        ?.total_course_sections_completed > 0

                    const selectedActivity = activity?.id === params.id
                    const isLock =
                      activity?.course_section_link_parents?.[0]
                        ?.is_preview_locked
                    const isShowLock =
                      isLock ||
                      activity?.course_section_link_parents?.[0]
                        ?.is_showing_locked

                    return (
                      <>
                        <div
                          key={activityIndex}
                          className={`group mb-3 flex cursor-pointer flex-col justify-between gap-1 rounded-md p-0 hover:bg-gray-4 md:mb-2 md:flex-row md:items-center md:gap-4 md:p-2 md:hover:text-primary${selectedActivity ? 'bg-gray-4 text-primary' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isLock) {
                              setOpenPopupCTA({
                                lockSection: true,
                                ctaUpgrade: false,
                                thankYou: false,
                                thankYouLater: false,
                              })
                              return
                            }
                            if (activity?.course_section_type === 'ACTIVITY') {
                              router.push(
                                ROUTES.ACTIVITY(
                                  courseId as string,
                                  activity?.id,
                                ),
                              )
                            } else if (
                              (activity?.course_section_type as any) ===
                                TEST_TYPE_ENUM.CHAPTER_TEST ||
                              (activity?.course_section_type as any) ===
                                TEST_TYPE_ENUM.TOPIC_TEST
                            ) {
                              setDataTest(activity)
                              setOpen(true)
                            } else if (
                              (activity?.course_section_type as any) ===
                              TEST_TYPE_ENUM.STORY
                            ) {
                              // STORY: do nothing on parent click; use instance items below
                            }
                          }}
                        >
                          <div className="flex select-none gap-2 md:items-center">
                            <div className="flex-shrink-0">
                              {renderIconActivity(
                                activity?.course_section_type === 'ACTIVITY'
                                  ? activity?.display_icon
                                  : 'TEST',
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Tooltip title={activity.name} placement="top">
                                <span className="line-clamp-1 cursor-pointer text-sm font-medium leading-5.5 md:font-normal">
                                  {activity.name}
                                </span>
                              </Tooltip>

                              <div className="flex gap-3 text-ssm text-gray-1 md:hidden">
                                {activity?.course_section_type ===
                                  'ACTIVITY' && (
                                  <span className="md:group-hover:text-primary">
                                    Duration:{' '}
                                    {formatDurationMenuActivity(
                                      activity.duration,
                                    )}
                                  </span>
                                )}
                                <span>|</span>
                                {renderBadge(
                                  isActivityFinished ? 'Finished' : 'Learning',
                                )}
                              </div>
                            </div>
                          </div>
                          {isShowLock ? (
                            <LockClosedIcon />
                          ) : isActivityFinished ? (
                            <CompletedIcon className="shrink-0" />
                          ) : activity?.course_section_type ==
                            TEST_TYPE_ENUM.ACTIVITY ? (
                            <span className="hidden shrink-0 select-none text-right text-sm text-gray-1 group-hover:text-primary md:block">
                              {formatDurationMenuActivity(activity?.duration)}
                            </span>
                          ) : null}
                        </div>
                        {/* STORY instances should not render inside subsection items */}
                      </>
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
        class_user_id={class_user_id}
      />
    </div>
  )
}
