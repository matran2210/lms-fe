import { CloseIcon, CloseModalIcon } from '@assets/icons'
import {
  ActivityBar,
  ActivityResource,
  Breadcrumb3Level,
  LearningOutcome,
  SectionContent,
  SectionContentModal,
} from '@components/courses'
import Calculator from '@components/courses/activity/calculator'
import CreateNote from '@components/courses/activity/create-note/CreateNote'
import ButtonIcon from '@components/courses/buttons/ButtonIcon'
import NextPrevActivityButton from '@components/courses/buttons/ButtonNextPrevActivity'
import { Arrows } from '@components/courses/icons'
import { AltArrowLeft } from '@components/courses/icons/AltArrowLeft'
import PdfModal from '@components/courses/popup/PdfModal'
import Layout from '@components/layout'
import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import {
  ActivityLeftSkeleton,
  ActivityRightSkeleton,
} from '@components/mycourses/activity/documents/LoadingActivity'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import PopupLockContent from '@components/mycourses/hubspot/PopupLockContent'
import { useCourseContext } from '@contexts/index'
import { CoursesAPI } from '@pages/api/courses'
import { getActivityById } from '@pages/api/short-course/activity'
import { trackGAEvent } from '@utils/google-analytics'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { ACTIVE_TABS, ANIMATION, PageLink } from '@lms/core'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { UploadAPI } from 'src/pages/api/short-course/upload'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { clearNote } from 'src/redux/slice/Course/NotesList'
import {
  closeCalculator,
  courseActivityAction,
  shortCourseActivityReducer,
} from 'src/redux/slice/Course/ShortCourse/Activity/Activity'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import {
  ActivityFile,
  IActivity,
  IActivityResource,
  ISubSection,
} from 'src/type/courses-3-level'
import { MovableWindow } from '@lms/ui'

interface VideoStateClicked {
  course_tab_document_id: string
  videos: {
    file_id: string
    is_click: boolean
  }[]
}

