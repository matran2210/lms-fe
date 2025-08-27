import React, { useMemo, useState } from 'react'
import { Collapse } from 'antd'
import { IActivity, IAttempt, ISubSectionProps } from 'src/type/courses-3-level'
import { ArrowDownIcon, RestartIcon } from '@components/courses/icons'
import { renderBadge, formatDuration, renderIconActivity } from './utils'
import ButtonIcon from '@components/courses/buttons/ButtonIcon'
import { useRouter } from 'next/router'
import { ROUTES } from 'src/constants'
import TestModal from '@components/courses/popup/TestModal'
import { TEST_TYPE_ENUM } from '@utils/constants'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonText from '@components/base/button/ButtonText'

const { Panel } = Collapse
type DataTestType = {
  id: string
  name: string
  quiz: {
    id: string
    attempt: IAttempt
    quiz_timed: number | null
    is_graded: boolean
    required_percent_score: number
    is_limited: boolean
    limit_count: number
    grading_method: string
  }
}

export default function SubSectionItem({
  sub,
  index,
  sectionIndex,
  class_user_id,
}: ISubSectionProps) {
  const router = useRouter()
  const courseId = router.query.courseId
  const isCollapsible = sub?.course_section_type !== TEST_TYPE_ENUM.TOPIC_TEST
  const totalDuration = formatDuration(
    sub.children.reduce((sum, act) => sum + (act?.duration || 0), 0),
  )
  const [open, setOpen] = useState(false)
  const [dataTest, setDataTest] = useState<DataTestType | undefined>()
  const isSubSectionFinished =
    sub?.learning_progress?.total_course_sections > 0 &&
    sub?.learning_progress?.total_course_sections ===
      sub?.learning_progress?.total_course_sections_completed

  const getActivityStatus = (act: IActivity) => {
    return (
      act?.learning_progress?.total_course_sections > 0 &&
      act?.learning_progress?.total_course_sections ===
        act?.learning_progress?.total_course_sections_completed
    )
  }

  const checkSubTestFinished = useMemo(() => {
    if (sub?.quiz?.attempt) {
      return true
    }
    return false
  }, [sub?.quiz?.attempt])

  return (
    <Collapse
      bordered={false}
      expandIcon={
        isCollapsible
          ? ({ isActive }) => (
              <div className="md:mr-1">
                <ArrowDownIcon
                  className={`h-5 w-5 transition-transform ${isActive ? 'rotate-180' : ''}`}
                />
              </div>
            )
          : () => null
      }
    >
      <Panel
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {sub?.course_section_type === TEST_TYPE_ENUM.CHAPTER && (
                <span className="mb-1 md:hidden">
                  {renderBadge(isSubSectionFinished ? 'Finished' : 'Learning')}
                </span>
              )}
              <div className="mb-1 flex items-center gap-3">
                <span className="text-base font-medium text-bw-15 md:text-lg md:leading-[27px]">
                  {sub?.name}
                </span>
                {sub?.course_section_type === TEST_TYPE_ENUM.TOPIC_TEST && (
                  <span className="hidden text-nowrap text-sm text-gray-1 md:inline-block">
                    {`${sub?.quiz?.quiz_question_instances?.length} Questions`}
                  </span>
                )}
                {!isSubSectionFinished &&
                  sub?.course_section_type === TEST_TYPE_ENUM.CHAPTER && (
                    <span className="hidden text-nowrap text-sm text-gray-1 md:inline-block">
                      {`${sub.activity_count} Activities`}
                    </span>
                  )}
              </div>
              <div className="flex flex-wrap items-center text-sm leading-[22px] text-gray-1">
                {sub?.course_section_type === TEST_TYPE_ENUM.CHAPTER ? (
                  <>Duration: {totalDuration}</>
                ) : (
                  <>Duration: {formatDuration(sub?.quiz?.quiz_timed)}</>
                )}
                {sub?.course_section_type === TEST_TYPE_ENUM.CHAPTER && (
                  <span className="px-3">|</span>
                )}
                <span className="text-sm text-gray-1 md:hidden">
                  {`${sub.activity_count} Activities`}
                </span>
                {sub?.course_section_type === TEST_TYPE_ENUM.TOPIC_TEST ? (
                  checkSubTestFinished ? (
                    <>
                      <span className="px-3">|</span>
                      <span className="hidden md:inline-block">
                        {renderBadge('Finished')}
                      </span>
                    </>
                  ) : null
                ) : (
                  <span className="hidden md:inline-block">
                    {renderBadge(
                      isSubSectionFinished ? 'Finished' : 'Learning',
                    )}
                  </span>
                )}
              </div>
            </div>
            {sub?.course_section_type === TEST_TYPE_ENUM.TOPIC_TEST ? (
              checkSubTestFinished ? (
                <div className="topic_test_action invisible hidden gap-4 md:flex">
                  <ButtonText
                    title="Retake"
                    size="medium"
                    className="text-primary"
                    onClick={() => {
                      setOpen(true)
                      if (sub?.quiz) {
                        setDataTest({
                          id: sub.id,
                          name: sub.name,
                          quiz: {
                            id: sub.quiz.id,
                            attempt: sub.quiz.attempt,
                            quiz_timed: sub.quiz.quiz_timed,
                            is_graded: sub.quiz.is_graded,
                            required_percent_score:
                              sub.quiz.required_percent_score,
                            is_limited: sub.quiz.is_limited,
                            limit_count: sub.quiz.limit_count,
                            grading_method: sub.quiz.grading_method,
                          },
                        })
                      }
                    }}
                  />
                  <ButtonText
                    title="Result"
                    size="medium"
                    className="text-bw-15"
                    onClick={() => {
                      let attempts: IAttempt[] = []
                      const rawAttempt = sub?.quiz?.attempt
                      if (Array.isArray(rawAttempt)) {
                        attempts = rawAttempt
                      } else if (rawAttempt) {
                        attempts = [rawAttempt]
                      }

                      router.push(
                        `/short-course/test-result/${attempts[0]?.id}`,
                      )
                    }}
                  />
                </div>
              ) : (
                <ButtonSecondary
                  title={'Start'}
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (sub?.quiz) {
                      setDataTest({
                        id: sub.id,
                        name: sub.name,
                        quiz: {
                          id: sub.quiz.id,
                          attempt: sub.quiz.attempt,
                          quiz_timed: sub.quiz.quiz_timed,
                          is_graded: sub.quiz.is_graded,
                          required_percent_score:
                            sub.quiz.required_percent_score,
                          is_limited: sub.quiz.is_limited,
                          limit_count: sub.quiz.limit_count,
                          grading_method: sub.quiz.grading_method,
                        },
                      })
                    }
                    setOpen(true)
                  }}
                  className="h-12"
                />
              )
            ) : null}
          </div>
        }
        key={`${sectionIndex}-${index}`}
        className={`subsection-course-3lv ${sub?.course_section_type === TEST_TYPE_ENUM.TOPIC_TEST ? 'topic_test' : ''}`}
      >
        <div className="flex flex-col gap-4 md:gap-2">
          {sub?.children.map((act, k) => {
            const isActivityFinished = getActivityStatus(act)
            return (
              <div
                key={k}
                className="group flex items-center justify-between gap-4 overflow-hidden rounded-lg hover:bg-gray-4 md:px-4 md:py-3"
              >
                <div className="flex gap-2">
                  <div className="w-4.5 shrink-0 md:w-6">
                    {renderIconActivity(
                      act?.course_section_type === TEST_TYPE_ENUM.ACTIVITY
                        ? act?.display_icon
                        : 'TEST',
                    )}
                  </div>
                  <div>
                    <p className="mb-1 flex gap-x-2 text-base font-medium text-bw-15">
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          if (
                            act?.course_section_type === TEST_TYPE_ENUM.ACTIVITY
                          )
                            router.push(
                              ROUTES.ACTIVITY(courseId as string, act?.id),
                            )
                        }}
                      >
                        {act.name}
                      </span>
                      {act?.course_section_type !== TEST_TYPE_ENUM.ACTIVITY && (
                        <span className="hidden text-nowrap text-sm font-normal text-gray-1 md:inline-block">
                          {`${act?.quiz?.quiz_question_instances?.length} Questions`}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2 text-sm text-gray-1 md:gap-3">
                      <span>
                        Duration:{' '}
                        {formatDuration(
                          act?.course_section_type !== TEST_TYPE_ENUM.ACTIVITY
                            ? act?.quiz?.quiz_timed
                            : act?.duration,
                        )}
                      </span>
                      {act?.course_section_type === TEST_TYPE_ENUM.ACTIVITY && (
                        <>
                          <span>|</span>
                          {renderBadge(
                            isActivityFinished ? 'Finished' : 'Learning',
                          )}
                        </>
                      )}
                      {act?.course_section_type !== TEST_TYPE_ENUM.ACTIVITY && (
                        <>
                          <span className="md:hidden">|</span>
                          <span className="inline-block text-nowrap text-sm font-normal text-gray-1 md:hidden">
                            {`${act?.activity_count} Activities`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isActivityFinished &&
                  act?.course_section_type === TEST_TYPE_ENUM.ACTIVITY && (
                    <ButtonIcon
                      title="Study Again"
                      className="invisible hidden text-primary group-hover:visible md:inline-flex"
                      onClick={() => {
                        router.push(
                          ROUTES.ACTIVITY(courseId as string, act?.id),
                        )
                      }}
                    >
                      <RestartIcon />
                    </ButtonIcon>
                  )}
                {act?.course_section_type === TEST_TYPE_ENUM.CHAPTER_TEST ? (
                  isActivityFinished ? (
                    <div className="invisible hidden gap-4 group-hover:visible md:flex">
                      <ButtonText
                        title="Retake"
                        size="medium"
                        className="text-primary"
                        onClick={() => {
                          setOpen(true)
                          if (act?.quiz) {
                            setDataTest({
                              id: act.id,
                              name: act.name,
                              quiz: {
                                id: act.quiz.id,
                                attempt: act.quiz?.attempt?.[0] ?? null,
                                quiz_timed: act.quiz.quiz_timed,
                                is_graded: act.quiz.is_graded,
                                required_percent_score:
                                  act.quiz.required_percent_score,
                                is_limited: act.quiz.is_limited,
                                limit_count: act.quiz.limit_count,
                                grading_method: act.quiz.grading_method,
                              },
                            })
                          }
                        }}
                      />
                      <ButtonText
                        title="Result"
                        size="medium"
                        className="text-bw-15 "
                        onClick={() => {
                          router.push(
                            `/short-course/test-result/${act?.quiz?.attempt[0]?.id}`,
                          )
                        }}
                      />
                    </div>
                  ) : (
                    <ButtonSecondary
                      title={'Start'}
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (act?.quiz) {
                          setDataTest({
                            id: act.id,
                            name: act.name,
                            quiz: {
                              id: act.quiz.id,
                              attempt: act.quiz?.attempt?.[0] ?? null,
                              quiz_timed: act.quiz.quiz_timed,
                              is_graded: act.quiz.is_graded,
                              required_percent_score:
                                act.quiz.required_percent_score,
                              is_limited: act.quiz.is_limited,
                              limit_count: act.quiz.limit_count,
                              grading_method: act.quiz.grading_method,
                            },
                          })
                        }
                        setOpen(true)
                      }}
                      className="h-12"
                    />
                  )
                ) : null}
              </div>
            )
          })}
        </div>
      </Panel>
      <TestModal
        title={dataTest?.name || ''}
        open={open}
        data={dataTest}
        setOpen={() => setOpen(false)}
        class_user_id={class_user_id}
      />
    </Collapse>
  )
}
