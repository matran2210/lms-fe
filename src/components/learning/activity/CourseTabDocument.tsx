import ActivitySkeleton from '@components/base/skeleton/ActivitySkeleton'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import { CoursesAPI } from '@pages/api/courses'
import { VideoStateClicked } from '@pages/courses/[id]/activity/[activityId]'
import { trackGAEvent } from '@utils/google-analytics'
import { truncateBySpace } from '@utils/index'
import { Tabs } from 'antd'
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
  focusOnlyQuiz: boolean
  setFocusOnlyQuiz: React.Dispatch<React.SetStateAction<boolean>>
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
  const quizDocumentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)
  const queryAction = useQueryAction()
  const router = useRouter()
  const courseId = router.query?.id
  const activityId = router.query.activityId
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  /**
   * Giá trị được memoized cho course_tab_documents.
   */
  const course_tab_documents = useMemo(() => {
    return selector?.tabs?.find((e) => e?.id === selector?.currentTabId)
      ?.course_tab_documents
  }, [selector?.tabs])

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
    const currentIndex = selector?.tabs?.findIndex(
      (tab) => tab?.id === selector?.currentTabId,
    )
    const previousIndex = (currentIndex || 0) - 1
    return selector?.tabs?.[previousIndex]?.id
  }

  /**
   * Hàm để lấy ID của tab tiếp theo.
   * @returns {string | undefined} - ID của tab tiếp theo.
   */
  const getNextTabId = () => {
    const currentIndex = selector?.tabs?.findIndex(
      (tab) => tab?.id === selector?.currentTabId,
    )
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
                    { 'mt-0': focusOnlyQuiz },
                  )}
                >
                  {course_tab_documents?.map((e, i) => {
                    const gradeStatus = e?.quiz?.attempt?.grading_status

                    if (e?.type === 'QUIZ') {
                      return (
                        <div
                          key={e?.id + '_' + i + '_' + selector?.currentTabId}
                          ref={quizDocumentRef}
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
                            hidden: focusOnlyQuiz,
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
                          className={clsx({ hidden: focusOnlyQuiz })}
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

                <div
                  className={clsx('mt-8 flex flex-wrap justify-between gap-5', {
                    hidden: focusOnlyQuiz,
                  })}
                >
                  {getPreviousTabId() && (
                    <div className="w-auto">
                      <div className="relative">
                        <div
                          onClick={() => {
                            handleChangeTab(
                              courseId as string,
                              getPreviousTabId() || '',
                            )
                            trackGAEvent('Click Button Previous Tab Activity')
                          }}
                          className="group relative z-10 mb-2 flex cursor-pointer select-none items-center gap-2 text-base font-semibold text-bw-1 hover:text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="none"
                          >
                            <path
                              className="fill-bw-1 group-hover:fill-primary"
                              fillRule="evenodd"
                              d="M7.707 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 9H17a1 1 0 1 1 0 2H5.414l2.293 2.293a1 1 0 0 1 0 1.414Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Previous Tab
                        </div>
                        <div className="absolute bottom-0 left-0 h-2.5 w-[129px] bg-gray-3"></div>
                      </div>
                    </div>
                  )}
                  {getNextTabId() && (
                    <div className="relative ml-auto w-auto">
                      <div className="relative">
                        <div
                          onClick={() => {
                            handleChangeTab(
                              courseId as string,
                              getNextTabId() || '',
                            )
                            trackGAEvent('Click Button Next Tab Activity')
                          }}
                          className="group relative z-10 mb-2 flex cursor-pointer select-none items-center gap-2 text-right text-base font-semibold text-bw-1 hover:text-primary"
                        >
                          Next Tab
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="none"
                          >
                            <path
                              className="fill-bw-1 group-hover:fill-primary"
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-0 left-0 h-2.5 w-[98px] -translate-x-1 bg-gray-3"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ActivitySkeleton>
        ),
      }
    }) ?? []
  return (
    <div
      className={clsx('rounded-xl bg-white p-6 shadow-learning-activity', {
        'mt-6': focusOnlyQuiz,
      })}
    >
      <Tabs
        className={clsx('learning-activity-tabs', {
          'tabs-list-hidden': focusOnlyQuiz,
        })}
        defaultActiveKey="1"
        items={items}
        onChange={(key: string) => {
          handleChangeTab(courseId as string, key)
          trackGAEvent('Click Button Tab Activity')
        }}
      />
    </div>
  )
}

export default CourseTabDocument