export default function ActivityDetail() {
  const router = useRouter()
  const listSectionRef = useRef<ISubSection[] | undefined>([])
  const ACTIVITYID = (router.query.id as string) || ''
  const COURSEID = router.query.courseId
  const [activeTab, setActiveTab] = useState<string>('')
  const [activeVideo, setActiveVideo] = useState<string>('')
  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()
  const dispatch = useAppDispatch()
  const selector = useAppSelector(shortCourseActivityReducer)
  const endActivityRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<Array<IntersectionObserver | null>>([])
  const observerRef = useRef<IntersectionObserver>()
  const isFinishRef = useRef<boolean>(false)
  const [videoClicked, setVideoClicked] = useState<Array<VideoStateClicked>>([])
  const [isDoneActivity, setIsDoneActivity] = useState(false)
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [fetch_progress, setFetch_progress] = useState<string[]>([])
  const handleCloseTab = () => setActiveTab('')
  const getNotesData = useAppSelector(
    (state) => state.shortNotesListReducer?.note_data,
  )
  const [dataModal, setDataModal] = useState<
    IActivityResource['items'][number] | null
  >(null)
  const [isOpen, setIsOpen] = useState(false)
  const { isMobileView, isTabletView, isAlwaysShowSidebar } =
    useTailwindBreakpoint()
  const [showSidebar, setShowSidebar] = useState(false)
  const { setOpenSidebar } = useCourseContext()

  /**
   * @description call API fetch data activity details
   */
  const useGetActivityById = (
    id: string | string[] | undefined,
    course_id: string | string[] | undefined,
  ) => {
    return useQuery(
      ['activity', id, course_id],
      async () => {
        try {
          return await getActivityById(id, course_id)
        } catch (error) {
          throw new Error('Activity Id not found')
        }
      },
      {
        enabled: id !== undefined && course_id !== undefined,
        retry: false,
      },
    )
  }

  const { data: activity, isFetching: isLoadingActivity } = useGetActivityById(
    ACTIVITYID,
    COURSEID,
  )

  const sectionRootId = activity?.section_root?.id

  const {
    data: filteredSections,
    isLoading: isLoadingSection,
    refetch: refetchSections,
  } = useQuery({
    queryKey: ['sectionDetail', sectionRootId, COURSEID],
    queryFn: () => fetchSections(sectionRootId as string, COURSEID as string),
    enabled: !!COURSEID && !!sectionRootId,
    retry: false,
  })

  const fetchSections = async (sectionRootId: string, courseId: string) => {
    if (sectionRootId && courseId) {
      const { data: subsectionData } = await CoursesAPI.getCourseDetailActivity(
        courseId,
        sectionRootId,
      )

      const matchedSubsection = subsectionData.course_section_tree.find(
        (subsection: ISubSection) => subsection.id === sectionRootId,
      )

      const subsections: ISubSection[] = matchedSubsection
        ? matchedSubsection.children
        : []
      listSectionRef.current = subsections
      return subsections
    }
  }

  const transformedLearningOutcomes =
    activity?.course_outcomes?.map((outcome: { description: string }) => ({
      title: outcome.description,
    })) || []

  /**
   * @description call API fetch activity resources data download
   */
  const activityResourceItems = (activity?.files || []).map(
    (file: ActivityFile) => ({
      title: file.resource?.name,
      url: file.resource?.url,
      download: async () => {
        try {
          await UploadAPI.downloadFile({
            files: [
              {
                name: file.resource?.name,
                file_key: file.resource?.file_key,
              },
            ],
          })
        } catch (error) {
          throw new Error('Failed to download file')
        }
      },
    }),
  )

  useLayoutEffect(() => {
    if (activity) {
      CoursesAPI.CACHE_GET_TOPIC_DESCRIPTION = {}
      try {
        dispatch(courseActivityAction.setActivityState(activity))
      } catch (error) {}
    }

    return () => {
      dispatch(courseActivityAction.resetActivity())
    }
  }, [activity, dispatch, COURSEID, ACTIVITYID])

  const handleFinishedCourseSectionProgress = async () => {
    if (fetch_progress.find((id) => id === ACTIVITYID)) {
      return
    }
    const response = await CoursesAPI.startShortCourseSectionProgress(
      COURSEID,
      ACTIVITYID,
    )
    if (response?.success) refetchSections()

    isFinishRef.current = true
    setFetch_progress([...fetch_progress, ACTIVITYID])
    if (response?.data?.progress?.is_completed) {
      setTimeout(() => {
        dispatch(showPopupCompletedCourse(response?.data?.progress?.content))
      }, 2000)
    }
  }

  // Clear notes & calculator
  useEffect(() => {
    dispatch(clearNote())
    dispatch(closeCalculator())
  }, [dispatch, router.asPath])

  const onVideoStart = (file_id: string, course_tab_document_id: string) => {
    setActiveVideo(file_id)
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

  const settingDoneProcessActivity = (activity: IActivity) => {
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

    const videos: VideoStateClicked[] = []

    activity?.course_tab_documents?.forEach((course_tab) => {
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
    if (videos.length) {
      setVideoClicked(videos)
      return
    }
    handleFinishedCourseSectionProgress()
  }

  useEffect(() => {
    if (activity) {
      settingDoneProcessActivity(activity)
    }
  }, [activity])

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      isFinishRef.current = false
    })
    return () => {
      router.events.off('routeChangeComplete', () => {
        isFinishRef.current = true
      })
    }
  }, [router.events])

  /**
   * Giá trị được memoized cho course_tab_documents.
   */
  const course_tab_documents = useMemo(() => {
    return activity?.course_tab_documents
  }, [activity])

  const [sessionData, setSessionData] = useState<Array<IActivity>>([])

  useEffect(() => {
    // Lấy giá trị từ sessionStorage với key 'activityId'
    const storedValue = window.sessionStorage.getItem('activityId')

    // Kiểm tra nếu storedValue không null và không phải là undefined
    if (storedValue !== null && storedValue !== undefined) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
      const parsedValue = JSON.parse(storedValue)

      // Kiểm tra xem parsedValue có phải là một mảng hay không
      if (Array.isArray(parsedValue)) {
        // Nếu parsedValue là một mảng, cập nhật state sessionData với giá trị từ sessionStorage
        setSessionData(parsedValue)
      }
    }
  }, [])

  // Tạo một mảng chứa các id của các hoạt động từ sessionData
  const activityIds = sessionData?.map((activity: IActivity) => activity.id)

  // Lấy id của hoạt động tiếp theo
  const nextActivityId = activity?.next_activity?.id || ACTIVITYID

  // Tìm vị trí của hoạt động tiếp theo trong mảng activityIds
  const nextActivityIndex = activityIds?.indexOf(nextActivityId)

  // Lấy id của hoạt động trước đó
  const previousActivityId = activity?.previous_activity?.id || ACTIVITYID

  // Tìm vị trí của hoạt động trước đó trong mảng activityIds
  const previousActivityIndex = activityIds?.indexOf(previousActivityId)

  const idPreviousActivity =
    activity?.previous_activity?.id || activityIds?.[previousActivityIndex - 1]

  const idNextActivity = activity?.next_activity
    ? activity?.next_activity?.id
    : activityIds?.[nextActivityIndex + 1]

  // Lấy danh sách trạng thái khóa của các hoạt động trong phiên làm việc
  const activityPreviewLocks = sessionData?.map(
    (activity: IActivity) => activity?.is_preview_locked,
  )

  // Kiểm tra xem hoạt động tiếp theo có bị khóa hay không
  const isNextActivityLocked =
    activity?.next_activity?.is_preview_locked || false

  // Kiểm tra xem hoạt động trước đó có bị khóa hay không
  const isPreviousActivityLocked =
    activity?.previous_activity?.is_preview_locked || false

  /**
   * Hàm xử lý điều hướng hoạt động.
   * @param isLocked - Trạng thái khóa của hoạt động (true nếu bị khóa).
   * @param activityId - ID của hoạt động cần điều hướng.
   * @param eventLabel - Nhãn sự kiện để theo dõi Google Analytics.
   */
  const handleActivityNavigation = (
    isLocked: boolean,
    activityId: string | undefined | string[],
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
    } else if (activityId) {
      // Nếu hoạt động không bị khóa, điều hướng đến hoạt động và ghi nhận sự kiện
      router.push({
        pathname: `/short-course/detail/${COURSEID}/activity/${activityId}`,
      })
      trackGAEvent(eventLabel) // Ghi nhận sự kiện Google Analytics
    }
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }
  const isShowBreadCrunb =
    !isMobileView &&
    !isTabletView &&
    activity?.course?.name &&
    COURSEID &&
    activity?.name
  return (
    <Layout
      title="Activity"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
    >
      <div className="relative mx-auto h-full max-w-1729">
        {isLoadingActivity ? (
          <div className="mb-6 mt-4 h-[72px] gap-6 md:gap-10 lg:flex lg:flex-row lg:items-start">
            <div className="rounded-lg bg-white p-4 shadow lg:w-6.5">
              <div className="mb-3 h-4 w-11/12 rounded bg-skeleton" />
              <div className="h-6 w-10/12 rounded bg-skeleton" />
            </div>
            <div className="lg:w-3.5" />
          </div>
        ) : (
          <>
            {isShowBreadCrunb && (
              <Breadcrumb3Level
                tabs={[
                  {
                    title: activity?.course?.name as string,
                    link: `/short-course/detail/${COURSEID}`,
                  },
                  {
                    title: activity?.name as string,
                    link: '#',
                  },
                ]}
                currentPage={activity?.name as string}
              />
            )}

            <div className="mx-3 mb-6 mt-4 flex select-none items-center justify-start md:mt-2 lg:mx-0 lg:mb-8">
              {(isTabletView || isMobileView) && (
                <Link href={`${PageLink.SHORT_COURSE_DETAIL}/${COURSEID}`}>
                  <div className="mr-2">
                    <AltArrowLeft />
                  </div>
                </Link>
              )}
              <h1 className="line-clamp-1 text-[18px] font-bold text-bw-15 lg:text-2xl">
                {activity?.name}
              </h1>
            </div>
          </>
        )}

        {(activity?.course_outcomes?.length ?? 0) > 0 && (
          <ButtonIcon
            title="View Learning Outcome"
            className="mx-3 text-primary lg:mx-0 lg:hidden"
            onClick={() => {
              setActiveTab(ACTIVE_TABS.LEARNING)
            }}
          >
            <div className="rotate-180">
              <Arrows />
            </div>
          </ButtonIcon>
        )}

        {selector?.calculator_status && (
          <MovableWindow
            position={{
              width: '344px',
              height: 'fit-content',
              top: 'calc(25% - 150px)',
              left: 'calc(25% - 200px)',
            }}
            key={'calculator'}
            zIndex={1001}
          >
            <div className="absolute left-0 top-0 h-full w-fit rounded-xl">
              <div
                className="flex h-fit w-full items-center justify-between rounded-t-xl border border-b-0 border-gray-300 bg-gray-100 px-4 py-3"
                style={{
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
              >
                <div className="text-sm font-bold">Calculator</div>
                <button
                  onClick={() => {
                    dispatch(closeCalculator())
                  }}
                >
                  <CloseModalIcon />
                </button>
              </div>
              <Calculator />
            </div>
          </MovableWindow>
        )}

        {getNotesData?.map((e, index: number) => {
          return (
            <CreateNote
              id={e?.id}
              content={e?.description}
              uuid={e?.uuid}
              count={index}
              key={e?.uuid}
              isActiveTab={activeTab === ACTIVE_TABS.ADD_NOTE}
              handleCloseTab={handleCloseTab}
              countNote={getNotesData?.length}
            />
          )
        })}

        <div className="gap-6 md:gap-10 lg:flex lg:flex-row lg:items-start">
          {isLoadingActivity ? (
            <ActivityLeftSkeleton />
          ) : (
            <div className="flex flex-col gap-6 lg:w-6.5">
              {(activity?.course_outcomes?.length ?? 0) > 0 && (
                <LearningOutcome
                  title="Learning Outcome"
                  items={transformedLearningOutcomes}
                  visible={activeTab === ACTIVE_TABS.LEARNING}
                  onClose={handleCloseTab}
                />
              )}
              <div
                className="mb-24 rounded-lg bg-white pb-4 shadow-search md:mx-4 lg:mx-0 lg:mb-10 lg:block lg:rounded-xl"
                data-aos={ANIMATION.DATA_AOS}
              >
                <div className="mx-auto my-0 w-full px-4 pt-4 lg:px-6">
                  <div className="tab-content overflow-x-auto overflow-y-hidden">
                    {course_tab_documents?.map((e, i) => {
                      const marginBottom =
                        i < course_tab_documents?.length - 1 ? 'mb-6' : ''
                      if (e.type === 'VIDEO') {
                        if (activeVideo === '' && e?.videos)
                          setActiveVideo(e?.videos[0]?.file?.id)
                        return (
                          <div
                            className={marginBottom}
                            key={i + '_' + selector?.currentTabId}
                          >
                            <VideoDocument
                              key={`${activity?.id}-${e?.id}-${i}`}
                              videos={e?.videos}
                              activityId={activity?.id as string}
                              tabId={selector?.currentTabId || ''}
                              streamRefProp={(el: IntersectionObserver) =>
                                (videoRef.current[i || 0] = el)
                              }
                              handleProcess={onVideoStart}
                              document_id={e?.id}
                              quizId=""
                              grading_preference="AFTER_EACH_QUESTION"
                              activeVideo={activeVideo}
                              activeTab={activeTab}
                              handleCloseTab={setActiveTab}
                              onUpdateActiveVideo={setActiveVideo}
                              newQuizModal={true}
                            ></VideoDocument>
                          </div>
                        )
                      } else if (e.type === 'TEXT') {
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
                      } else {
                        return null
                      }
                    })}
                  </div>

                  <div className="float-right w-full pt-4 md:pt-6 lg:max-w-max">
                    <NextPrevActivityButton
                      nextClick={() =>
                        handleActivityNavigation(
                          isNextActivityLocked,
                          idNextActivity,
                          'Click Button Next Activity',
                        )
                      }
                      prevClick={() =>
                        handleActivityNavigation(
                          isPreviousActivityLocked,
                          idPreviousActivity,
                          'Click Button Previous Activity',
                        )
                      }
                      showNext={!!idNextActivity}
                      showPrev={!!idPreviousActivity}
                      titleNext="Next Activity"
                      titlePrev="Previous Activity"
                      classNamePrev="min-h-[38px]"
                      isLockPrevious={isPreviousActivityLocked}
                      isLockedNext={isNextActivityLocked}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoadingSection ? (
            <ActivityRightSkeleton />
          ) : (
            <section
              className="sticky top-[40px] mb-4 w-3.5 space-y-6"
              data-aos={ANIMATION.DATA_AOS}
            >
              <SectionContentModal
                sections={filteredSections || []}
                visible={activeTab === ACTIVE_TABS.CONTENT}
                onClose={handleCloseTab}
                class_user_id={activity?.class_user_id || ''}
              />

              <SectionContent
                title={activity?.section_root?.name || 'Section Content'}
                sections={listSectionRef.current || []}
                class_user_id={activity?.class_user_id || ''}
              />

              {activityResourceItems.length > 0 && (
                <ActivityResource
                  title="Activity Resource"
                  items={activityResourceItems}
                  visible={activeTab === ACTIVE_TABS.RESOURCE}
                  onClose={handleCloseTab}
                  setDataModal={setDataModal}
                  setIsOpen={setIsOpen}
                />
              )}
            </section>
          )}
        </div>
      </div>

      <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />
      {dataModal && (
        <PdfModal
          title={dataModal?.title}
          open={isOpen}
          fileUrl={dataModal.url || ''}
          onClose={() => {
            setIsOpen(false)
          }}
          position="center"
          header={
            <div className="">
              <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
                <div className="truncate">{dataModal.title}</div>
              </div>
              <button
                className="absolute right-3 top-2"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
          }
        ></PdfModal>
      )}
      <PopupLockContent showForm={openPopupCTA} setShowForm={setOpenPopupCTA} />
      <CtaTrial />
    </Layout>
  )
}
