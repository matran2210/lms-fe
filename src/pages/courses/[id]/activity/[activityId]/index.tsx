import SappButton from '@components/base/button/SappButton'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import axios from 'axios'
import { parse } from 'cookie'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import { IActivity } from 'src/type/course/my-course/Activity'
import _debounce from 'lodash/debounce'

type Props = {
  activity: IActivity
  courseId: string
  sectionId: string
}

enum ACTIVITY_TYPE {
  BOTH = 'BOTH',
  ONLY_VIDEO = 'ONLY_VIDEO',
  ONLY_QUIZ = 'ONLY_QUIZ',
  NONE = 'NONE',
}

const ActivityPage = ({ activity, courseId, sectionId }: Props) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const [activeButtonId, setActiveButtonId] = useState<string>()
  const endActivityRef = useRef<HTMLDivElement>(null)
  const quizDocumentRef = useRef<HTMLDivElement>(null)
  const videoDocumentRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>()
  const isFinishRef = useRef<boolean>(false)

  useLayoutEffect(() => {
    if (activity) {
      try {
        dispatch(courseActivityAction.setActivityState(activity))
        dispatch(getDiscussion(activity?.id))
        ;(async () => {
          await CourseActivityApi.startCourseSectionProgress(
            courseId,
            sectionId,
          )
        })()
      } catch (error) {}
    }
  }, [])

  useEffect(() => {
    finishedCourseSectionProgress()
  }, [
    endActivityRef.current,
    quizDocumentRef.current,
    videoDocumentRef.current,
    observerRef.current,
  ])

  /**
   * Hàm xử lý khi kết thúc tiến trình của phần khóa học.
   */
  const finishedCourseSectionProgress = () => {
    // Xác định loại hoạt động của phần hiện tại
    const activityType = getActivityType(activity)

    // Xử lý khi chỉ có video và tham chiếu đến videoDocumentRef hiện tại
    if (activityType === ACTIVITY_TYPE.ONLY_VIDEO && videoDocumentRef.current) {
      videoDocumentRef.current.onclick = async () => {
        await handleFinishedCourseSectionProgress()
      }
      return
    }
    // Xử lý khi chỉ có bài kiểm tra và tham chiếu đến quizDocumentRef hiện tại
    else if (
      activityType === ACTIVITY_TYPE.ONLY_QUIZ &&
      quizDocumentRef.current
    ) {
      quizDocumentRef.current.onclick = async () => {
        await handleFinishedCourseSectionProgress()
      }
      return
    }

    // Xử lý khi có tham chiếu đến endActivityRef hiện tại
    if (endActivityRef.current) {
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
  }

  /**
   * Hàm xử lý khi kết thúc tiến trình phần của khóa học.
   */
  const handleFinishedCourseSectionProgress = async () => {
    if (!isFinishRef.current) {
      await CourseActivityApi.finishedCourseSectionProgress(courseId, sectionId)
      isFinishRef.current = true
    }
  }

  /**
   * Hàm để lấy ActivityType dựa trên document type.
   * @param {IActivity} activityReducer - activity.
   * @returns {string} - ActivityType.
   */
  function getActivityType(activityReducer: IActivity): string {
    const tabs = activityReducer.tabs
    let hasVideo = false
    let hasQuiz = false
    if (!tabs?.[0]) {
      return ACTIVITY_TYPE.NONE
    }
    for (const tab of tabs) {
      const documents = tab.course_tab_documents

      if (documents) {
        for (const document of documents) {
          if (document.type === 'QUIZ') {
            hasQuiz = true
          } else if (document.type === 'VIDEO') {
            hasVideo = true
          }
        }
      }
    }

    if (hasVideo && hasQuiz) {
      return ACTIVITY_TYPE.BOTH
    } else if (hasVideo) {
      return ACTIVITY_TYPE.ONLY_VIDEO
    } else if (hasQuiz) {
      return ACTIVITY_TYPE.ONLY_QUIZ
    } else {
      return ACTIVITY_TYPE.NONE
    }
  }

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

  return (
    <div className={`text-bw-1 max-w-xxl my-0 mx-auto`}>
      <div className="bg-gray-3 pb-10 px-6 ">
        <div className="flex justify-between w-full gap-4 py-6  border-b border-gray-2 bg-none">
          <div className="font-semibold text-2xl ">{activity.name}</div>
          <div className="text-base text-gray-1 whitespace-nowrap">
            {activity?.duration || 0} min estimated
          </div>
        </div>

        <div className="py-6">
          <div className="font-semibold text-base mb-2">Learning Outcome:</div>
          <ul className="list-disc text-base">
            {activity?.course_outcomes?.map((e) => {
              return (
                <li className="ml-4" key={e.id}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: e.description,
                    }}
                  ></span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="-mt-9">
        <div className="flex gap-2 px-6 flex-wrap">
          {selector.tabs?.map((e) => {
            return (
              <SappButton
                key={e.id}
                size="small"
                className="py-2.5 !px-3 text-base !font-normal"
                color={tabButtonColor(e.id)}
                title={e.name}
                onClick={() => handleChangeTab(e.id)}
              ></SappButton>
            )
          })}
        </div>
      </div>
      {/* <FadeInOut show={!selector.loading}> */}
      {!!course_tab_documents?.length && (
        <div className="bg-white pb-6 mb-6">
          <div
            className={`pt-6 max-w-[998px] w-full my-0 mx-auto px-6 relative`}
          >
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
                    <div
                      className={marginBottom}
                      key={e.id}
                      ref={videoDocumentRef}
                    >
                      <VideoDocument
                        videos={e.videos}
                        activityId={activity.id}
                        tabId={selector.currentTabId || ''}
                      ></VideoDocument>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      )}
      {/* </FadeInOut> */}
      <div className="bg-white px-6 py-3 mb-6 relative">
        <div className="flex justify-between flex-wrap gap-5">
          <div className="w-full sm:w-auto">
            <div className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary">
              Previous Activity
            </div>
            <div className="text-medium-sm text-gray-1 flex">
              <SappIcon icon="course_text"></SappIcon>
              <span className="ml-2">Interest Rates: Interpretation</span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="mb-2 text-base font-semibold text-bw-1 select-none cursor-pointer hover:text-primary text-right">
              Next Activity
            </div>
            <div className="text-medium-sm text-gray-1 flex justify-end">
              <span className="mr-2">
                The Future Value of a Single Cash Flow/a Series of Cash Flows
              </span>
              <SappIcon icon="course_video"></SappIcon>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-2 border-primary"></div>
      </div>
      <div ref={endActivityRef}></div>
      <div>
        <Discussion />
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
        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        const newApiResponse = await axios.get(
          `${apiURL}/courses?page_index=1&page_size=10&name=${query.name}&type=${query.type}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
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
          destination: '/auth/login',
          permanent: false,
        },
      }
    }
  }
}
