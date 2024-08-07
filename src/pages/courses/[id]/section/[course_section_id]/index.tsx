import React, { useEffect, useState } from 'react'
import PreviewPartDetail from 'preview-part'
import 'preview-part/dist/index.css'
import { TreeHelper } from 'src/helper/tree'
import { ILearningOutcome } from 'src/type/courses'
import SappDrawer from '@components/base/SappDrawer'
import { useRouter } from 'next/router'
import { truncateString } from '@utils/index'
import TestModal from 'src/pages/courses/test'
import { ANIMATION } from 'src/constants'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { CoursesAPI } from '../../../../api/courses/index'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import SappTooltip from 'src/common/SappTooltip'
import Layout from '@components/layout'
import { trackGAEvent } from '@utils/google-analytics'
import PopupCanNotRetakeTest from '@components/mycourses/PogupCannotRetakeTest'

interface IProps {
  course_section_type: string
  description: string
  duration: number
  id: string
  learning_progress: {
    duration: number
    time_spent: number
    total_course_sections: number
    total_course_sections_completed: number
  }
  quiz: {
    case_study_story: null
    id: string
    is_graded: boolean
    is_limited: boolean
    limit_count: number
    number_of_essay_questions: number
    number_of_multiple_choice_questions: number
    quiz_timed: number
    required_percent_score: number
    attempt: {
      id: string
      number_of_attempts: number
      score: number
      ratio_score: string
      total_attempt_time: number
    }
  }
  parent_id: string
}

