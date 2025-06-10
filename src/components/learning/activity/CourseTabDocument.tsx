import { ArrowLeft, ArrowRight, PaginationDotIcon } from '@assets/icons'
import ActivitySkeleton from '@components/base/skeleton/ActivitySkeleton'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import { CoursesAPI } from '@pages/api/courses'
import {
  IFocusQuiz,
  VideoStateClicked,
} from '@pages/courses/[id]/activity/[activityId]'
import { trackGAEvent } from '@utils/google-analytics'
import { truncateBySpace } from '@utils/index'
import { Tabs, Tooltip } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useMemo, useRef } from 'react'
import useQueryAction from 'src/hooks/useQueryAction'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityReducer,
  getCourseActivityTapById,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { IActivity } from 'src/type/course/my-course/Activity'

interface IProps {
  activity: IActivity
  handleOpenScratchPad: (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  exhibitText: string
  videoClicked: VideoStateClicked[]
  setVideoClicked: React.Dispatch<React.SetStateAction<VideoStateClicked[]>>
  isHasQuizGrading: boolean
  isDoneActivity: boolean
  handleFinishedCourseSectionProgress: () => Promise<void>
  focusOnlyQuiz: IFocusQuiz
  setFocusOnlyQuiz: React.Dispatch<React.SetStateAction<IFocusQuiz>>
}
const CourseTabDocument = ({
  activity,
  handleOpenScratchPad,
  exhibitText,
  videoClicked,
  setVideoClicked,
  isHasQuizGrading,
  isDoneActivity,
  handleFinishedCourseSectionProgress,
  focusOnlyQuiz,
  setFocusOnlyQuiz,
}: IProps) => {
  const selector = useAppSelector(courseActivityReducer)
  const quizDocumentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)
  const queryAction = useQueryAction()
  const router = useRouter()
  const courseId = router.query?.id
  const activityId = router.query.activityId
  const dispatch = useAppDispatch()
  /**
   * Giá trị được memoized cho course_tab_documents.
   */
  const course_tab_documents = useMemo(() => {
    return selector?.tabs?.find((e) => e?.id === selector?.currentTabId)
      ?.course_tab_documents
  }, [selector?.tabs])

  const currentIndex = selector?.tabs?.findIndex(
    (tab) => tab?.id === selector?.currentTabId,
  )
  /**
   * Hàm xử lý khi thay đổi tab.
   * @param {string} id - ID của tab.
   */
  const handleChangeTab = (courseId: string, id: string) => {
    try {
      dispatch(getCourseActivityTapById({ courseId, id }))
      //   setActiveButtonId(id)
    } catch (error) {}
  }
  const handleRefreshCurrentTab = () => {
    try {
      selector?.currentTabId &&
        delete CoursesAPI.CACHE_GET_TOPIC_DESCRIPTION[selector?.currentTabId]
      dispatch(
        getCourseActivityTapById({
          courseId: courseId as string,
          id: selector?.currentTabId ?? '',
        }),
      )
      //   setActiveButtonId(selector?.currentTabId)
    } catch (error) {}
  }

  /**
   * Hàm để lấy ID của tab trước đó.
   * @returns {string | undefined} - ID của tab trước đó.
   */
  const getPreviousTabId = () => {
    const previousIndex = (currentIndex || 0) - 1
    return selector?.tabs?.[previousIndex]?.id
  }

  /**
   * Hàm để lấy ID của tab tiếp theo.
   * @returns {string | undefined} - ID của tab tiếp theo.
   */
  const getNextTabId = () => {
    const nextIndex = (currentIndex || 0) + 1
    return selector?.tabs?.[nextIndex]?.id
  }

