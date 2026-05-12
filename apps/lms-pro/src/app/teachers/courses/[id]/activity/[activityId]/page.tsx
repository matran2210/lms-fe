'use client'
import SappLoadingGlobal from '@components/common/SappLoadingGlobal'
import { CloseIcon, DownloadIcon, LinkIcon } from '@lms/assets'
import {
  clearNote,
  closeCalculator,
  courseActivityAction,
  courseActivityReducer,
  getCourseActivityTapById,
  getDiscussion,
  resetQuizActivity,
  showPopupCompletedCourse,
  useCourseContext,
  UserType,
} from '@lms/contexts'
import {
  ANIMATION,
  EXHIBIT_TEXT_REPLACE,
  IActivity,
  ITabs,
  PROGRAM,
  SUFFIX_TYPE,
} from '@lms/core'
import {
  CreateNote,
  Discussion,
  QuizDocument,
  TextDocument,
  VideoDocument,
} from '@lms/feature-courses'
import {
  ActivitySkeleton,
  EditorReader,
  FileViewer,
  LayoutTeacher,
  ModalResizeable,
  SAPPBorder,
  SappButton,
  SappIcon,
  Tooltip,
  CalculatorModal,
} from '@lms/ui'
import { trackGAEvent, truncateBySpace, truncateString } from '@lms/utils'
import { uniqueId } from 'lodash'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import { withAuthorization } from '@lms/hoc'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { CoursesAPI, getActivityById } from 'src/api/courses'
import { UploadAPI } from 'src/api/upload'

