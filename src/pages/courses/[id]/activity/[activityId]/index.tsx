import SappButton from '@components/base/button/SappButton'
import Discussion from '@components/mycourses/activity/discussion/Discussion'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import axios from 'axios'
import { parse } from 'cookie'
import { useEffect, useMemo, useState } from 'react'
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

type Props = {
  activity: IActivity
}

const ActivityPage = ({ activity }: Props) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const [activeButtonId, setActiveButtonId] = useState<string>()

  useEffect(() => {
    if (activity) {
      try {
        dispatch(courseActivityAction.setActivityState(activity))
        dispatch(getDiscussion(activity?.id))
      } catch (error) {}
    }
  }, [])

  const handleChangeTab = (id: string) => {
    try {
      dispatch(getCourseActivityTapById({ id }))
      setActiveButtonId(id)
    } catch (error) {}
  }

  const tabButtonColor = (id: string) => {
    let currentTabId
    if (selector.loading) {
      currentTabId = activeButtonId
    } else {
      currentTabId = selector.currentTabId
    }
    return id === currentTabId ? 'primary' : 'white'
  }

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
                    <div className={marginBottom} key={e.id}>
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
                    <div className={marginBottom} key={e.id}>
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
      <Discussion />
    </div>
  )
}

export default ActivityPage

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
      props: { activity },
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
