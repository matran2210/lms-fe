import {
  CalculatorIcon,
  CalculatorIconV2,
  CircleCloseIcon,
  CloseIcon,
  CloseIconNote,
  DocumentTextIcon,
  HourglassIcon,
  ResourceIcon,
  ScratchPadIcon,
  ScratchPadIconV2,
  TimeLineIcon,
} from '@assets/icons'
import { EditorReader } from '@lms/ui'
import { FileViewer } from '@lms/ui'
import { ModalResizeable } from '@lms/ui'
import { MovableWindow } from '@lms/ui'
import Calculator from '@components/calculator'
import Layout from '@components/layout'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import CreateNote from '@components/mycourses/create-note/CreateNote'
import { convertMinutesToHourFormat } from '@utils/index'

import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, EXHIBIT_TEXT_REPLACE, PROGRAM } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { CoursesAPI, getActivityById } from 'src/pages/api/courses'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  closeCalculator,
  courseActivityAction,
  courseActivityReducer,
  getDiscussion,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { resetQuizActivity } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'
import { clearNote } from 'src/redux/slice/Course/NotesList'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import { UserType } from 'src/redux/types/User/urser'
import { IActivity } from '@lms/core'
import LearningOutcome from '../../../../../../../../features/course/src/components/learning/activity/LearningOutcome'
import ActivityResource from '../../../../../../../../features/course/src/components/learning/activity/ActivityResource'
import CourseTabDocument from '../../../../../../../../features/course/src/components/learning/activity/CourseTabDocument'
import clsx from 'clsx'
import { Triangle } from '@components/icons/Triangle'
import ActivityPagination from '../../../../../../../../features/course/src/components/learning/activity/ActivityPagination'
import { Divider } from 'antd'
import CardMenuItem from '../../../../../../../../features/course/src/components/learning/activity/CardMenuItem'
import CloseModalIcon from '@assets/icons/CloseModalIcon'
import LearningResource from '@components/mycourses/LearningResource'
import { activeNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import { v4 as uuidv4 } from 'uuid'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { DiscussionIcon } from '../../../../../assets/icons'
import VideoTimelineMobile from '../../../../../../../../features/course/src/components/learning/activity/modal/VideoTimelineMobile'
import { IVideo } from '@lms/core'
import BottomMenu from '@components/layout/BottomMenu'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import ActivityResourceMobile from '../../../../../../../../features/course/src/components/learning/activity/modal/ActivityResourceMobile'
import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import { SappBreadCrumbs } from '@lms/ui'
import { ITabs } from '@lms/core'
import BackToTop from '@components/BackToTop'
import { usePreviousSectionRoute } from '@contexts/PreviousSectionRouteContext'
import AssistiveTouch from '@components/layout/BottomMenu/AssistiveTouch'
import { CourseSectionType } from '@lms/core'
import ExpandIcon from '@components/layout/ExpandIcon'
import PopupLockContent from '@components/mycourses/hubspot/PopupLockContent'
import { useCourseContext } from '@contexts/index'

interface IBreadCrumbs {
  course_section_type: 'PART' | 'CHAPTER' | 'UNIT' | 'ACTIVITY'
  id: string
  name: string
  parent_id: string
}
export interface IFocusQuiz {
  open: boolean
  id: string
}
export interface VideoStateClicked {
  course_tab_document_id: string
  videos: {
    file_id: string
    is_click: boolean
  }[]
}
const ActivityPage = () => {
  const router = useRouter()
  const { previousSection } = usePreviousSectionRoute()
  const { isAlwaysShowSidebar, isMobileView } = useTailwindBreakpoint()
  const scrollRef = useRef<HTMLDivElement>(null)
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
  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()
  const { data: activity, isLoading } = useGetActivityById(
    router.query?.activityId,
    router.query?.id,
  )

  const courseId = router.query?.id
  const sectionId = router.query?.activityId as string

  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )
  const [openVideoTimeline, setOpenVideoTimeline] = useState(false)
  const [openActivityResource, setOpenActivityResource] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<IVideo>({} as IVideo)
  const isFinishRef = useRef<boolean>(false)
  const [isHasQuizGrading, setIsHasQuizGrading] = useState(false)
  const [videoClicked, setVideoClicked] = useState<Array<VideoStateClicked>>([])
  const [isDoneActivity, setIsDoneActivity] = useState(false)
  const [focusOnlyQuiz, setFocusOnlyQuiz] = useState<IFocusQuiz>({
    open: false,
    id: '',
  })
  const [focusOnlyDiscussion, setFocusOnlyDiscussion] = useState(false)

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [fetch_progress, setFetch_progress] = useState<string[]>([])
  const [exhibitsPopupPosition, setExhibitsPopupPosition] = useState({
    top: 'calc(50% - 250px)',
    left: 'calc(50% - 200px)',
  })
  const [exhibitText, setExhibitText] = useState<string>('')
  const [openResource, setOpenResource] = useState(false)

  const onFocusDiscussion = () => {
    setFocusOnlyDiscussion(true)
  }
  const onUnFocusDiscussion = () => {
    setFocusOnlyDiscussion(false)
  }
  const onOpenVideoTimeline = () => {
    setOpenVideoTimeline(true)
  }
  const onCloseVideoTimeline = () => {
    setOpenVideoTimeline(false)
  }
  const handleSetCurrentVideo = (video: IVideo) => {
    setCurrentVideo(video)
  }
  const onOpenActivityResource = () => {
    setOpenActivityResource(true)
  }
  const onCloseActivityResource = () => {
    setOpenActivityResource(false)
  }

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

  const handleOpenNotesList = () => {
    dispatch(activeNotesList())
    document.body.style.overflow = 'hidden'
  }
  const handleAddNote = () => {
    const note = {
      uuid: uuidv4(),
      id: '',
      name: 'Note',
      description: '',
    }
    dispatch(pushNotes(note))
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
        dispatch(
          courseActivityAction.setCurrentTabId(router.query?.tabId as string),
        )
        dispatch(getDiscussion({ id: router.query?.id, sectionId: sectionId }))
      } catch (error) {}
    }

    return () => {
      dispatch(courseActivityAction.resetActivity())
      dispatch(resetQuizActivity({}))
    }
  }, [activity, dispatch, router.query.id, sectionId])

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

  // Clear notes & calculator
  useEffect(() => {
    if (!router.query?.note_id) {
      dispatch(clearNote())
    }
    dispatch(closeCalculator())
  }, [dispatch, router.asPath, router.query?.note_id])

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

  const handleOpenScratchPad = (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event) {
      var mouseY = event?.pageY - 300
      setExhibitsPopupPosition({ top: mouseY + 'px', left: '33%' })
    }

    setOnFocusingPad('')
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      if (data.type === 'calculator') {
        const hasCalculator = arr.some(
          (e) =>
            e?.type === 'calculator' ||
            (typeof e?.id === 'string' && e.id.startsWith('calculator')),
        )
        if (hasCalculator) {
          return arr
        }
      }
      switch (data.type) {
        case 'calculator':
          arr?.push({
            id: uniqueId('calculator'),
            ...data,
          })
          break
        case 'scratch_pad':
          arr?.push({
            id: uniqueId('scratch_pad'),
            ...data,
          })
          break
        case 'exhibits':
          arr.push({
            id: uniqueId('exhibits'),
            ...data,
          })
          break
        case 'file':
          arr?.push({
            type: data.type,
            file: file,
            id: uniqueId('file'),
            fileName: fileName,
          })
          break
        default:
          break
      }
      return arr
    })
  }

  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      const newArr = arr?.filter((e) => e?.id !== pad?.id)
      return newArr
    })
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

  const onBackToSection = () => {
    if (previousSection) router.push(previousSection || '')
    else router.back()
  }
  /**
   * @description lấy data breadcrumb using react-query
   */
  const { data: breadcrumbsMenu } = useGetBreadcrumb(
    router.query.id,
    router.query.activityId,
  )

  /**
   * @description tìm kiếm id của Part
   */
  const partId = breadcrumbsMenu?.data?.find(
    (e: IBreadCrumbs) => e?.course_section_type === 'PART',
  )?.id

  const breadcrumbsData: ITabs[] = breadcrumbsMenu?.data
    ? breadcrumbsMenu?.data?.map((e: IBreadCrumbs) => {
        let url = ''
        const urlCourseDetail = `/courses/${router.query?.id}/section/${partId}`
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
              link: urlCourseDetail,
            }
        }
      })
    : []

  const assistiveItemClass =
    'flex flex-col items-center justify-center gap-[6px]'
  const listAssistive = [
    {
      label: (
        <div className={assistiveItemClass}>
          <ExpandIcon type="caculator" className="h-6 w-6" />
          <span className="text-xs">Calculator</span>
        </div>
      ),
      onClick: () =>
        handleOpenScratchPad({
          type: 'calculator',
        }),
    },
    {
      label: (
        <div className={assistiveItemClass}>
          <ExpandIcon type="create-note" className="h-6 w-6" />
          <span className="text-xs">New Note</span>
        </div>
      ),
      onClick: handleAddNote,
    },
    {
      label: (
        <div className={assistiveItemClass}>
          <DocumentTextIcon className="h-6 w-6" />
          <span className="text-xs">Note List</span>
        </div>
      ),
      onClick: handleOpenNotesList,
    },
    {
      label: (
        <div className={assistiveItemClass}>
          <ResourceIcon className="h-6 w-6" />
          <span className="text-xs">Resource</span>
        </div>
      ),
      onClick: onOpenActivityResource,
    },
    ...((currentVideo?.file?.resource?.time_line?.length as number) > 0
      ? [
          {
            label: (
              <div className={assistiveItemClass}>
                <TimeLineIcon />
                <span className="text-xs">Timeline</span>
              </div>
            ),
            onClick: onOpenVideoTimeline,
          },
        ]
      : []),
    {
      label: (
        <div className={assistiveItemClass}>
          <DiscussionIcon className="h-6 w-6" />
          <span className="text-xs">Discussion</span>
        </div>
      ),
      onClick: onFocusDiscussion,
    },
  ]
  const [sessionData, setSessionData] = useState<Array<any>>([])
  const chapterId = breadcrumbsMenu?.data?.find(
    (e: IBreadCrumbs) => e?.course_section_type === CourseSectionType.CHAPTER,
  )?.id

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

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout
        title="Activity"
        showSidebar={isAlwaysShowSidebar}
        fullWidth={focusOnlyDiscussion}
        className={focusOnlyDiscussion ? 'h-full !bg-white' : ''}
        childClassName={focusOnlyDiscussion ? 'h-full' : ''}
      >
        <div
          className={clsx(
            'min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-5rem)]',
            {
              'my-0 md:mt-6 lg:mt-0': !focusOnlyDiscussion,
              'py-2': focusOnlyDiscussion,
            },
          )}
        >
          {/* Breadcrumbs */}
          <div
            className={clsx('overflow-x-auto pb-2 pt-4 text-sm font-medium', {
              hidden: focusOnlyQuiz.open,
              'hidden lg:flex': !focusOnlyQuiz.open,
            })}
            onClick={() => localStorage.setItem('course_chapter_id', chapterId)}
          >
            <SappBreadCrumbs breadcrumbs={breadcrumbsData} />
          </div>
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
                />
              )
            })}
            <>
              {selector?.calculator_status && (
                <MovableWindow
                  position={{
                    top: 'calc(25% - 150px)',
                    left: 'calc(25% - 200px)',
                  }}
                  zIndex={500}
                  fixed
                >
                  <div className="absolute left-0 top-0">
                    <div
                      className="flex h-10 w-full items-center justify-between rounded-t-md bg-[#DCDDDD] px-5"
                      style={{
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="text-sm font-normal">Calculator</div>
                      <button
                        onClick={() => {
                          dispatch(closeCalculator())
                        }}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    <Calculator />
                  </div>
                </MovableWindow>
              )}
            </>
          </>
          {/* Main Activity */}
          <div
            data-aos={isMobileView ? undefined : ANIMATION.DATA_AOS}
            className={clsx(
              'flex flex-col gap-4 md:mb-[120px] md:gap-8 lg:mb-4',
              {
                'mb-0 h-full': focusOnlyDiscussion,
              },
            )}
          >
            {/* Header */}
            <HeaderMobile
              title={focusOnlyDiscussion ? 'Discussion' : activity?.name || ''}
              isHidden={focusOnlyQuiz.open}
              extraActions={
                focusOnlyDiscussion ? null : (
                  <div className="flex items-center gap-1 whitespace-nowrap rounded-md bg-warning-100 px-3 py-1 text-xs text-orange-5 md:py-[6px] md:text-sm">
                    <HourglassIcon className="shrink-0" />
                    <div>{`${convertMinutesToHourFormat(activity?.duration || 0)} estimated`}</div>
                  </div>
                )
              }
              onBack={
                focusOnlyDiscussion ? onUnFocusDiscussion : onBackToSection
              }
              className={clsx('mb-0 mt-4 md:mb-2 md:mt-0 lg:mb-0', {
                'px-4': focusOnlyDiscussion,
              })}
            />

            {/* Learning Outcome */}
            <div
              className={clsx({
                hidden:
                  focusOnlyQuiz.open ||
                  focusOnlyDiscussion ||
                  !(
                    activity?.course_outcomes &&
                    activity?.course_outcomes?.length > 0
                  ),
              })}
            >
              <LearningOutcome activity={activity} />
            </div>

            {/* Activity Resource */}
            <div
              className={clsx('hidden md:block', {
                '!hidden':
                  focusOnlyQuiz.open ||
                  focusOnlyDiscussion ||
                  !(activity?.files && activity?.files?.length > 0),
              })}
            >
              <ActivityResource
                activity={activity}
                handleOpenScratchPad={handleOpenScratchPad}
              />
            </div>
            {/* Tabs */}
            <CourseTabDocument
              {...{
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
              }}
            />
            {/* Next/Prev Activities */}
            <ActivityPagination
              {...{ activity, sessionData }}
              focusOnly={focusOnlyQuiz.open || focusOnlyDiscussion}
            />

            <div
              className={clsx('rounded-xl bg-white p-6 shadow-small', {
                hidden: focusOnlyQuiz.open,
                'hidden md:block': !focusOnlyQuiz.open,
              })}
              data-aos={isMobileView ? undefined : ANIMATION.DATA_AOS}
            >
              <Discussion class_id={(router.query?.id as string) || ''} />
            </div>
          </div>
          <AssistiveTouch
            className={clsx('md:hidden', { hidden: focusOnlyDiscussion })}
            menuItems={listAssistive}
          />
          <BottomMenu
            className={focusOnlyDiscussion ? 'hidden' : 'hidden md:flex'}
          >
            <div className="flex items-center justify-center gap-5">
              <CardMenuItem
                title="Note List"
                icon={<DocumentTextIcon className="h-6 w-6" />}
                onClick={handleOpenNotesList}
              />
              <CardMenuItem
                title="Resource"
                icon={<ResourceIcon className="h-6 w-6" />}
                onClick={onOpenActivityResource}
                className="md:hidden"
              />
              <CardMenuItem
                title="Resource"
                icon={<ResourceIcon className="h-6 w-6" />}
                onClick={() => setOpenResource(true)}
                className="hidden md:flex"
              />
            </div>
            <Divider
              type="vertical"
              className="mx-6 my-auto hidden h-6 border-white text-white md:block"
              orientation="center"
            />
            <div className="hidden items-center justify-center gap-5 md:flex">
              <CardMenuItem
                title="Calculator"
                icon={<CalculatorIconV2 isActive className="h-6 w-6" />}
                onClick={() => {
                  handleOpenScratchPad({
                    type: 'calculator',
                  })
                }}
              />
              <CardMenuItem
                title="New Note"
                icon={<ScratchPadIconV2 isActive className="h-6 w-6" />}
                onClick={handleAddNote}
              />
            </div>
            <div className="flex items-center justify-center gap-5 md:hidden">
              {(currentVideo?.file?.resource?.time_line?.length as number) >
                0 && (
                <CardMenuItem
                  title="Timeline"
                  icon={<TimeLineIcon />}
                  onClick={onOpenVideoTimeline}
                />
              )}
              <CardMenuItem
                title="Discussion"
                icon={<DiscussionIcon className="h-6 w-6" />}
                onClick={onFocusDiscussion}
              />
            </div>
          </BottomMenu>

          {/* Sratchpad */}
          {openScratchPad.map((e, index) => {
            if (e.type === 'calculator') {
              return (
                <MovableWindow
                  key={e.id}
                  position={{
                    top: '30% - 150px',
                    left: '10px',
                  }}
                  className="lg:hidden"
                  zIndex={40}
                  fixed
                >
                  <div className="absolute left-0 top-0 h-full w-64 rounded-xl">
                    <div
                      className="flex h-fit w-full items-center justify-between rounded-t-xl border border-b-0 border-gray-300 bg-gray-100 px-4 py-3"
                      style={{
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="text-sm font-bold">Calculator</div>
                      <button onClick={() => handleCloseScratchPad(e)}>
                        <CloseModalIcon />
                      </button>
                    </div>
                    <Calculator isMobileCalc />
                  </div>
                </MovableWindow>
              )
            } else if (e.type === 'file') {
              return (
                <ModalResizeable
                  modalIndex={index}
                  bodyClassName="h-[100%]"
                  title={e.fileName}
                  width={650}
                  height={850}
                  key={e.id}
                  className="!z-40 h-full !rounded-lg"
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="center left"
                  header={
                    <div className="">
                      <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between px-5">
                        <div className="truncate">{e.fileName}</div>
                      </div>
                      <button
                        className="absolute right-3 top-2"
                        onClick={() => handleCloseScratchPad(e)}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  }
                >
                  <div
                    // className="overflow-auto p-4 bg-white"
                    className="h-full cursor-pointer select-none text-right text-base font-semibold text-gray-800 hover:text-primary"
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
                  className="!z-40"
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="center left"
                  header={
                    <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
                      <div className="text-sm font-semibold text-gray-800">
                        {`${exhibitText} ${(e?.index ?? 0) + 1}: ${e?.name}`}
                      </div>
                      <button
                        className="text-icon"
                        onClick={() => handleCloseScratchPad(e)}
                      >
                        <CloseIconNote />
                      </button>
                    </div>
                  }
                  draggableFull
                  modalIndex={e.index}
                >
                  <div className="h-full bg-white px-4 py-3">
                    <EditorReader
                      text_editor_content={e?.description}
                      className="w-full"
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
                  <Triangle className="absolute bottom-2 right-2" />
                </ModalResizeable>
              )
            }
          })}
        </div>
        <div className="sticky inset-x-0 bottom-4 z-50 hidden md:block">
          <div className="w-full">
            <CtaTrial />
          </div>
        </div>
        <BackToTop
          scrollContainerRef={scrollRef}
          className={clsx('!bottom-[230px] !right-4')}
        />
        <PopupLockContent
          showForm={openPopupCTA}
          setShowForm={setOpenPopupCTA}
        />
      </Layout>

      <LearningResource open={openResource} setOpenResource={setOpenResource} />

      {openVideoTimeline && (
        <VideoTimelineMobile
          open={openVideoTimeline}
          onClose={onCloseVideoTimeline}
          currentVideo={currentVideo}
        />
      )}
      <ActivityResourceMobile
        open={openActivityResource}
        onClose={onCloseActivityResource}
        activity={activity}
        handleOpenScratchPad={handleOpenScratchPad}
      />
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(ActivityPage)