interface IBreadCrumbs {
  course_section_type: 'PART' | 'CHAPTER' | 'UNIT' | 'ACTIVITY'
  id: string
  name: string
  parent_id: string
}
interface VideoStateClicked {
  course_tab_document_id: string
  videos: {
    file_id: string
    is_click: boolean
  }[]
}
const ActivityTeacherPage = () => {
  const router = useRouter()
  const searchParam = useSearchParams()
  const pathname = usePathname()
  const params = useParams()
  const { id, activityId } = params
  const query = Object.fromEntries(searchParam.entries())
  const { setOpenPopupCTA } = useCourseContext()

  const useGetActivityById = (
    id: string | string[] | undefined,
    course_id: string | string[] | undefined,
  ) => {
    return useQuery(
      ['activity', id, course_id],
      () => getActivityById(id, course_id),
      {
        enabled: id !== undefined && course_id !== undefined,
        retry: false,
      },
    )
  }

  const {
    data: activity,
    isLoading,
    refetch,
  } = useGetActivityById(activityId, id)

  const courseId = id
  const sectionId = activityId as string

  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )
  const [activeButtonId, setActiveButtonId] = useState<string>()
  const endActivityRef = useRef<HTMLDivElement>(null)
  const quizDocumentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)
  const observerRef = useRef<IntersectionObserver>()
  const isFinishRef = useRef<boolean>(false)
  const [isHasQuizGrading, setIsHasQuizGrading] = useState(false)
  const [videoClicked, setVideoClicked] = useState<Array<VideoStateClicked>>([])
  const [isDoneActivity, setIsDoneActivity] = useState(false)
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [fetch_progress, setFetch_progress] = useState<string[]>([])
  const [exhibitText, setExhibitText] = useState<string>('')
  const [focusingPadId, setFocusingPadId] = useState('')

  const settingDoneProcessActivity = (activity: IActivity) => {
    setIsHasQuizGrading(false)
    setIsDoneActivity(false)
    setVideoClicked([])
    if (activity?.user_course_section_progress?.length) {
      const progress = activity.user_course_section_progress[0]
      if (
        progress?.total_course_sections ===
        progress?.total_course_sections_completed
      ) {
        setIsDoneActivity(true)
        return
      }
    }

    if (
      activity.tabs?.find((tab) =>
        tab.course_tab_documents?.find(
          (course_tab) => course_tab.quiz?.is_graded,
        ),
      )
    ) {
      setIsHasQuizGrading(true)
      return
    }

    const videos: VideoStateClicked[] = []
    activity.tabs?.forEach((tab) => {
      tab?.course_tab_documents?.forEach((course_tab) => {
        if (!course_tab.videos?.length) {
          return
        }
        const course_tab_index = videos.findIndex(
          (video) => video.course_tab_document_id === course_tab.id,
        )
        if (course_tab_index === -1) {
          videos.push({
            course_tab_document_id: course_tab.id,
            videos:
              course_tab.videos?.map((document) => {
                return {
                  file_id: document?.file?.id,
                  is_click: false,
                }
              }) ?? [],
          })
        }
      })
    })
    if (videos.length) {
      setVideoClicked(videos)
      return
    }
    handleFinishedCourseSectionProgress()
  }

  useLayoutEffect(() => {
    if (activity) {
      setExhibitText(
        activity.program === PROGRAM.CMA
          ? EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE
          : EXHIBIT_TEXT_REPLACE.EXHIBIT,
      )
      dispatch(resetQuizActivity({}))
      CoursesAPI.CACHE_GET_TOPIC_DESCRIPTION = {}
      try {
        dispatch(courseActivityAction.setActivityState(activity))
        dispatch(courseActivityAction.setCurrentTabId(activity?.tabs?.[0]?.id))
        dispatch(
          getDiscussion({
            api: CoursesAPI,
            id: id as string,
            sectionId: sectionId,
          }),
        )
      } catch (error) { }
    }

    return () => {
      dispatch(courseActivityAction.resetActivity())
      dispatch(resetQuizActivity({}))
    }
  }, [activity, dispatch, id, sectionId])

  useEffect(() => {
    if (activity) {
      settingDoneProcessActivity(activity)
    }
  }, [activity])
  // TODO: next14
  // useEffect(() => {
  //   router.events.on('routeChangeComplete', () => {
  //     isFinishRef.current = false
  //   })
  //   return () => {
  //     router.events.off('routeChangeComplete', () => {
  //       isFinishRef.current = true
  //     })
  //   }
  // }, [router.events])
  useEffect(() => {
    // routeChangeComplete
    isFinishRef.current = false
  }, [pathname])

  useEffect(() => { }, [
    endActivityRef.current,
    quizDocumentRef.current,
    observerRef.current,
    videoRef.current,
  ])

  // Clear notes & calculator (keep notes if navigating with note_id)
  useEffect(() => {
    if (!query?.note_id) {
      dispatch(clearNote())
    }
    dispatch(closeCalculator())
  }, [dispatch, pathname, query?.note_id])

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

  /**
   * Hàm xử lý khi kết thúc tiến trình phần của khóa học.
   */
  const handleFinishedCourseSectionProgress = async () => {
    if (fetch_progress.find((id) => id === sectionId)) {
      return
    }
    const response = await CoursesAPI.startCourseSectionProgress(
      courseId,
      sectionId,
    )
    isFinishRef.current = true
    setFetch_progress([...fetch_progress, sectionId])

    if (!!response?.data?.progress?.is_completed) {
      setTimeout(() => {
        dispatch(
          showPopupCompletedCourse(response?.data?.progress?.content || ''),
        )
      }, 2000)
    }
  }

  const handleRefreshCurrentTab = () => {
    try {
      selector?.currentTabId &&
        delete CoursesAPI.CACHE_GET_TOPIC_DESCRIPTION[selector?.currentTabId]
      dispatch(
        getCourseActivityTapById({
          api: CoursesAPI,
          courseId: courseId as string,
          id: selector?.currentTabId ?? '',
        }),
      )
      setActiveButtonId(selector?.currentTabId)
    } catch (error) { }
  }

  /**
   * Hàm xử lý khi thay đổi tab.
   * @param {string} id - ID của tab.
   */
  const handleChangeTab = (courseId: string, id: string) => {
    try {
      dispatch(getCourseActivityTapById({ api: CoursesAPI, courseId, id }))
      setActiveButtonId(id)
    } catch (error) { }
  }

  /**
   * Hàm để xác định màu tab active.
   * @param {string} id - ID của tab.
   * @returns {string} - Màu tab.
   */
  const tabButtonColor = (id: string) => {
    let currentTabId
    if (selector?.loading) {
      currentTabId = activeButtonId
    } else {
      currentTabId = selector?.currentTabId
    }
    return id === currentTabId ? 'primary' : 'white'
  }

  /**
   * Giá trị được memoized cho course_tab_documents.
   */
  const course_tab_documents = useMemo(() => {
    return selector?.tabs?.find((e) => e?.id === selector?.currentTabId)
      ?.course_tab_documents
  }, [selector?.tabs])

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

  const handleOpenScratchPad = (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setOpenScratchPad((prev) => {
      const arr = [...prev]
      if (data?.type === 'file') {
        arr?.push({
          type: data.type,
          file: file,
          id: uniqueId('file'),
          fileName: fileName,
        })
      } else if (data?.type === 'exhibits') {
        arr.push({
          id: uniqueId('exhibits'),
          ...data,
        })
      }
      return arr
    })
  }

  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      const arr = [...prev]
      const newArr = arr?.filter((e) => e?.id !== pad?.id)
      return newArr
    })
  }

  /**
   * Hàm trả về biểu tượng (icon) tương ứng với loại hoạt động của khóa học.
   * @param type - Loại hoạt động (TEXT, VIDEO, PAST_EXAM_ANALYSIS, QUIZ).
   * @param lockActivity - Trạng thái khóa hoạt động (true nếu bị khóa).
   * @returns JSX.Element hoặc null nếu không tìm thấy loại hoạt động.
   */
  const getCourseIcon = (type: string, lockActivity: boolean) => {
    // Nếu cấu phần bị khóa, trả về biểu tượng khóa
    if (lockActivity) {
      return <SappIcon icon="locksection"></SappIcon>
    }

    // Bản đồ các loại hoạt động với biểu tượng tương ứng
    const iconMap: Record<string, any> = {
      TEXT: 'course_text', // Biểu tượng cho hoạt động dạng văn bản
      VIDEO: 'course_video', // Biểu tượng cho hoạt động dạng video
      PAST_EXAM_ANALYSIS: 'course_past_exam_analysis', // Biểu tượng cho phân tích bài thi cũ
      QUIZ: 'course_quiz', // Biểu tượng cho bài kiểm tra
    }

    // Trả về biểu tượng tương ứng nếu tìm thấy, nếu không trả về null
    return iconMap[type] ? <SappIcon icon={iconMap[type]} /> : null
  }

  /**
   * @description call API lấy data của breadcrumbs
   */
  const useGetBreadcrumb = (
    id: string | string[] | undefined,
    section_id: string | string[] | undefined,
  ) => {
    return useQuery(
      ['useGetBreadcrumb', id, section_id],
      () => CoursesAPI.getBreadcumb(id, section_id),
      {
        enabled: id !== undefined && section_id !== undefined,
        retry: false,
      },
    )
  }

  /**
   * @description lấy data breadcrumb using react-query
   */
  const { data: breadcrumbsMenu } = useGetBreadcrumb(id, activityId)

  /**
   * @description tìm kiếm id của Part
   */
  const partId = breadcrumbsMenu?.data?.find(
    (e: IBreadCrumbs) => e?.course_section_type === 'PART',
  )?.id

  /**
   * @description config menu breadcrumbs trong activity
   */

  const breadcrumbsData: ITabs[] = breadcrumbsMenu?.data
    ? breadcrumbsMenu?.data?.map((e: IBreadCrumbs) => {
      const urlCourseDetail = `${PageLink.TEACHER_MY_COURSE}/${id}/section/${partId}`
      switch (e.course_section_type) {
        case 'PART':
        case 'CHAPTER':
        case 'UNIT':
          return {
            title: e?.name,
            link: urlCourseDetail,
          }
        case 'ACTIVITY':
          return {
            title: e?.name,
            link: '#',
          }
        default:
          return {
            title: e?.name,
            link: `${PageLink.TEACHER_MY_COURSE}/my-course/${id}`,
          }
      }
    })
    : []

  // const [sessionData, setSessionData] = useState<Array<any>>([])

  const download = async (name: string, file_key: string) => {
    await UploadAPI.downloadFile({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }

  /**
   * Hàm xử lý điều hướng hoạt động.
   * @param isLocked - Trạng thái khóa của hoạt động (true nếu bị khóa).
   * @param activityId - ID của hoạt động cần điều hướng.
   * @param eventLabel - Nhãn sự kiện để theo dõi Google Analytics.
   */
  const handleActivityNavigation = (
    isLocked: boolean,
    activityId: string,
    eventLabel: string,
  ) => {
    if (isLocked) {
      // Nếu hoạt động bị khóa, hiển thị popup thông báo
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    } else {
      // Nếu hoạt động không bị khóa, điều hướng đến hoạt động và ghi nhận sự kiện
      router.push(`${PageLink.TEACHER_MY_COURSE}/${id}/activity/${activityId}`)
      trackGAEvent(eventLabel) // Ghi nhận sự kiện Google Analytics
    }
  }

  return (
    <SappLoadingGlobal loading={isLoading}>
      <LayoutTeacher title="Activity" breadcrumbs={breadcrumbsData} isActivity>
        <div className={`max-w-xxl text-bw-1 mx-auto my-0`}>
          {/* Notes */}
          <>
            {getNotesData?.map((e: any, index: number) => {
              return (
                <CreateNote
                  id={e?.id}
                  content={e?.description}
                  uuid={e?.uuid}
                  count={index}
                  key={e?.uuid}
                  setFocusingPadId={setFocusingPadId}
                  focusingPadId={focusingPadId}
                />
              )
            })}
            <>
              {selector?.calculator_status && (
                <CalculatorModal 
                  onClose={() => dispatch(closeCalculator())}
                  key={"sidebar-calculator"}
                  onClick={() => setFocusingPadId("sidebar-calculator")}
                  isInBody
                  isTopModal={focusingPadId === "sidebar-calculator"}
                />
              )}
            </>
          </>
          {/* Main Activity */}
          <div className="shadow-activity" data-aos={ANIMATION.DATA_AOS}>
            {/* Header */}
            <div className="bg-gray-100px-6 ">
              <div
                className={`flex w-full select-none items-center justify-between gap-4 py-6 ${activity?.course_outcomes?.length > 0
                  ? 'borderColor-default border-b'
                  : ''
                  }`}
              >
                <div className="text-2xl font-medium ">
                  <Tooltip
                    title={activity?.name?.length > 95 && activity?.name}
                  >
                    {activity?.name}
                  </Tooltip>
                </div>
                <div className="whitespace-nowrap text-sm text-gray">
                  {activity?.duration || 0}{' '}
                  {activity?.duration > 1 ? 'mins' : 'min'} estimated
                </div>
              </div>

              {activity?.course_outcomes?.length > 0 && (
                <div className={`pb-4 pt-6`}>
                  <div className="mb-2 select-none text-base font-semibold">
                    Learning Outcome:
                  </div>

                  <ul className="ml-3 select-none list-disc text-base">
                    {activity?.course_outcomes?.map((e: any) => {
                      return (
                        <li className="ml-4" key={e?.id}>
                          <EditorReader
                            className="mt-1.5"
                            text_editor_content={e.description}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-gray-200">
              <div className="flex flex-wrap gap-2 px-6">
                {selector?.tabs?.map((e, index) => {
                  return (
                    <SappButton
                      key={e?.id}
                      size="small"
                      className="!px-3 py-2.5 text-sm !font-normal"
                      color={tabButtonColor(e?.id)}
                      title={truncateBySpace(e?.name, 5)}
                      showTooltip={e?.name?.length > 20}
                      toolTipTitle={e?.name}
                      onClick={() => {
                        handleChangeTab(courseId as string, e?.id)
                        trackGAEvent('Click Button Tab Activity')
                      }}
                    />
                  )
                })}
              </div>
            </div>
            <ActivitySkeleton
              length={1}
              loading={selector.loading}
              className="mb-6 bg-white"
              classChild="w-11/12 mx-auto max-w-[950px]"
            >
              <div className="mb-6 bg-white pb-6">
                <div className={`mx-auto my-0 w-full max-w-[1000px] px-6 pt-6`}>
                  <div className="tab-content overflow-x-auto overflow-y-hidden">
                    {course_tab_documents?.map((e, i) => {
                      const gradeStatus = e?.quiz?.attempt?.grading_status
                      const marginBottom =
                        i < course_tab_documents?.length - 1 ? 'mb-6' : ''
                      if (e?.type === 'QUIZ') {
                        return (
                          <div
                            className={marginBottom}
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
                              focusOnlyQuiz={{ id: '', open: false }}
                              setFocusOnlyQuiz={() => { }}
                              isTeacher
                              number_of_attempts={0}
                            />
                          </div>
                        )
                      }
                      if (e.type === 'TEXT') {
                        return (
                          <div
                            className={`${marginBottom} select-none`}
                            key={i + '_' + selector?.currentTabId}
                          >
                            <TextDocument
                              text_editor_content={e?.text_editor_content}
                            ></TextDocument>
                          </div>
                        )
                      }
                      if (e.type === 'VIDEO') {
                        return (
                          <div
                            className={marginBottom}
                            key={i + '_' + selector?.currentTabId}
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

                  {activity?.files?.length > 0 && (
                    <>
                      <SAPPBorder />
                      <div
                        className={`pt-8 ${getPreviousTabId() ? 'pb-4' : 'pb-0'
                          } `}
                      >
                        <div className="text-base font-semibold">Resource:</div>
                        <ul className="list-disc text-base">
                          {activity?.files.map((e: any, index: number) => {
                            const isPreviewFile =
                              e.resource.suffix_type !==
                              SUFFIX_TYPE.GENERAL_FILE &&
                              e.resource.name.slice(-4) !== '.csv'

                            return (
                              <div
                                className={`flex justify-between ${index === 0 ? 'mt-4' : 'mt-5'
                                  }`}
                                key={index}
                              >
                                <div className="flex">
                                  <div className="mr-2 flex self-center">
                                    <LinkIcon />
                                  </div>
                                  <Tooltip
                                    title={
                                      isPreviewFile
                                        ? 'Preview File'
                                        : 'Download file'
                                    }
                                    showTooltip={true}
                                    placement="right"
                                  >
                                    <p
                                      className="cursor-pointer text-gray hover:text-primary"
                                      onClick={() => {
                                        isPreviewFile
                                          ? handleOpenScratchPad(
                                            {
                                              type: 'file',
                                            },
                                            e?.resource?.url,
                                            e?.resource?.name,
                                          )
                                          : download(
                                            e?.resource?.name,
                                            e?.resource?.file_key,
                                          )

                                        trackGAEvent('Click Open File Resource')
                                      }}
                                    >
                                      {e?.resource?.name}
                                    </p>
                                  </Tooltip>
                                </div>
                                <a
                                  className="cursor-pointer"
                                  onClick={() => {
                                    download(
                                      e?.resource?.name,
                                      e?.resource?.file_key,
                                    )
                                    trackGAEvent(
                                      'Click Button Download Resource Activity',
                                    )
                                  }}
                                >
                                  <DownloadIcon />
                                </a>
                              </div>
                            )
                          })}
                        </ul>
                      </div>
                      {getPreviousTabId() && <SAPPBorder className="mt-4" />}
                    </>
                  )}

                  <div className="mt-8 flex flex-wrap justify-between gap-5">
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
                            className="group relative z-10 mb-2 flex cursor-pointer select-none items-center gap-2 text-base font-semibold text-gray-800 hover:text-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              fill="none"
                            >
                              <path
                                className="fill-gray-800 group-hover:fill-primary"
                                fillRule="evenodd"
                                d="M7.707 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 9H17a1 1 0 1 1 0 2H5.414l2.293 2.293a1 1 0 0 1 0 1.414Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Previous Tab
                          </div>
                          <div className="absolute bottom-0 left-0 h-2.5 w-[129px] bg-gray-200"></div>
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
                            className="group relative z-10 mb-2 flex cursor-pointer select-none items-center gap-2 text-right text-base font-semibold text-gray-800 hover:text-primary"
                          >
                            Next Tab
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              fill="none"
                            >
                              <path
                                className="fill-gray-800 group-hover:fill-primary"
                                fillRule="evenodd"
                                d="M12.293 5.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-0 h-2.5 w-[98px] -translate-x-1 bg-gray-200"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ActivitySkeleton>
          </div>

          {/* Next/Prev Activities */}
          <div data-aos={ANIMATION.DATA_AOS} className="bg-red">
            <div className="relative mb-6 border-b-2 border-b-primary-400 bg-white px-6 py-3 shadow-activity">
              <div
                ref={endActivityRef}
                className={`flex flex-nowrap gap-5 justify-${activity?.previous_activity ? 'between' : 'end'}`}
              >
                {activity?.previous_activity?.id && (
                  <div className="w-1/2">
                    <div
                      onClick={() =>
                        handleActivityNavigation(
                          activity?.previous_activity?.is_preview_locked,
                          activity?.previous_activity?.id,
                          'Click Button Previous Activity',
                        )
                      }
                      className="mb-2 cursor-pointer select-none whitespace-nowrap text-xs font-semibold text-gray-800 hover:text-primary sm:text-base"
                    >
                      Previous Activity
                    </div>
                    <div className="flex text-sm text-gray">
                      {getCourseIcon(
                        activity?.previous_activity?.display_icon,
                        activity?.previous_activity?.is_preview_locked,
                      )}
                      <Tooltip
                        title={activity?.previous_activity?.name}
                        showTooltip={
                          activity?.previous_activity?.name?.length > 80
                        }
                      >
                        <span className="ml-2 w-full overflow-hidden text-ellipsis leading-4.5">
                          {truncateString(
                            activity?.previous_activity?.name,
                            80,
                          )}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )}
                {!activity?.previous_activity && <></>}
                {activity?.next_activity?.id && (
                  <div className="w-1/2">
                    <div
                      onClick={() =>
                        handleActivityNavigation(
                          activity?.next_activity?.is_preview_locked,
                          activity?.next_activity?.id,
                          'Click Button Next Activity',
                        )
                      }
                      className="mb-2 cursor-pointer select-none text-right text-xs font-semibold text-gray-800 hover:text-primary sm:text-base"
                    >
                      Next Activity
                    </div>
                    <div className="flex justify-end text-sm text-gray">
                      <Tooltip
                        title={activity?.next_activity?.name}
                        showTooltip={activity?.next_activity?.name?.length > 80}
                      >
                        <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-end leading-4.5">
                          {truncateString(activity?.next_activity?.name, 80)}
                        </div>
                      </Tooltip>
                      <div className="ms-2">
                        {getCourseIcon(
                          activity?.next_activity?.display_icon,
                          activity?.next_activity?.is_preview_locked,
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {!activity?.next_activity && <></>}
              </div>
            </div>
          </div>
          <div></div>
          <div className="mt-6 shadow-activity" data-aos={ANIMATION.DATA_AOS}>
            <Discussion class_id={(id as string) || ''} />
          </div>

          {/* Sratchpad */}
          {openScratchPad.map((e, index: number) => {
            if (e.type === 'file') {
              return (
                <ModalResizeable
                  title={e.fileName}
                  width={650}
                  height={850}
                  key={e.id}
                  dragHandleClassName="modal-header"
                  onClose={() => handleCloseScratchPad(e)}
                  position="center"
                  isInBody
                  modalIndex={index}
                  isTopModal={focusingPadId === e.id}
                  onModalFocus={() => setFocusingPadId(e?.id as string)}
                >
                  <div
                    // className="overflow-auto p-4 bg-white"
                    style={{ height: 'calc(100% - 40px' }}
                    className="mb-2 cursor-pointer select-none text-right text-base font-semibold text-gray-800 hover:text-primary"
                  >
                    {/* <div className='flex flex-'> */}
                    <FileViewer fileName={e?.fileName} fileUrl={e?.file} />
                  </div>
                </ModalResizeable>
              )
            } else if (e.type === 'exhibits') {
              return (
                <ModalResizeable
                  key={e.id}
                  dragHandleClassName="modal-header"
                  onClose={() => handleCloseScratchPad(e)}
                  position="center"
                  header={({ requestClose }) => (
                    <div className="relative">
                      <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between bg-white px-5">
                        <div className="truncate">
                          <span className="text-base font-semibold text-gray-800">{`${exhibitText} ${e?.index + 1
                            }: `}</span>
                          {e?.name}
                        </div>
                      </div>
                      <button
                        className="absolute right-3 top-2"
                        onClick={() => {
                          requestClose()
                          setTimeout(() => handleCloseScratchPad(e), 300)
                        }}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  )}
                  isInBody
                  modalIndex={e.index}
                  isTopModal={focusingPadId === e.id}
                  onModalFocus={() => setFocusingPadId(e?.id as string)}
                >
                  <div className="h-[calc(100%-40px)] overflow-auto bg-white p-5">
                    <EditorReader
                      text_editor_content={e?.description}
                      className=" w-full "
                    />
                    {e?.files?.length > 0 &&
                      e?.files.map((e: any, index: number) => {
                        return (
                          <div key={index} className="h-full cursor-pointer">
                            <FileViewer
                              fileName={e?.resource?.name}
                              fileUrl={e?.resource?.url}
                            />
                          </div>
                        )
                      })}
                  </div>
                </ModalResizeable>
              )
            }
          })}
        </div>
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.TEACHER])(ActivityTeacherPage)
