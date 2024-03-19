import React, { useEffect, useState } from 'react'
import PreviewPartDetail from 'preview-part'
import 'preview-part/dist/index.css'
import { TreeHelper } from 'src/helper/tree'
import CourseAPI from 'src/pages/api/courses'
import { ILearningOutcome } from 'src/type/courses'
import SappDrawer from '@components/base/SappDrawer'
import axios from 'axios'
import { apiURL } from 'src/redux/services/httpService'
import { useRouter } from 'next/router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  setCookieActToken,
  setCookieRefreshToken,
  truncateString,
} from '@utils/index'
import { removeJwtToken } from '@utils/helpers/authen'
import TestModal from 'src/pages/courses/test'
import { ANIMATION, PageLink } from 'src/constants'
import { Tooltip } from 'antd'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'

const CoursePartDetail = ({ previewPart }: any) => {
  const [chapterDetail, setChapterDetail] = useState<any>(null)
  const [loadingChapter, setLoadingChapter] = useState(false)
  const [openLearningOutcome, setOpenLearningOutcome] = useState(false)
  const [learningOutcome, setLearningOutcome] = useState<ILearningOutcome>()
  const router = useRouter()
  const [readMore, setReadMore] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [chapterData, setChapterData] = useState<any>({})
  const [chapterTestId, setChapterTestId] = useState<string>()
  const [defaultActive, setDefaultActive] = useState<string>()
  const [loadingLearningOutcome, setLoadingLearningOutcome] =
    useState<boolean>(false)

  const tree = TreeHelper.convertFromArray(previewPart?.course_section_tree)
  const partDetail = tree[0] as any

  const fetchChapterDetail = async (
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ) => {
    setLoadingChapter(true)
    try {
      const res = await CourseAPI.getCoursePartDetail(id, course_section_id)
      const nodeList = res?.data?.course_section_tree
      const tree = TreeHelper.convertFromArray(nodeList)
      const detail = tree[0]
      setChapterDetail(detail)
    } catch (error) {
    } finally {
      setLoadingChapter(false)
    }
  }

  const handleCancel = () => {
    setOpenLearningOutcome(false)
    document.body.style.overflow = 'auto'
  }

  async function getLearningOutcome() {
    setLoadingLearningOutcome(true)
    try {
      const res = await CourseAPI.getCourseLearningOutcome(
        chapterDetail?.course_learning_outcome?.id,
      )
      setLearningOutcome(res?.data)
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoadingLearningOutcome(false)
      }, 500)
    }
  }

  useEffect(() => {
    if (openLearningOutcome) {
      getLearningOutcome()
    }
  }, [openLearningOutcome])

  const handleRouterActivity = (id: string) => {
    router.push({
      pathname: `/courses/${router.query.id}/activity/${id}`,
      query: {
        classId: previewPart.class_id,
      },
    })
  }
  const handleRouterCaseStudy = async (
    quizId: string,
    topicId: string,
    sectionId?: string | undefined,
    caseStudyId?: string | undefined,
  ) => {
    const filteredData = chapterDetail?.children?.filter(
      (item: any) => item?.id === sectionId,
    )
    const getCaseStudy =
      filteredData?.[0]?.quiz?.case_study_story?.instances?.filter(
        (item: any) => item?.id === caseStudyId,
      )

    const totalCourseSections =
      getCaseStudy?.[0]?.learning_progress?.total_course_sections
    const totalCourseSectionsCompleted =
      getCaseStudy?.[0]?.learning_progress?.total_course_sections_completed
    if (
      totalCourseSections === totalCourseSectionsCompleted &&
      totalCourseSections !== undefined &&
      totalCourseSectionsCompleted !== undefined
    ) {
      router.push({
        pathname: `/case-study/table-result/${getCaseStudy?.[0]?.question_topic?.attempts[0]?.id}`,
        query: { class_user_id: previewPart.class_user_id },
      })
    } else {
      if (sectionId && caseStudyId) {
        await handleCaseStudyProcess(sectionId, caseStudyId)
      }
      router.push({
        pathname: `/case-study/${topicId}`,
        query: { quiz_id: quizId, class_user_id: previewPart.class_user_id },
      })
    }
  }

  const handleRouterChapter = (id: string) => {
    const partData = partDetail?.children?.filter(
      (item: any) => item?.id === id,
    )
    const filteredData = chapterDetail?.children?.filter(
      (item: any) => item?.quiz?.id === id,
    )
    if (partData?.length > 0) {
      setChapterData(partData?.[0])
      setChapterTestId(partData?.[0]?.id)
    } else {
      setChapterData(filteredData?.[0])
      setChapterTestId(filteredData?.[0]?.id)
    }
    setOpen(true)
  }

  const course_section = chapterDetail?.children?.[0]
  const quiz = course_section?.quiz

  const handleNextLesson = () => {
    if (course_section?.course_section_type === 'CHAPTER_TEST') {
      handleRouterChapter(course_section?.quiz?.id)
    } else if (course_section?.course_section_type === 'ACTIVITY') {
      handleRouterActivity(course_section?.children?.[0]?.id)
    } else if (course_section?.course_section_type === 'STORY') {
      handleRouterCaseStudy(
        quiz?.id,
        quiz?.case_study_story?.instances?.[0]?.question_topic?.id,
        course_section?.id,
        quiz?.case_study_story?.instances?.[0]?.id,
      )
    } else if (course_section?.course_section_type === 'UNIT') {
      handleRouterActivity(course_section?.children?.[0]?.id)
    }
  }

  const handleLearningOutCome = async (
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ) => {
    const res = await CourseAPI.learningOutcomeProgress(
      router.query.id,
      chapterDetail?.id,
    )
    // 29/2/2023: Temporary comment to fix multiple API calls
    // if (res?.success) {
    //   fetchChapterDetail(id, course_section_id)
    // }
  }

  const handleChapterTest = async () => {
    await CourseAPI.learningOutcomeProgress(router.query.id, chapterTestId)
  }

  const handleCaseStudyProcess = async (
    courseId: string,
    caseStudyId: string,
  ) => {
    const res = await CourseAPI.caseStudyProgress(
      router.query.id,
      courseId,
      caseStudyId,
    )
  }

  useEffect(() => {
    if (router.query.unit_id) {
      setDefaultActive(String(router?.query?.unit_id) || '')
    } else if (partDetail.children.learning_progress !== '') {
      const filteredChildren = partDetail.children.filter(
        (child: any) => child.course_section_type === 'CHAPTER',
      )
      const matchingChild = filteredChildren.find(
        (child: {
          learning_progress: {
            total_course_sections: any
            total_course_sections_completed: any
          }
        }) => {
          if (child.learning_progress) {
            const { total_course_sections, total_course_sections_completed } =
              child.learning_progress
            const progressRatio =
              (total_course_sections_completed / total_course_sections) * 100
            return progressRatio < 100
          }
          return false
        },
      )

      if (matchingChild) {
        setDefaultActive(matchingChild.id)
      } else if (filteredChildren.length > 0) {
        setDefaultActive(filteredChildren[0].id) // Set default to the first child
      }
    } else {
      setDefaultActive('')
    }
  }, [router?.asPath])

  return (
    <div className="main max-w-xxl my-0 mx-auto default-content-editor">
      <div className="w-full">
        <div className="flex pt-6 items-center">
          <span
            onClick={() => router.push('/courses')}
            className="text-medium-sm font-medium text-gray-1 cursor-pointer whitespace-nowrap"
          >
            My Course
          </span>
          <span
            className="text-medium-sm font-medium text-gray-1 flex items-center whitespace-nowrap overflow-hidden text-ellipsis ml-1 cursor-pointer"
            onClick={() => router.push(`/courses/my-course/${router.query.id}`)}
          >
            /
            <p className="w-full max-w-78 inline-block whitespace-nowrap overflow-hidden text-ellipsis mx-0.5 shrink-0">
              {(previewPart?.name as string)?.length > 50 ? (
                <Tooltip
                  title={previewPart?.name}
                  color="#ffffff"
                  placement="bottom"
                >
                  {truncateString(previewPart?.name, 50)}
                </Tooltip>
              ) : (
                <>{previewPart?.name}</>
              )}
            </p>
          </span>
          <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
            <p className="text-medium-sm font-medium text-bw-1 w-full max-w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis">
              /{' '}
              {(partDetail?.name as string)?.length > 50 ? (
                <Tooltip
                  title={partDetail?.name}
                  color="#ffffff"
                  placement="bottom"
                >
                  {truncateString(partDetail?.name, 100)}
                </Tooltip>
              ) : (
                <>{partDetail?.name}</>
              )}
            </p>
          </span>
        </div>
      </div>
      <div data-aos={ANIMATION.DATA_AOS}>
        <PreviewPartDetail
          chapterMenu={partDetail}
          fetchChapterDetail={fetchChapterDetail}
          chapterDetail={chapterDetail}
          loading={false}
          loadingChapter={loadingChapter}
          setLoadingChapter={setLoadingChapter}
          setOpenLearningOutcome={setOpenLearningOutcome}
          course_id={router.query.id as any}
          course_section_id={router.query.course_section_id as any}
          handleRouterActivity={handleRouterActivity}
          handleRouterCaseStudy={handleRouterCaseStudy}
          handleLearningOutCome={handleLearningOutCome}
          handleRouterChapter={handleRouterChapter}
          readMore={readMore}
          setReadMore={setReadMore}
          defaultActive={defaultActive ? defaultActive : ''}
        />
      </div>

      <SappDrawer
        isOpen={openLearningOutcome}
        onClose={handleCancel}
        title={learningOutcome?.name}
        message="Bạn có chắc chắn muốn hủy không?"
        widthDrawer="w-6/12"
        handleSubmit={handleNextLesson}
        confirmOnClose={false}
        heightBody="h-[calc(100vh-186px)] pb-6"
        sizeTextBtn="medium"
      >
        <TextSkeleton
          loading={loadingLearningOutcome}
          widths={['70', '100', '100', '50', '100']}
          className="mb-4"
          classChild="rounded"
        >
          <div
            style={{ borderBottom: '1px solid #DCDDDD' }}
            className="pb-6 text-bw-1 learningOutcome-description"
            dangerouslySetInnerHTML={{
              __html: learningOutcome?.description ?? '',
            }}
          />
        </TextSkeleton>
        {loadingLearningOutcome && (
          <div className="h-px w-full bg-gray-2 mt-4 mb-2"></div>
        )}
        <TextSkeleton
          loading={loadingLearningOutcome}
          className="mt-4 last:mb-4"
          classChild="rounded"
          widths={['70', '100', '100', '50', '100']}
        >
          {learningOutcome?.course_outcomes?.map((outcome, index) => (
            <div className="flex mt-6 mr-3" key={outcome.id}>
              <div className="font-medium leading-5 text-base me-1 text-bw-1">
                LO{index + 1}:
              </div>
              <div
                className="text-bw-1 learningOutcome-description"
                dangerouslySetInnerHTML={{ __html: outcome?.description }}
              />
            </div>
          ))}
        </TextSkeleton>
      </SappDrawer>
      <TestModal
        open={open}
        setOpen={setOpen}
        data={chapterData}
        class_user_id={previewPart.class_user_id}
        activeCourse={handleChapterTest}
      />
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const { req, res, query } = context

  // Lấy accessToken từ cookie
  const accessToken = req.cookies.accessToken

  try {
    // Thực hiện yêu cầu API với accessToken
    const apiResponse = await axios.get(
      `${apiURL}/course-sections/${query.id}?course_section_id=${query.course_section_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    // Xử lý dữ liệu từ API
    const nodeList = apiResponse?.data?.data
    // const tree = TreeHelper.convertFromArray(nodeList)
    // const previewPart = tree[0]

    // Trả về props cho trang
    return {
      props: {
        previewPart: nodeList || null,
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
        const userInfo = refreshResponse?.data?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        if (typeof window !== 'undefined') {
          await AsyncStorage.setItem('accessToken', act)
          await AsyncStorage.setItem('refreshToken', rft)
        }
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        const newApiResponse = await axios.get(
          `${apiURL}/course-sections/${query.id}?course_section_id=${query.course_section_id}`,
          {
            headers: {
              Authorization: `Bearer ${act}`,
            },
          },
        )

        // Xử lý dữ liệu từ API
        const nodeList = newApiResponse?.data?.data
        // const tree = TreeHelper.convertFromArray(nodeList)
        // const previewPart = tree[0]

        // Trả về props cho trang
        return {
          props: {
            previewPart: nodeList || {},
          },
        }
      } catch (refreshError) {
        removeJwtToken()
        // Chuyển hướng đến trang đăng nhập
        return {
          redirect: {
            destination: PageLink.AUTH_LOGIN,
            permanent: false,
          },
        }
      }
    } else {
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

export default CoursePartDetail
