import { CircleCloseIcon, CloseIcon, HourglassIcon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import FileViewer from '@components/base/fileViewer/FileViewer'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import ResponsiveTextTruncate from '@components/common/ResponsiveTextTruncate'
import Layout from '@components/layout'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import CreateNote from '@components/mycourses/create-note/CreateNote'
import { CourseSectionType } from '@utils/constants'
import { trackGAEvent } from '@utils/google-analytics'
import { convertMinutesToHourFormat, truncateBySpace } from '@utils/index'

import { uniqueId } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import Tooltip from 'src/common/Tooltip'
import { ANIMATION, EXHIBIT_TEXT_REPLACE, PROGRAM } from 'src/constants'
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
import { IActivity } from 'src/type/course/my-course/Activity'
import LearningOutcome from '@components/learning/activity/LearningOutcome'
import ActivityResource from '@components/learning/activity/ActivityResource'
import CourseTabDocument from '@components/learning/activity/CourseTabDocument'
import clsx from 'clsx'
import { Triangle } from '@components/icons/Triangle'
import ActivityPagination from '@components/learning/activity/ActivityPagination'
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

  const { data: activity, isLoading } = useGetActivityById(
    router.query.activityId,
    router.query.id,
  )

  const courseId = router.query?.id
  const sectionId = router.query?.activityId as string

  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )
  const isFinishRef = useRef<boolean>(false)
  const [isHasQuizGrading, setIsHasQuizGrading] = useState(false)
  const [videoClicked, setVideoClicked] = useState<Array<VideoStateClicked>>([])
  const [isDoneActivity, setIsDoneActivity] = useState(false)
  const [focusOnlyQuiz, setFocusOnlyQuiz] = useState<IFocusQuiz>({
    open: false,
    id: '',
  })

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [fetch_progress, setFetch_progress] = useState<string[]>([])
  const [exhibitsPopupPosition, setExhibitsPopupPosition] = useState({
    top: 'calc(50% - 250px)',
    left: 'calc(50% - 200px)',
  })
  const [exhibitText, setExhibitText] = useState<string>('')

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
        dispatch(getDiscussion({ id: router.query.id, sectionId: sectionId }))
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
    dispatch(clearNote())
    dispatch(closeCalculator())
  }, [dispatch, router.asPath])

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
    if (response?.data?.progress?.is_completed) {
      setTimeout(() => {
        dispatch(showPopupCompletedCourse(response?.data?.progress?.content))
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

  const chapterId = breadcrumbsMenu?.data?.find(
    (e: IBreadCrumbs) => e?.course_section_type === CourseSectionType.CHAPTER,
  )?.id

  /**
   * @description config menu breadcrumbs trong activity
   */
  const BreadCrumbs = () => (
    <>
      {breadcrumbsMenu?.data &&
        breadcrumbsMenu?.data?.map((e: IBreadCrumbs) => {
          let url = ''
          const urlCourseDetail = `/courses/${router.query.id}/section/${partId}`
          switch (e.course_section_type) {
            case 'PART':
              url = urlCourseDetail
              break
            case 'CHAPTER':
              url = urlCourseDetail
              break
            case 'UNIT':
              url = urlCourseDetail
              break
            case 'ACTIVITY':
              url = '#'
              break
            default:
              url = `/courses/my-course/${router.query.id}`
              break
          }

          return (
            <React.Fragment key={e?.id}>
              {e?.course_section_type !== 'ACTIVITY' ? (
                <li
                  title={e?.name}
                  onClick={() => {
                    ;['CHAPTER', 'UNIT', 'PART'].includes(
                      e.course_section_type,
                    ) && localStorage.setItem('course_chapter_id', chapterId)
                    router.push(url)

                    trackGAEvent(`Click Breadcrumb ${nameActivity?.name}`)
                  }}
                >
                  <Tooltip title={e?.name} showTooltip={e?.name?.length > 45}>
                    <li
                      className={
                        ' cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[#A1A1A1] hover:text-primary'
                      }
                      title={e?.name}
                    >
                      {truncateBySpace(e.name, 3) + '/'}
                    </li>
                  </Tooltip>
                </li>
              ) : null}
            </React.Fragment>
          )
        })}
    </>
  )

  /**
   * @description biến này để lấy name của activity
   */
  const nameActivity = breadcrumbsMenu?.data?.find(
    (breadcumb: IBreadCrumbs) => breadcumb?.course_section_type === 'ACTIVITY',
  )

  const [sessionData, setSessionData] = useState<Array<any>>([])

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
      <Layout title="Activity">
        <div className={`mx-auto my-0 max-w-[1144px] text-[#050505]`}>
          {/* Breadcrumbs */}
          <ul
            className={clsx(
              'line-clamp-1 flex overflow-x-auto py-6 pb-8 text-sm font-medium',
              { hidden: focusOnlyQuiz.open },
            )}
          >
            <BreadCrumbs />
            <Tooltip title={nameActivity?.name}>
              <li className="responsive-truncate-container text-[#050505]">
                <Link
                  href={'#'}
                  className="breadcrumbs__link"
                  scroll={false}
                  onClick={() =>
                    trackGAEvent(`Click Breadcrumb ${nameActivity?.name}`)
                  }
                >
                  <ResponsiveTextTruncate text={nameActivity?.name ?? ''} />
                </Link>
              </li>
            </Tooltip>
          </ul>
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
                    width: '400px',
                    height: '300px',
                    top: 'calc(25% - 150px)',
                    left: 'calc(25% - 200px)',
                  }}
                  zIndex={500}
                  fixed
                >
                  <div className="absolute left-0 top-0  h-full w-full">
                    <div className="flex h-10 w-full items-center justify-between rounded-t-md bg-[#DCDDDD] px-5">
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
            data-aos={ANIMATION.DATA_AOS}
            className="mb-6 flex flex-col gap-6"
          >
            {/* Header */}
            <div
              className={clsx(
                `flex w-full select-none items-center justify-between gap-4`,
                { hidden: focusOnlyQuiz.open },
              )}
            >
              <div className="text-bw-13 text-2xl font-medium">
                <Tooltip title={activity?.name?.length > 95 && activity?.name}>
                  {activity?.name}
                </Tooltip>
              </div>
              <div className="text-bw-13 flex items-center gap-1 whitespace-nowrap text-sm">
                <HourglassIcon />
                <div>{`${convertMinutesToHourFormat(activity?.duration || 0)} estimated`}</div>
              </div>
            </div>

            {/* Learning Outcome */}
            <div className={clsx({ hidden: focusOnlyQuiz.open })}>
              <LearningOutcome activity={activity} />
            </div>

            {/* Activity Resource */}
            <div className={clsx({ hidden: focusOnlyQuiz.open })}>
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
              }}
            />
            {/* Next/Prev Activities */}
            <ActivityPagination
              {...{ activity, sessionData }}
              focusOnlyQuiz={focusOnlyQuiz.open}
            />

            <div
              className={clsx(
                'rounded-xl bg-white p-6 shadow-learning-activity',
                { hidden: focusOnlyQuiz.open },
              )}
              data-aos={ANIMATION.DATA_AOS}
            >
              <Discussion class_id={(router.query.id as string) || ''} />
            </div>
          </div>

          {/* Sratchpad */}
          {openScratchPad.map((e) => {
            if (e.type === 'file') {
              return (
                <ModalResizeable
                  title={e.fileName}
                  width={650}
                  height={850}
                  key={e.id}
                  className="!z-40"
                  dragHandleClassName="modal-header"
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="bottom left"
                >
                  <div
                    // className="overflow-auto p-4 bg-white"
                    style={{ height: 'calc(100% - 40px' }}
                    className="mb-2 cursor-pointer select-none text-right text-base font-semibold text-[#050505] hover:text-primary"
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
                  dragHandleClassName="modal-header"
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="bottom left"
                  header={
                    <div className="relative mb-3 px-6">
                      <div className="modal-header flex w-full items-center justify-between rounded-xl bg-white">
                        <div className="truncate">
                          <span className="text-base font-semibold text-[#050505]">{`${exhibitText} ${
                            e?.index + 1
                          }: ${e?.name}`}</span>
                        </div>
                      </div>
                      <button
                        className="absolute right-6 top-0"
                        onClick={() => handleCloseScratchPad(e)}
                      >
                        <CircleCloseIcon />
                      </button>
                    </div>
                  }
                >
                  <div className="h-full bg-white">
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
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(ActivityPage)
