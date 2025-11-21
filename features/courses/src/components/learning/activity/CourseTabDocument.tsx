import { ArrowLeft, ArrowRight, PaginationDotIcon } from '@lms/assets'
import {
  courseActivityReducer,
  getCourseActivityTapById,
  useAppDispatch, useAppSelector
} from '@lms/contexts'
import {
  ANIMATION,
  EAttemptStatus,
  GradingPreference,
  IActivity,
  IActivityAPI,
  ICourseActivityAPI,
  ICoursesAPI,
  IFocusQuiz,
  IQuestionAPI,
  IUploadAPI,
  IVideo,
  VideoStateClicked,
} from '@lms/core'
import { useQueryAction } from '@lms/hooks'
import { ActivitySkeleton, HighlightableHTML } from '@lms/ui'
import { trackGAEvent, truncateBySpace } from '@lms/utils'
import { Tabs, Tooltip } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useMemo, useRef } from 'react'
import { Discussion, QuizDocument, VideoDocument } from '../../mycourses'

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
  handleSetCurrentVideo: (video: IVideo) => void
  focusOnlyDiscussion: boolean
  uploadApi: IUploadAPI;
  questionApi: IQuestionAPI;
  courseApi: ICoursesAPI;
  activityApi: IActivityAPI
  courseActivityApi: ICourseActivityAPI
  submitQuizTest: (id: string, data: any, class_user_id?: string | undefined) => Promise<any>
  pageLink: { [key: string]: string}
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
  handleSetCurrentVideo,
  focusOnlyDiscussion,
  uploadApi,
  questionApi,
  courseApi,
  activityApi,
  courseActivityApi,
  submitQuizTest,
  pageLink
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
      dispatch(getCourseActivityTapById({ courseId, id, api: courseApi }))
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tabId: id },
        },
        undefined,
        { shallow: true },
      )
      //   setActiveButtonId(id)
    } catch (error) {}
  }
  const handleRefreshCurrentTab = () => {
    try {
      selector?.currentTabId &&
        delete courseApi.CACHE_GET_TOPIC_DESCRIPTION[selector?.currentTabId]
      dispatch(
        getCourseActivityTapById({
          courseId: courseId as string,
          id: selector?.currentTabId ?? '',
          api: courseApi
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
          <div className="learning-act-tab-label text-sm font-normal capitalize md:text-base">
            <Tooltip
              rootClassName="max-w-md"
              classNames={{ body: '!py-1 !shadow-medium' }}
              title={tab?.name?.split(' ')?.length > 5 ? tab?.name : undefined}
            >
              {truncateBySpace(tab?.name, 5)?.toLowerCase()}
            </Tooltip>
          </div>
        ),
        children: (
          <>
            <div className={clsx({ hidden: focusOnlyDiscussion })}>
              <ActivitySkeleton length={1} loading={selector.loading}>
                <div>
                  <div
                    className={clsx(
                      'tab-content mt-6 flex flex-col gap-4 overflow-x-auto overflow-y-hidden md:gap-6',
                      { '!mt-0': focusOnlyQuiz.open },
                    )}
                  >
                    {course_tab_documents?.map((e, i) => {
                      const gradeStatus = e?.quiz?.attempt?.grading_status
                      const questions = [
                        ...(e?.quiz?.multiple_choice_questions || []),
                        ...(e?.quiz?.constructed_questions || []),
                      ]
                      if (e?.type === 'QUIZ') {
                        const isQuizFinished =
                          e?.quiz?.grading_preference ===
                            GradingPreference.AFTER_ALL_QUESTIONS &&
                          !!e?.quiz?.attempt &&
                          e?.quiz?.attempt?.status === EAttemptStatus.SUBMITTED
                        return (
                          <div
                            key={e?.id + '_' + i + '_' + selector?.currentTabId}
                            ref={quizDocumentRef}
                            className={clsx({
                              hidden:
                                (focusOnlyQuiz.open &&
                                  e?.quiz?.id !== focusOnlyQuiz.id) ||
                                questions?.length === 0,
                            })}
                          >
                            <QuizDocument
                              questions={questions}
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
                              is_limited={
                                course_tab_documents[i]?.quiz?.is_limited ||
                                false
                              }
                              limit_count={
                                course_tab_documents[i]?.quiz?.limit_count || 0
                              }
                              number_of_attempts={
                                course_tab_documents[i]?.quiz?.attempt
                                  ?.number_of_attempts || 0
                              }
                              isQuizFinished={isQuizFinished}
                              uploadApi={uploadApi}
                              questionApi={questionApi}
                              courseApi={courseApi}
                              submitQuizTest={submitQuizTest}
                              pageLink={pageLink}
                            />
                          </div>
                        )
                      }
                      if (e.type === 'TEXT') {
                        return (
                          <div
                            className={clsx(``, {
                              hidden: focusOnlyQuiz.open,
                            })}
                            key={i + '_' + selector?.currentTabId}
                            data-aos={ANIMATION.DATA_AOS}
                          >
                            {e?.text_editor_content && (
                              <HighlightableHTML
                                initialHTML={e?.text_editor_content || ''}
                                storageKey={`${activityId}-${selector?.currentTabId}-${e?.id}-text-editor`}
                                className="course-tab-text"
                              />
                            )}
                            {/* <TextDocument
                            text_editor_content={e?.text_editor_content}
                            className="course-tab-text"
                          ></TextDocument> */}
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
                              handleSetCurrentVideoCallback={
                                handleSetCurrentVideo
                              }
                              uploadAPI={uploadApi}
                              questionApi={questionApi}
                              courseApi={courseApi}
                            ></VideoDocument>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              </ActivitySkeleton>
            </div>
          </>
        ),
      }
    }) ?? []

  if (!selector?.tabs || selector?.tabs?.length === 0) {
    return null
  }

  return (
    <div
      className={clsx('rounded-xl bg-white', {
        'my-6': focusOnlyQuiz.open,
        'flex-1 px-4': focusOnlyDiscussion,
        'p-4 shadow-small md:p-6': !focusOnlyDiscussion,
      })}
    >
      <Tabs
        className={clsx('learning-activity-tabs course-tab', {
          'tabs-list-hidden': focusOnlyQuiz.open,
          hidden: focusOnlyDiscussion,
        })}
        activeKey={selector?.currentTabId}
        items={items}
        onChange={(key: string) => {
          handleChangeTab(courseId as string, key)
          trackGAEvent('Click Button Tab Activity')
        }}
      />
      <div
        className={clsx('mt-4', {
          'block h-full md:hidden': focusOnlyDiscussion,
          hidden: !focusOnlyDiscussion,
        })}
      >
        <Discussion class_id={(router.query.id as string) || ''} activityApi={activityApi} courseApi={courseApi} courseActivityApi={courseActivityApi} />
      </div>
      {selector?.tabs && selector?.tabs?.length > 1 && (
        <div
          className={clsx(
            'learning-act-tab-pagination flex items-center justify-center gap-4 md:gap-8',
            {
              hidden: focusOnlyQuiz.open || focusOnlyDiscussion,
            },
          )}
        >
          <Tooltip title="Previous Tab" trigger={['hover']}>
            <button
              className={clsx('tab-pagination', {
                disabled: !getPreviousTabId(),
              })}
              disabled={!getPreviousTabId()}
              onClick={() => {
                handleChangeTab(courseId as string, getPreviousTabId() || '')
                trackGAEvent('Click Button Previous Tab Activity')
              }}
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
                <PaginationDotIcon className="h-[10px] w-[10px] shrink-0" />
              </span>
            ))}
          </div>
          <Tooltip title="Next Tab" trigger={['hover']}>
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