  const onVideoStart = (file_id: string, course_tab_document_id: string) => {
    if (isHasQuizGrading) {
      return
    }
    if (isDoneActivity) {
      return
    }
    if (!videoClicked.length) {
      return
    }
    const courseTabIndex = videoClicked.findIndex(
      (course_tab) =>
        course_tab?.course_tab_document_id === course_tab_document_id,
    )
    const videoIndex = videoClicked[courseTabIndex].videos.findIndex(
      (video) => video.file_id === file_id,
    )
    videoClicked[courseTabIndex].videos[videoIndex].is_click = true
    // Kiểm tra xem đã đủ điều kiện gọi api processs chưa
    let is_watch_all_video = true
    videoClicked.forEach((course_tab) => {
      if (course_tab.videos.every((video) => !video.is_click)) {
        is_watch_all_video = false
      }
    })
    if (is_watch_all_video) {
      handleFinishedCourseSectionProgress()
    }
    setVideoClicked(videoClicked)
  }
  const refetch = () => {
    queryAction(['activity', activityId, courseId], 'refetch') // Gọi lại query [blogKeys.list(queryParams)] ngay lập tức
  }
  const items =
    selector?.tabs?.map((tab) => {
      return {
        key: tab?.id,
        label: (
          <div className="learning-act-tab-label text-base font-normal capitalize">
            {truncateBySpace(tab?.name, 5)?.toLowerCase()}
          </div>
        ),
        children: (
          <ActivitySkeleton length={1} loading={selector.loading}>
            <div>
              <div>
                <div
                  className={clsx(
                    'tab-content mt-6 flex flex-col gap-6 overflow-x-auto overflow-y-hidden',
                    { '!mt-0': focusOnlyQuiz.open },
                  )}
                >
                  {course_tab_documents?.map((e, i) => {
                    const gradeStatus = e?.quiz?.attempt?.grading_status

                    if (e?.type === 'QUIZ') {
                      return (
                        <div
                          key={e?.id + '_' + i + '_' + selector?.currentTabId}
                          ref={quizDocumentRef}
                          className={clsx({
                            hidden:
                              focusOnlyQuiz.open &&
                              e?.quiz?.id !== focusOnlyQuiz.id,
                          })}
                        >
                          <QuizDocument
                            questions={[
                              ...(e?.quiz?.multiple_choice_questions || []),
                              ...(e?.quiz?.constructed_questions || []),
                            ]}
                            activityId={activity?.id as string}
                            tabId={selector?.currentTabId || ''}
                            quizId={e?.quiz?.id || ''}
                            grading_preference={
                              e.quiz?.grading_preference ||
                              'AFTER_EACH_QUESTION'
                            }
                            document_id={e?.id}
                            is_graded={e?.quiz?.is_graded}
                            setOpenFile={handleOpenScratchPad}
                            class_user_id={activity?.class_user_id}
                            quizSetting={e?.quiz?.quiz_setting}
                            reload={refetch}
                            gradeStatus={gradeStatus}
                            quizName={e?.quiz?.name}
                            grading_method={e?.quiz?.grading_method}
                            refreshTab={() => handleRefreshCurrentTab()}
                            exhibitText={exhibitText}
                            attemptId={e?.quiz?.attempt?.id}
                            focusOnlyQuiz={focusOnlyQuiz}
                            setFocusOnlyQuiz={setFocusOnlyQuiz}
                          />
                        </div>
                      )
                    }
                    if (e.type === 'TEXT') {
                      return (
                        <div
                          className={clsx(`select-none`, {
                            hidden: focusOnlyQuiz.open,
                          })}
                          key={i + '_' + selector?.currentTabId}
                        >
                          <TextDocument
                            text_editor_content={e?.text_editor_content}
                            className="course-tab-text"
                          ></TextDocument>
                        </div>
                      )
                    }
                    if (e.type === 'VIDEO') {
                      return (
                        <div
                          key={i + '_' + selector?.currentTabId}
                          className={clsx({ hidden: focusOnlyQuiz.open })}
                        >
                          <VideoDocument
                            videos={e?.videos}
                            activityId={activity?.id as string}
                            tabId={selector?.currentTabId || ''}
                            streamRefProp={(el: any) =>
                              (videoRef.current[i || 0] = el)
                            }
                            handleProcess={onVideoStart}
                            document_id={e?.id}
                            quizId={e?.quiz?.id || ''}
                            grading_preference={
                              e.quiz?.grading_preference ||
                              'AFTER_EACH_QUESTION'
                            }
                            class_user_id={activity?.class_user_id}
                          ></VideoDocument>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          </ActivitySkeleton>
        ),
      }
    }) ?? []
  return (
    <div
      className={clsx('shadow-learning-activity rounded-xl bg-white p-6', {
        'my-6': focusOnlyQuiz.open,
      })}
    >
      <Tabs
        className={clsx('learning-activity-tabs course-tab', {
          'tabs-list-hidden': focusOnlyQuiz.open,
        })}
        activeKey={selector?.currentTabId}
        items={items}
        onChange={(key: string) => {
          handleChangeTab(courseId as string, key)
          trackGAEvent('Click Button Tab Activity')
        }}
      />
      {selector?.tabs && selector?.tabs?.length > 1 && (
        <div
          className={clsx(
            'learning-act-tab-pagination flex items-center justify-center gap-8',
            {
              hidden: focusOnlyQuiz.open,
            },
          )}
        >
          <Tooltip title="Previous Tab">
            <button
              className={clsx('tab-pagination', {
                disabled: !getPreviousTabId(),
              })}
              disabled={!getPreviousTabId()}
              onClick={() => {
                handleChangeTab(courseId as string, getPreviousTabId() || '')
                trackGAEvent('Click Button Previous Tab Activity')
              }}
              style={{ marginRight: 8 }}
            >
              <ArrowLeft />
            </button>
          </Tooltip>
          <div className="flex items-center justify-between gap-3">
            {selector?.tabs?.map((tab, index) => (
              <span
                key={tab.id}
                className={clsx('cursor-pointer text-[#D9D9D9]', {
                  '!text-primary': index == currentIndex,
                })}
                onClick={() => handleChangeTab(courseId as string, tab.id)}
              >
                <PaginationDotIcon />
              </span>
            ))}
          </div>
          <Tooltip title="Next Tab">
            <button
              className={clsx('tab-pagination', { disabled: !getNextTabId() })}
              disabled={!getNextTabId()}
              onClick={() => {
                handleChangeTab(courseId as string, getNextTabId() || '')
                trackGAEvent('Click Button Previous Tab Activity')
              }}
            >
              <ArrowRight />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export default CourseTabDocument
