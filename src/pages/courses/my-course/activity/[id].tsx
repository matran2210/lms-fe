import SappButton from '@components/base/button/SappButton'
import QuizDocument from '@components/mycourses/activity/documents/QuizDocument'
import TextDocument from '@components/mycourses/activity/documents/TextDocument'
import VideoDocument from '@components/mycourses/activity/documents/VideoDocument'
import { parse } from 'cookie'
import { useEffect, useState } from 'react'
import FadeInOut from 'src/common/FadeInOut'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import {
  courseActivityAction,
  courseActivityReducer,
  getCourseActivityTapById,
} from 'src/redux/slice/Course/MyCourse/Activity/Activity'

type Props = {
  activity: any
}

const ActivityPage = ({ activity }: Props) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityReducer)
  const [activeButtonId, setActiveButtonId] = useState<string>()
  useEffect(() => {
    dispatch(courseActivityAction.setActivityState(activity))
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

  return (
    <div className=" text-bw-1 max-w-xxl my-0 mx-auto ">
      <div className="bg-gray-3 pb-10 px-6 ">
        <div className="flex justify-between w-full gap-4 py-6  border-b border-gray-2 bg-none">
          <div className="font-semibold text-2xl ">
            Activity 4: Introduction to professional ethics and fundamental
            principles
          </div>
          <div className="text-base text-gray-1 whitespace-nowrap">
            30 min estimated
          </div>
        </div>

        <div className="py-6">
          <div className="font-semibold text-base mb-2">Learning Outcome:</div>
          <ul className="list-disc text-base">
            <li className="ml-4 mb-3">
              Now this is a story all about how, my life got flipped-turned
              upside down
            </li>
            <li className="ml-4">
              Now this is a story all about how, my life got flipped-turned
              upside down
            </li>
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
      <div className="mt-6 max-w-[998px] w-full my-0 mx-auto px-6">
        <div className="tab-content">
          {selector.tabs
            ?.find((e) => e.id === selector.currentTabId)
            ?.course_tab_documents?.map((e) => {
              if (e.type === 'QUIZ') {
                return (
                  <div className="mb-8" key={e.id}>
                    <QuizDocument></QuizDocument>
                  </div>
                )
              }
              if (e.type === 'TEXT') {
                return (
                  <TextDocument
                    key={e.id}
                    text_editor_content={e.text_editor_content}
                  ></TextDocument>
                )
              }
              if (e.type === 'VIDEO') {
                return (
                  <VideoDocument videos={e.videos} key={e.id}></VideoDocument>
                )
              }
              return null
            })}
        </div>
      </div>
    </div>
  )
}

export default ActivityPage

export async function getServerSideProps(context: any) {
  const { req } = context

  // Parse cookies from the request headers
  const cookies = parse(req.headers.cookie || '')
  if (!context?.query?.id) {
    return {
      notFound: true,
    }
  }
  const activity = await CourseActivityApi.getActivityById(
    context?.query?.id,
    cookies.accessToken,
  )

  return {
    props: { activity },
  }
}
