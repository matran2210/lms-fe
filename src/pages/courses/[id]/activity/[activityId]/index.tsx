import { CloseIcon, DownloadIcon, LinkIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import EditorReader from '@components/base/editor/EditorReader'
import PdfViewer from '@components/base/pdf/pdf-viewer'
import MovableWindow from '@components/base/window'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import CreateNote from '@components/mycourses/create-note/CreateNote'
import { truncateString } from '@utils/index'
import { uniqueId } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityAction,
  courseActivityReducer,
  getCourseActivityTapById,
  getDiscussion,
  closeCalculator,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { resetQuizActivity } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'
import { clearNote } from 'src/redux/slice/Course/NotesList'
import { IActivity } from 'src/type/course/my-course/Activity'
import { Dropdown, Menu } from 'antd'
import Calculator from '@components/calculator'
import { ANIMATION } from 'src/constants'
import SappTooltip from 'src/common/SappTooltip'
import CourseAPI, { CoursesAPI, getActivityById } from 'src/pages/api/courses'
import SAPPBorder from 'src/common/SAPPBorder'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'

// type Props = {
//   activity: IActivity
//   courseId: string
//   sectionId: string
// }

interface IBreadCrumbs {
  course_section_type: 'PART' | 'CHAPTER' | 'UNIT' | 'ACTIVITY'
  id: string
  name: string
  parent_id: string
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
      },
    )
  }

  const { data: activity, isLoading } = useGetActivityById(
    router.query.activityId,
    router.query.id,
  )

  const courseId = router.query?.id
  const sectionId = router.query?.activityId

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
  const activityType = activity?.display_icon
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  // const [openPdf, setOpenPdf] = useState<{ status: boolean; url: string }>()
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [viewActivity, setViewActivity] = useState<boolean>(true)

  const [exhibitsPopupPosition, setExhibitsPopupPosition] = useState({
    top: 'calc(50% - 250px)',
    left: 'calc(50% - 200px)',
  })

  useLayoutEffect(() => {
    if (activity) {
      dispatch(resetQuizActivity({}))
      try {
        dispatch(courseActivityAction.setActivityState(activity))
        dispatch(getDiscussion({ id: router.query.id, sectionId: sectionId }))
        // ;(async () => {
        //   await CourseActivityApi.startCourseSectionProgress(
        //     courseId,
        //     sectionId,
        //   )
        // })()
      } catch (error) {}
    }

    return () => {
      dispatch(courseActivityAction.resetActivity())
      dispatch(resetQuizActivity({}))
    }
  }, [activity])
  const closePreview = () => {
    setViewActivity(false)
  }

  // const getBreadcrumb = (breadcumb: IBreadcrumb[]) => {
  //   return breadcumb
  // }

  useEffect(() => {
    setTimeout(() => {
      finishedCourseSectionProgress()
    }, 500)
  }, [
    endActivityRef.current,
    quizDocumentRef.current,
    observerRef.current,
    videoRef.current,
  ])

  // Clear notes & calculator
  useEffect(() => {
    dispatch(clearNote())
    dispatch(closeCalculator())
  }, [router.asPath])

  /**
   * Hàm xử lý khi kết thúc tiến trình của phần khóa học.
   */
  const finishedCourseSectionProgress = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      // Xử lý khi chỉ có video và tham chiếu đến streamRef hiện tại
      if (activityType === 'VIDEO' && videoRef?.current) {
        for (let e of videoRef.current) {
          e.addEventListener('playing', async () => {
            await handleFinishedCourseSectionProgress()
          })
        }
        return
      }
      // Xử lý khi chỉ có bài kiểm tra và tham chiếu đến quizDocumentRef hiện tại
      else if (
        activityType === 'QUIZ' ||
        activityType === 'PAST_EXAM_ANALYSIS'
      ) {
        await handleFinishedCourseSectionProgress()
        return
      }

      // Xử lý khi có tham chiếu đến endActivityRef hiện tại
      else if (endActivityRef.current && activityType === 'TEXT') {
        // Hủy theo dõi nếu đã có observerRef.current
        if (observerRef.current) {
          observerRef.current?.unobserve(endActivityRef.current)
        }

        // Thiết lập các tùy chọn cho IntersectionObserver
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        }

        // Hàm xử lý khi có sự giao thoa
        const handleIntersection = async (
          entries: IntersectionObserverEntry[],
        ) => {
          const isVisible = entries[0].isIntersecting

          // Nếu phần tử trở nên nhìn thấy và có tham chiếu đến endActivityRef hiện tại
          if (isVisible && endActivityRef.current) {
            observerRef.current?.unobserve(endActivityRef.current)
            await handleFinishedCourseSectionProgress()
          }
        }

        // Tạo một instance mới của IntersectionObserver và đặt các tùy chọn
        observerRef.current = new IntersectionObserver(
          handleIntersection,
          options,
        )

        // Bắt đầu theo dõi nếu có tham chiếu đến endActivityRef hiện tại
        if (endActivityRef.current) {
          observerRef.current?.observe(endActivityRef.current)
        }

        // Trả về hàm cleanup
        return () => {
          if (endActivityRef.current) {
            observerRef.current?.unobserve(endActivityRef.current)
          }
        }
      }
    }, 300)
  }

  /**
   * Hàm xử lý khi kết thúc tiến trình phần của khóa học.
   */
  const handleFinishedCourseSectionProgress = async () => {
    if (!isFinishRef.current) {
      await CoursesAPI.startCourseSectionProgress(courseId, sectionId)
      isFinishRef.current = true
    }
  }

  /**
   * Hàm để lấy ActivityType dựa trên document type.
   * @param {IActivity} activityReducer - activity.
   * @returns {string} - ActivityType.
   */
  // function getActivityType(activityReducer: IActivity): string {
  //   const tabs = activityReducer.tabs
  //   let hasVideo = false
  //   let hasQuiz = false
  //   if (!tabs?.[0]) {
  //     return ACTIVITY_TYPE.NONE
  //   }
  //   for (const tab of tabs) {
  //     const documents = tab.course_tab_documents

  //     if (documents) {
  //       for (const document of documents) {
  //         if (document.type === 'QUIZ') {
  //           hasQuiz = true
  //         } else if (document.type === 'VIDEO') {
  //           hasVideo = true
  //         }
  //       }
  //     }
  //   }

  //   if (hasVideo && hasQuiz) {
  //     return ACTIVITY_TYPE.BOTH
  //   } else if (hasVideo) {
  //     return ACTIVITY_TYPE.ONLY_VIDEO
  //   } else if (hasQuiz) {
  //     return ACTIVITY_TYPE.ONLY_QUIZ
  //   } else {
  //     return ACTIVITY_TYPE.NONE
  //   }
  // }

  /**
   * Hàm xử lý khi thay đổi tab.
   * @param {string} id - ID của tab.
   */
  const handleChangeTab = (id: string) => {
    try {
      dispatch(getCourseActivityTapById({ id }))
      setActiveButtonId(id)
    } catch (error) {}
  }

  /**
   * Hàm để xác định màu tab active.
   * @param {string} id - ID của tab.
   * @returns {string} - Màu tab.
   */
  const tabButtonColor = (id: string) => {
    let currentTabId
    if (selector.loading) {
      currentTabId = activeButtonId
    } else {
      currentTabId = selector.currentTabId
    }
    return id === currentTabId ? 'primary' : 'white'
  }

  /**
   * Giá trị được memoized cho course_tab_documents.
   */
  const course_tab_documents = useMemo(() => {
    return selector.tabs?.find((e) => e?.id === selector.currentTabId)
      ?.course_tab_documents
  }, [selector.tabs])

  /**
   * Hàm để lấy ID của tab trước đó.
   * @returns {string | undefined} - ID của tab trước đó.
   */
  const getPreviousTabId = () => {
    const currentIndex = selector.tabs?.findIndex(
      (tab) => tab?.id === selector.currentTabId,
    )
    const previousIndex = (currentIndex || 0) - 1
    return selector.tabs?.[previousIndex]?.id
  }

  /**
   * Hàm để lấy ID của tab tiếp theo.
   * @returns {string | undefined} - ID của tab tiếp theo.
   */
  const getNextTabId = () => {
    const currentIndex = selector.tabs?.findIndex(
      (tab) => tab?.id === selector.currentTabId,
    )
    const nextIndex = (currentIndex || 0) + 1
    return selector.tabs?.[nextIndex]?.id
  }
  const lengthDoc = course_tab_documents?.length || 0
  const handleOpenScratchPad = (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event) {
      var mouseY = event.pageY - 300
      setExhibitsPopupPosition({ top: mouseY + 'px', left: '33%' })
    }

    setOnFocusingPad('')
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      if (data.type === 'file') {
        arr.push({
          type: data.type,
          file: file,
          id: uniqueId('file'),
          fileName: fileName,
        })
      } else if (data.type === 'exhibits') {
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
      const newArr = arr.filter((e) => e?.id !== pad?.id)
      return newArr
    })
  }
  const getCourseIcon = (type: String) => {
    if (type === 'TEXT') {
      return <SappIcon icon="course_text"></SappIcon>
    }
    if (type === 'VIDEO') {
      return <SappIcon icon="course_video"></SappIcon>
    }
    if (type === 'PAST_EXAM_ANALYSIS') {
      return <SappIcon icon="course_past_exam_analysis"></SappIcon>
    }
    if (type === 'QUIZ') {
      return <SappIcon icon="course_quiz"></SappIcon>
    }
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

  /**
   * @description config menu breadcrumbs trong activity
   */
  const menu = (
    <Menu>
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
                <Menu.Item onClick={() => router.push(url)}>
                  <li
                    className={
                      'hover:text-primary cursor-pointer line-clamp-1 text-gray-1'
                    }
                    title={e?.name}
                  >
                    <Link href={url}>
                      <span
                        className={
                          'hover:text-primary cursor-pointer line-clamp-1 text-gray-1'
                        }
                      >
                        {truncateString(e?.name, 25)}
                      </span>
                    </Link>
                  </li>
                </Menu.Item>
              ) : null}
            </React.Fragment>
          )
        })}
    </Menu>
  )

  /**
   * @description biến này để lấy name của activity
   */
  const nameActivity = breadcrumbsMenu?.data?.find(
    (breadcumb: IBreadCrumbs) => breadcumb.course_section_type === 'ACTIVITY',
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

  // Tạo một mảng chứa các id của các hoạt động từ sessionData
  const activityIds = sessionData?.map((activity: IActivity) => activity.id)

  // Lấy id của hoạt động tiếp theo
  const nextActivityId = activity?.next_activity?.id

  // Tìm vị trí của hoạt động tiếp theo trong mảng activityIds
  const nextActivityIndex = activityIds?.indexOf(
    nextActivityId || router.query.activityId,
  )

  const idNextActivity = activity?.next_activity
    ? activity?.next_activity?.id
    : activityIds[nextActivityIndex + 1]

  // Lấy id của hoạt động trước đó
  const previousActivityId = activity?.previous_activity?.id

  // Tìm vị trí của hoạt động trước đó trong mảng activityIds
  const previousActivityIndex = activityIds?.indexOf(
    previousActivityId || router.query.activityId,
  )

  const idPreviousActivity =
    activity?.previous_activity?.id || activityIds[previousActivityIndex - 1]

  const findActivityByIndex = (previousIndex: number) => {
    return sessionData?.find(
      (activity: IActivity) => activity?.id === activityIds[previousIndex],
    )
  }

  const download = async (name: string, file_key: string) => {
    await CourseAPI.downloadResource({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }

  const idPreviousActivity =
    activity?.previous_activity?.id || activityIds[previousActivityIndex - 1]

  const idNextActivity = activity?.next_activity
    ? activity?.next_activity?.id
    : activityIds[nextActivityIndex + 1]

  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className={`text-bw-1 max-w-xxl my-0 mx-auto`}>
        <ul className="py-6 flex flex-wrap gap-1 line-clamp-1 overflow-x-auto text-medium-sm font-medium">
          <li className="hover:text-primary cursor-pointer text-gray-1 whitespace-nowrap">
            <Link href="/courses" className="breadcrumbs__link" scroll={false}>
              My Course /
            </Link>
          </li>

          <Dropdown overlay={menu} trigger={['click']}>
            <a
              className="ant-dropdown-link cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              ..... /
            </a>
          </Dropdown>
          <li className="text-bw-1">
            <Link href={'#'} className="breadcrumbs__link" scroll={false}>
              <span>{nameActivity?.name}</span>
            </Link>
          </li>
        </ul>
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
                zIndex={1400}
                fixed
              >
                <div className="absolute h-full w-full  top-0 left-0 border">
                  <div className="flex w-6-percent items-center bg-gray-2 w-full h-10 justify-between px-5">
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
        <div className="shadow-activity" data-aos={ANIMATION.DATA_AOS}>
          <div className="bg-gray-3 px-6 ">
            <div
              className={`flex justify-between w-full gap-4 py-6 select-none ${
                activity?.course_outcomes?.length > 0
                  ? 'border-b borderColor-default'
                  : ''
              }`}
            >
              <div className="font-medium text-2xl ">{activity?.name}</div>
              <div className="text-sm text-gray-1 whitespace-nowrap">
                {activity?.duration || 0}{' '}
                {activity?.duration > 1 ? 'mins' : 'min'} estimated
              </div>
            </div>

            {activity?.course_outcomes?.length > 0 && (
              <div className={`pt-6 pb-4`}>
                <div className="font-semibold text-base mb-2 select-none">
                  Learning Outcome:
                </div>
                <ul className="list-disc text-base ml-3 select-none">
                  {activity?.course_outcomes?.map((e: any) => {
                    return (
                      <li className="ml-4" key={e?.id}>
                        <EditorReader
                          className="editor-wrap mt-1.5"
                          text_editor_content={e.description}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-3">
            <div className="flex gap-2 px-6 flex-wrap">
              {selector.tabs?.map((e) => {
                return (
                  <SappButton
                    key={e?.id}
                    size="small"
                    className="py-2.5 !px-3 text-medium-sm !font-normal"
                    color={tabButtonColor(e?.id)}
                    title={truncateString(e?.name, 60)}
                    onClick={() => handleChangeTab(e?.id)}
                  ></SappButton>
                )
              })}
            </div>
          </div>

          {/* <FadeInOut show={!selector.loading}> */}
          {!!course_tab_documents?.length && (
            <div className="bg-white pb-6 mb-6">
              <div className={`pt-6 max-w-[1000px] w-full my-0 mx-auto px-6`}>
                <div className="tab-content overflow-x-auto">
                  {course_tab_documents?.map((e, i) => {
                    const marginBottom =
                      i < course_tab_documents?.length - 1 ? 'mb-6' : ''
                    if (e.type === 'QUIZ') {
                      return (
                        <div
                          className={marginBottom}
                          key={e?.id + '_' + i + '_' + selector.currentTabId}
                          ref={quizDocumentRef}
                        >
                          <QuizDocument
                            questions={[
                              ...(e.quiz?.multiple_choice_questions || []),
                              ...(e.quiz?.constructed_questions || []),
                            ]}
                            activityId={activity?.id as string}
                            tabId={selector.currentTabId || ''}
                            quizId={e?.quiz?.id || ''}
                            grading_preference={
                              e.quiz?.grading_preference ||
                              'AFTER_EACH_QUESTION'
                            }
                            document_id={e?.id}
                            is_graded={e?.quiz?.is_graded || false}
                            setOpenFile={handleOpenScratchPad}
                            class_user_id={activity?.class_user_id}
                          ></QuizDocument>
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
                            handleProcess={handleFinishedCourseSectionProgress}
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
                      className={`pt-8 ${
                        getPreviousTabId() ? 'pb-4' : 'pb-0'
                      } `}
                    >
                      <div className="font-semibold text-base">Resource:</div>
                      <ul className="list-disc text-base">
                        {activity?.files.map((e: any, index: number) => {
                          return (
                            <div
                              className={`flex justify-between group cursor-pointer ${
                                index === 0 ? 'mt-4' : 'mt-5'
                              }`}
                              key={index}
                            >
                              <div className="flex">
                                <div className="mr-2 group-hover:text-primary flex self-center">
                                  <LinkIcon />
                                </div>
                                <div
                                  className="cursor-pointer text-gray-1 group-hover:text-primary"
                                  onClick={() => {
                                    handleOpenScratchPad(
                                      {
                                        type: 'file',
                                      },
                                      e.resource.url,
                                      e?.resource?.name,
                                    )
                                  }}
                                >
                                  {e?.resource?.name}
                                </div>
                              </div>
                              <a
                                onClick={() =>
                                  download(
                                    e?.resource?.name,
                                    e?.resource?.file_key,
                                  )
                                }
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

                <div className="flex justify-between flex-wrap gap-5 mt-8">
                  {getPreviousTabId() && (
                    <div className="w-auto">
                      <div className="relative">
                        <div
                          onClick={() =>
                            handleChangeTab(getPreviousTabId() || '')
                          }
                          className="flex relative z-10 items-center gap-2 mb-2 group text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary"
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
                    <div className="w-auto relative ml-auto">
                      <div className="relative">
                        <div
                          onClick={() => handleChangeTab(getNextTabId() || '')}
                          className="mb-2 relative z-10 items-center flex gap-2 group text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary text-right"
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
                        <div className="absolute bottom-0 left-0 h-2.5 w-[98px] bg-gray-3 -translate-x-1"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {!course_tab_documents?.length && <div className="py-3"></div>}
        </div>
        {/* </FadeInOut> */}
        {(activity?.previous_activity ||
          activity?.next_activity ||
          (nextActivityIndex !== -1 &&
            nextActivityIndex !== sessionData?.length - 1) ||
          (previousActivityIndex !== -1 && previousActivityIndex !== 0)) && (
          <div data-aos={ANIMATION.DATA_AOS}>
            <div className="bg-white shadow-activity px-6 py-3 mb-6 relative border-b-primary-2 border-b-2">
              <div
                className={`flex flex-nowrap gap-5 justify-${
                  activity?.previous_activity ||
                  (previousActivityIndex !== -1 && previousActivityIndex !== 0)
                    ? 'between'
                    : 'end'
                }`}
              >
                {(activity?.previous_activity ||
                  (previousActivityIndex !== -1 &&
                    previousActivityIndex !== 0)) && (
                  <div className="w-1/2">
                    <div
                      onClick={async () => {
                        router.push({
                          pathname: `/courses/${router.query.id}/activity/${idPreviousActivity}`,
                        })
                        await CoursesAPI.startCourseSectionProgress(
                          router?.query?.id,
                          activity?.previous_activity?.id ||
                            activityIds[previousActivityIndex - 1],
                        )
                      }}
                      className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary whitespace-nowrap"
                    >
                      Previous Activity
                    </div>
                    <div className="text-medium-sm text-gray-1 flex">
                      {getCourseIcon(
                        activity?.previous_activity
                          ? activity?.previous_activity?.display_icon
                          : findActivityByIndex(previousActivityIndex - 1)
                              ?.display_icon,
                      )}
                      <SappTooltip
                        title={
                          activity?.previous_activity
                            ? activity?.previous_activity.name
                            : findActivityByIndex(previousActivityIndex - 1)
                                ?.name
                        }
                      >
                        <span className="ml-2 w-full overflow-hidden text-ellipsis line-clamp-1">
                          {activity?.previous_activity
                            ? activity?.previous_activity.name
                            : findActivityByIndex(previousActivityIndex - 1)
                                ?.name}
                        </span>
                      </SappTooltip>
                    </div>
                  </div>
                )}
                {!activity?.previous_activity && <></>}
                {(activity?.next_activity ||
                  (nextActivityIndex !== -1 &&
                    nextActivityIndex !== sessionData?.length - 1)) && (
                  <div className="w-1/2">
                    <div
                      onClick={async () => {
                        router.push({
                          pathname: `/courses/${router.query.id}/activity/${idNextActivity}`,
                        })
                        await CoursesAPI.startCourseSectionProgress(
                          router?.query?.id,
                          idNextActivity,
                        )
                      }}
                      className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary text-right"
                    >
                      Next Activity
                    </div>
                    <div className="text-medium-sm text-gray-1 flex justify-end">
                      <SappTooltip
                        title={
                          activity?.next_activity
                            ? activity?.next_activity.name
                            : findActivityByIndex(nextActivityIndex + 1)?.name
                        }
                      >
                        <span className="mr-2 w-full overflow-hidden text-ellipsis line-clamp-1 text-end">
                          {activity?.next_activity
                            ? truncateString(activity?.next_activity.name, 80)
                            : truncateString(
                                findActivityByIndex(nextActivityIndex + 1)
                                  ?.name,
                                80,
                              )}
                        </span>
                      </SappTooltip>
                      {getCourseIcon(
                        activity?.next_activity
                          ? activity?.next_activity?.display_icon
                          : findActivityByIndex(nextActivityIndex + 1)
                              ?.display_icon,
                      )}
                    </div>
                  </div>
                )}
                {!activity?.next_activity && <></>}
              </div>
            </div>
          </div>
        )}

        <div ref={endActivityRef}></div>
        <div className="shadow-activity" data-aos={ANIMATION.DATA_AOS}>
          <Discussion class_id={(router.query.id as string) || ''} />
        </div>
        {openScratchPad.map((e, index: number) => {
          if (e.type === 'file') {
            return (
              <MovableWindow
                position={{
                  width: '595px',
                  height: '842px',
                  top: 'calc(50% - 421px)',
                  left: 'calc(50% - 300px)',
                }}
                key={e?.id}
                onClick={() => setOnFocusingPad(e?.id)}
                zIndex={
                  onFocusingPad === e?.id
                    ? openScratchPad.length + 1400
                    : index + 1400
                }
                fixed
                // not_resizable
                // className='pointer-events-none'
              >
                <div className="absolute h-full w-full  top-0 left-0 border">
                  <div className="flex items-center bg-gray-2 w-full h-10 justify-between px-5">
                    <div className="text-sm font-normal truncate">
                      {e.fileName}
                    </div>
                    {/* <CloseIcon */}
                    <button onClick={() => handleCloseScratchPad(e)}>
                      <CloseIcon />
                    </button>
                  </div>
                  <div
                    className="overflow-auto p-4 bg-white"
                    style={{ height: 'calc(100% - 40px' }}
                  >
                    {/* <div className='flex flex-'> */}
                    <PdfViewer file={e.file} />
                  </div>
                  {/* </div> */}
                </div>
              </MovableWindow>
            )
          } else if (e.type === 'exhibits') {
            return (
              <MovableWindow
                position={{
                  width: '600px',
                  height: '400px',
                  top: exhibitsPopupPosition.top,
                  left: exhibitsPopupPosition.left,
                }}
                key={e?.id}
                onClick={() => setOnFocusingPad(e?.id)}
                zIndex={
                  onFocusingPad === e?.id
                    ? openScratchPad.length + 1400
                    : index + 1400
                }
              >
                <div className="absolute h-full w-full  top-0 left-0 border">
                  <div className="flex w-6-percent items-center bg-white w-full h-10 justify-between px-5">
                    <div className="truncate">
                      <span className="font-semibold text-base text-bw-1">{`Exhibit ${
                        e?.index + 1
                      }: `}</span>
                      {e?.name}
                    </div>
                    <button onClick={() => handleCloseScratchPad(e)}>
                      <CloseIcon />
                    </button>
                  </div>
                  <div className="bg-white h-[calc(100%-40px)] overflow-auto p-5">
                    <EditorReader
                      text_editor_content={e?.description}
                      className=" w-full "
                    />
                    {e?.files?.length > 0 &&
                      e?.files.map((e: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="cursor-pointer text-state-info hover:underline"
                            onClick={() =>
                              handleOpenScratchPad(
                                { type: 'file' },
                                e.resource.url,
                                e?.resource?.name,
                              )
                            }
                          >
                            {e?.resource?.name}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </MovableWindow>
            )
          }
        })}
        {/* <PopupViewPdf
        open={openPdf?.status || false}
        setOpen={setOpenPdf}
        url={openPdf?.url || ''}
      /> */}
      </div>
    </SappLoadingGlobal>
  )
}

export default ActivityPage

/**
 * Hàm props phía máy chủ cho thành phần ActivityPage.
 * @param {Object} context - Đối tượng context phía máy chủ.
 * @returns {Object} - Props phía máy chủ.
 */
// export async function getServerSideProps(context: any) {
//   const { req, res, query } = context

//   // Lấy accessToken từ cookie
//   const accessToken = req.cookies.accessToken

//   // Kiểm tra accessToken
//   if (!accessToken) {
//     // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//     }
//   }

//   try {
//     const { req } = context

//     // Parse cookies from the request headers
//     const cookies = parse(req.headers.cookie || '')

//     if (!context?.query?.activityId) {
//       return {
//         notFound: true,
//       }
//     }

//     const activity = await CourseActivityApi.getActivityById(
//       context?.query?.activityId,
//       context?.query.id,
//       cookies.accessToken,
//     )

//     return {
//       props: {
//         activity,
//         courseId: context.query?.id,
//         sectionId: context.query?.activityId,
//       },
//     }
//   } catch (error: any) {
//     // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
//     if (error.response && error.response.status === 401) {
//       // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
//       const refreshToken = req.cookies.refreshToken

//       try {
//         const refreshResponse = await axios.post(
//           `${apiURL}/auth/rotate`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${refreshToken}`,
//             },
//           },
//         )
//         // Lưu accessToken mới vào cookie
//         const userInfo = refreshResponse?.data?.data?.tokens
//         const act = userInfo?.act
//         const rft = userInfo?.rft
//         // Save the new access token to the AsyncStorage
//         if (typeof window !== 'undefined') {
//           await AsyncStorage.setItem('accessToken', act)
//           await AsyncStorage.setItem('refreshToken', rft)
//         }
//         setCookieActToken(act)
//         setCookieRefreshToken(rft)
//         res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)

//         // Tiếp tục thực hiện yêu cầu API với accessToken mới
//         const activity = await CourseActivityApi.getActivityById(
//           context?.query?.activityId,
//           context?.query.id,
//           act,
//         )

//         return {
//           props: {
//             activity,
//             courseId: context.query?.id,
//             sectionId: context.query?.activityId,
//           },
//         }
//       } catch (refreshError) {
//         removeJwtToken()
//         // Xử lý lỗi khi cập nhật accessToken từ refreshToken
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//       }
//     } else {
//       // Xử lý lỗi khác khi sử dụng accessToken

//       // Chuyển hướng đến trang đăng nhập
//       return {
//         redirect: {
//           destination: '/404',
//           permanent: false,
//         },
//       }
//     }
//   }
// }