const CoursePartDetail = () => {
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
  const [isPassedCourse, setIsPassedCourse] = useState<boolean>(false)
  const [loadingLearningOutcome, setLoadingLearningOutcome] =
    useState<boolean>(false)
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await CoursesAPI.getPartDetail(
        router.query.id,
        router.query.course_section_id,
      )
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled:
        router.query.id !== undefined &&
        router.query.course_section_id !== undefined,
    })
  }

  const { data: previewPart, isLoading } = useGetData('course-part-detail', {})

  const tree = TreeHelper.convertFromArray(previewPart?.course_section_tree)
  const partDetail = tree[0] as any

  const fetchChapterDetail = async (
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ) => {
    setLoadingChapter(true)
    try {
      const res = await CoursesAPI.getPartDetail(id, course_section_id)
      const nodeList = res?.data?.course_section_tree
      setIsPassedCourse(res?.data?.is_passed_course)
      const newData = nodeList.map((item: IProps) => {
        if (item.id === course_section_id) {
          const { parent_id, ...rest } = item
          return rest
        }
        return item
      })
      const tree = TreeHelper.convertFromArray(newData)

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
      const res = await CoursesAPI.getCourseLearningOutcome(
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
    })
  }

  const handleRouterCaseStudy = async (
    quizId: string,
    topicId: string,
    sectionId?: string | undefined,
    caseStudyId?: string | undefined,
  ) => {
    const filteredData = chapterDetail?.children?.find(
      (item: any) => item?.id === sectionId,
    )
    const getCaseStudy = filteredData?.quiz?.case_study_story?.instances?.find(
      (item: any) => item?.id === caseStudyId,
    )

    const totalCourseSections =
      getCaseStudy?.learning_progress?.total_course_sections
    const totalCourseSectionsCompleted =
      getCaseStudy?.learning_progress?.total_course_sections_completed
    if (
      totalCourseSections === totalCourseSectionsCompleted &&
      totalCourseSections !== undefined &&
      totalCourseSectionsCompleted !== undefined
    ) {
      router.push({
        pathname: `/case-study/table-result/${getCaseStudy?.attempt?.id}`,
        query: {
          class_user_id: previewPart.class_user_id,
          class_id: router?.query?.id,
          course_section_id: router?.query?.course_section_id,
        },
      })
    } else {
      if (sectionId && caseStudyId) {
        await handleCaseStudyProcess(sectionId, caseStudyId)
      }
      router.push({
        pathname: `/case-study/${topicId}`,
        query: {
          quiz_id: quizId,
          class_user_id: previewPart.class_user_id,
          caseStudyId: caseStudyId,
          class_id: router?.query?.id,
          course_section_id: router?.query?.course_section_id,
        },
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
    const res = await CoursesAPI.learningOutcomeProgress(
      router.query.id,
      chapterDetail?.id,
    )
    // 29/2/2023: Temporary comment to fix multiple API calls
    // if (res?.success) {
    //   fetchChapterDetail(id, course_section_id)
    // }
  }

  const handleChapterTest = async () => {
    await CoursesAPI.learningOutcomeProgress(router.query.id, chapterTestId)
  }

  const handleCaseStudyProcess = async (
    courseId: string,
    caseStudyId: string,
  ) => {
    const res = await CoursesAPI.caseStudyProgress(
      router.query.id,
      courseId,
      caseStudyId,
    )
  }

  useEffect(() => {
    if (partDetail?.id) {
      if (router.query.unit_id) {
        setDefaultActive(String(router?.query?.unit_id) || '')
      } else if (partDetail?.children?.learning_progress !== '') {
        const filteredChildren = partDetail?.children.filter(
          (child: any) => child?.course_section_type === 'CHAPTER',
        )
        const matchingChild = filteredChildren?.find(
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
        } else if (filteredChildren?.length > 0) {
          setDefaultActive(filteredChildren[0].id) // Set default to the first child
        }
      }
    }
  }, [router?.asPath, partDetail?.id])

  // Tạo một mảng chứa tất cả các child của chapterDetail (nếu có)
  const childArrays = chapterDetail?.children?.map(
    (child: any) => child?.children,
  )

  // Kết hợp tất cả các mảng con thành một mảng lớn
  const concatenatedArray: any[] = chapterDetail
    ? [].concat(...childArrays)
    : []

  // Tạo một mảng mới chỉ chứa các trường cần thiết từ mỗi phần tử trong concatenatedArray
  const transformedArray = concatenatedArray?.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      display_icon: item.display_icon,
    }
  })

  // Lưu trữ mảng đã được biến đổi vào sessionStorage khi loadingChapter thay đổi
  useEffect(() => {
    // Chuyển đổi mảng thành chuỗi JSON và lưu vào sessionStorage với key 'aaaa'
    window.sessionStorage.setItem(
      'activityId',
      JSON.stringify(transformedArray),
    )
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Course Part Detail">
        <div className="main max-w-xxl my-0 mx-auto default-content-editor">
          <div className="w-full">
            <div className="flex pt-6 items-center">
              <span
                onClick={() => {
                  router.push('/courses')
                  trackGAEvent('Click Breadcrumb My Course')
                }}
                className="text-medium-sm font-medium text-gray-1 cursor-pointer whitespace-nowrap"
              >
                My Course
              </span>
              <span
                className="text-medium-sm font-medium text-gray-1 flex items-center whitespace-nowrap overflow-hidden text-ellipsis ml-1 cursor-pointer"
                onClick={() => {
                  router.push(`/courses/my-course/${router.query.id}`)
                  trackGAEvent('Click Breadcrumb My Course Detail')
                }}
              >
                /
                <p className="w-full max-w-78 inline-block whitespace-nowrap overflow-hidden text-ellipsis mx-0.5 shrink-0">
                  <SappTooltip
                    title={previewPart?.name}
                    showTooltip={previewPart?.name?.length > 60}
                  >
                    {truncateString(previewPart?.name, 50)}
                  </SappTooltip>
                </p>
              </span>
              <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                <p className="text-medium-sm font-medium text-bw-1 w-full max-w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis">
                  /{' '}
                  <SappTooltip
                    title={partDetail?.name}
                    showTooltip={partDetail?.name?.length > 90}
                  >
                    {truncateString(partDetail?.name, 90)}
                  </SappTooltip>
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
            class_user_id={previewPart?.class_user_id}
            activeCourse={() => {}}
            is_passed_course={isPassedCourse}
          />
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default CoursePartDetail
