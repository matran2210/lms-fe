import SappButton from '@components/base/button/SappButton'
import EditorReader from '@components/base/editor/EditorReader'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import CreateNote from '@components/mycourses/create-note/CreateNote'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeJwtToken } from '@utils/helpers/authen'
import {
  setCookieActToken,
  setCookieRefreshToken,
  truncateString,
} from '@utils/index'
import axios from 'axios'
import { parse } from 'cookie'
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
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { apiURL } from 'src/redux/services/httpService'
import {
  courseActivityAction,
  courseActivityReducer,
  getCourseActivityTapById,
  getDiscussion,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { clearNote } from 'src/redux/slice/Course/NotesList'
import { IActivity, IBreadcrumb } from 'src/type/course/my-course/Activity'
import { StreamPlayerApi } from '@cloudflare/stream-react'
import { resetQuizActivity } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

type Props = {
  activity: IActivity
  courseId: string
  sectionId: string
}

const ActivityPage = ({ activity, courseId, sectionId }: Props) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const getNotesData = useAppSelector(
    (state) => state.notesListReducer?.note_data,
  )
  const [activeButtonId, setActiveButtonId] = useState<string>()
  const endActivityRef = useRef<HTMLDivElement>(null)
  const quizDocumentRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<StreamPlayerApi>(null)
  const videoRef = useRef<any>(null)
  const observerRef = useRef<IntersectionObserver>()
  const isFinishRef = useRef<boolean>(false)
  const router = useRouter()
  const activityType = activity?.display_icon
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useLayoutEffect(() => {
    if (activity) {
      dispatch(resetQuizActivity({}))
      try {
        dispatch(courseActivityAction.setActivityState(activity))
        dispatch(
          getDiscussion({ id: router.query.classId, sectionId: sectionId }),
        )
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
    streamRef.current,
    videoRef.current,
  ])

  // Clear notes
  useEffect(() => {
    dispatch(clearNote())
  }, [])

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
      await CourseActivityApi.startCourseSectionProgress(courseId, sectionId)
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
    return selector.tabs?.find((e) => e.id === selector.currentTabId)
      ?.course_tab_documents
  }, [selector.tabs])

  /**
   * Hàm để lấy ID của tab trước đó.
   * @returns {string | undefined} - ID của tab trước đó.
   */
  const getPreviousTabId = () => {
    const currentIndex = selector.tabs?.findIndex(
      (tab) => tab.id === selector.currentTabId,
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
      (tab) => tab.id === selector.currentTabId,
    )
    const nextIndex = (currentIndex || 0) + 1
    return selector.tabs?.[nextIndex]?.id
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

  return (
    <div className={`text-bw-1 max-w-xxl my-0 mx-auto`}>
      <ul className="py-6 flex flex-wrap gap-1">
        <li className="hover:text-primary cursor-pointer text-gray-1">
          <Link href="/courses" className="breadcrumbs__link" scroll={false}>
            My Course
          </Link>
        </li>
        {activity.breadcumb?.map((e, i) => {
          let url = ''
          switch (e.course_section_type) {
            case 'PART':
              url = `/courses/${activity.breadcumb?.[0]?.id}/section/${e?.id}`
              break
            case 'CHAPTER':
              url = `/courses/${activity.breadcumb?.[0]?.id}/section/${activity.breadcumb?.[1]?.id}?unit_id=${e?.id}`
              break
            case 'UNIT':
              url = `/courses/${activity.breadcumb?.[0]?.id}/section/${activity.breadcumb?.[1]?.id}?unit_id=${activity.breadcumb?.[2]?.id}`
              break
            case 'ACTIVITY':
              url = `#`
              break
            default:
              url = `/courses/my-course/${e?.id}`
              break
          }
          return (
            <React.Fragment key={e.id}>
              <span className="text-gray-1">/</span>
              <li
                className={`${
                  (activity.breadcumb?.length || 0) - 1 === i
                    ? 'text-bw-1'
                    : 'hover:text-primary cursor-pointer text-gray-1'
                }`}
              >
                <Link href={url} className="breadcrumbs__link" scroll={false}>
                  {truncateString(e.name, 30)}
                </Link>
              </li>
            </React.Fragment>
          )
        })}
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
      </>
      <div className="bg-gray-3 px-6 ">
        <div className="flex justify-between w-full gap-4 py-6  border-b border-gray-2 bg-none">
          <div className="font-medium text-2xl ">{activity.name}</div>
          <div className="text-base text-gray-1 whitespace-nowrap">
            {activity?.duration || 0} min estimated
          </div>
        </div>

        <div className="h-[1px] border-b"></div>

        <div className="pt-6 pb-4">
          <div className="font-semibold text-base mb-2">Learning Outcome:</div>
          <ul className="list-disc text-base">
            {activity?.course_outcomes?.map((e) => {
              return (
                <li className="ml-4" key={e.id}>
                  <EditorReader
                    className="editor-wrap mt-1.5"
                    text_editor_content={e.description}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="bg-gray-3">
        <div className="flex gap-2 px-6 flex-wrap">
          {selector.tabs?.map((e) => {
            return (
              <SappButton
                key={e.id}
                size="small"
                className="py-2.5 !px-3 text-medium-sm !font-normal"
                color={tabButtonColor(e.id)}
                title={truncateString(e.name, 60)}
                onClick={() => handleChangeTab(e.id)}
              ></SappButton>
            )
          })}
        </div>
      </div>
      {/* <FadeInOut show={!selector.loading}> */}
      {!!course_tab_documents?.length && (
        <div className="bg-white pb-6 mb-6">
          <div className={`pt-6 max-w-[998px] w-full my-0 mx-auto px-6`}>
            <div className="tab-content">
              {course_tab_documents?.map((e, i) => {
                const marginBottom =
                  i < course_tab_documents?.length - 1 ? 'mb-6' : ''
                if (e.type === 'QUIZ') {
                  return (
                    <div
                      className={marginBottom}
                      key={e.id}
                      ref={quizDocumentRef}
                    >
                      <QuizDocument
                        questions={[
                          ...(e.quiz?.multiple_choice_questions || []),
                          ...(e.quiz?.constructed_questions || []),
                        ]}
                        activityId={activity.id}
                        tabId={selector.currentTabId || ''}
                        quizId={e.quiz?.id || ''}
                        grading_preference={
                          e.quiz?.grading_preference || 'AFTER_EACH_QUESTION'
                        }
                        document_id={e.id}
                        is_graded={e.quiz?.is_graded || false}
                      ></QuizDocument>
                    </div>
                  )
                }
                if (e.type === 'TEXT') {
                  return (
                    <div className={marginBottom} key={e.id}>
                      <TextDocument
                        text_editor_content={e.text_editor_content}
                      ></TextDocument>
                    </div>
                  )
                }
                if (e.type === 'VIDEO') {
                  return (
                    <div className={marginBottom} key={i}>
                      <VideoDocument
                        videos={e.videos}
                        activityId={activity.id}
                        tabId={selector.currentTabId || ''}
                        streamRefProp={(el: any) =>
                          (videoRef.current[i || 0] = el)
                        }
                        handleProcess={handleFinishedCourseSectionProgress}
                        document_id={e.id}
                        quizId={e.quiz?.id || ''}
                      ></VideoDocument>
                    </div>
                  )
                }
                return null
              })}
            </div>

            <div className="flex justify-between flex-wrap gap-5 mt-8">
              {getPreviousTabId() && (
                <div className="w-auto">
                  <div className="relative">
                    <div
                      onClick={() => handleChangeTab(getPreviousTabId() || '')}
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
      <div className="border border-gray-2 my-8"></div>
      {/* </FadeInOut> */}
      <div className="bg-white px-6 py-3 mb-6 relative">
        <div className="flex justify-between flex-nowrap gap-5">
          {activity.previous_activity && (
            <div className="w-1/2">
              <div
                onClick={() => {
                  router.push({
                    pathname: `/courses/${router.query.id}/activity/${activity.previous_activity?.id}`,
                    query: {
                      classId: router.query.classId,
                    },
                  })
                }}
                className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary whitespace-nowrap"
              >
                Previous Activity
              </div>
              <div className="text-medium-sm text-gray-1 flex">
                {getCourseIcon(activity.previous_activity?.display_icon)}{' '}
                <span className="ml-2">{activity.previous_activity.name}</span>
              </div>
            </div>
          )}
          {!activity.previous_activity && <div></div>}
          {activity.next_activity && (
            <div className="w-1/2">
              <div
                onClick={() => {
                  router.push({
                    pathname: `/courses/${router.query.id}/activity/${activity.next_activity?.id}`,
                    query: {
                      classId: router.query.classId,
                    },
                  })
                }}
                className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary text-right"
              >
                Next Activity
              </div>
              <div className="text-medium-sm text-gray-1 flex justify-end">
                <span className="mr-2">
                  {truncateString(activity.next_activity.name, 100)}
                </span>
                {getCourseIcon(activity.next_activity?.display_icon)}
              </div>
            </div>
          )}
          {!activity.next_activity && <div></div>}
        </div>
      </div>

      <div ref={endActivityRef}></div>
      <div>
        <Discussion class_id={(router.query.classId as string) || ''} />
      </div>
    </div>
  )
}

export default ActivityPage

/**
 * Hàm props phía máy chủ cho thành phần ActivityPage.
 * @param {Object} context - Đối tượng context phía máy chủ.
 * @returns {Object} - Props phía máy chủ.
 */
export async function getServerSideProps(context: any) {
  const { req, res, query } = context

  // Lấy accessToken từ cookie
  const accessToken = req.cookies.accessToken

  // Kiểm tra accessToken
  if (!accessToken) {
    // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  try {
    const { req } = context

    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie || '')

    if (!context?.query?.activityId) {
      return {
        notFound: true,
      }
    }

    const activity = await CourseActivityApi.getActivityById(
      context?.query?.activityId,
      context?.query.id,
      cookies.accessToken,
    )

    return {
      props: {
        activity,
        courseId: context.query?.id,
        sectionId: context.query?.activityId,
      },
    }
  } catch (error: any) {
    // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
    if (error.response && error.response.status === 401) {
      // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
      const refreshToken = req.cookies.refreshToken

      try {
        const refreshResponse = await axios.post(
          `${apiURL}/auth/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )

        // Lưu accessToken mới vào cookie
        const userInfo = res?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        await AsyncStorage.setItem('accessToken', act)
        await AsyncStorage.setItem('refreshToken', rft)
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        const newApiResponse = await axios.get(
          `${apiURL}/courses?page_index=1&page_size=10&name=${query.name}&type=${query.type}`,
          {
            headers: {
              Authorization: `Bearer ${act}`,
            },
          },
        )

        // Xử lý dữ liệu từ API
        const courses = newApiResponse.data?.data

        // Trả về props cho trang
        return {
          props: {
            courses: courses,
          },
        }
      } catch (refreshError) {
        removeJwtToken()
        // Xử lý lỗi khi cập nhật accessToken từ refreshToken
        // Chuyển hướng đến trang đăng nhập
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      }
    } else {
      // Xử lý lỗi khác khi sử dụng accessToken

      // Chuyển hướng đến trang đăng nhập
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }
  }
}
