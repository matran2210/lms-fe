import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import Layout from '@components/layout'
import { Skeleton } from 'antd'
import { useRouter } from 'next/router'
import PreviewPartDetail from 'preview-part'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { TEST_TYPE } from 'src/constants'
import { TreeHelper } from 'src/helper/tree'
import TestModal from 'src/pages/courses/test'
import { ILearningOutcome } from 'src/type/courses'
import { CoursesAPI } from '../../../../api/courses/index'
import { useCourseContext } from '@contexts/index'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { StarCircleIcon } from '@components/icons'

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
  const [loadingChapter, setLoadingChapter] = useState(true)
  const [openLearningOutcome, setOpenLearningOutcome] = useState(false)
  const [learningOutcome, setLearningOutcome] = useState<ILearningOutcome>()
  const router = useRouter()
  const [readMore, setReadMore] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [chapterData, setChapterData] = useState<any>({})
  const [chapterTestId, setChapterTestId] = useState<string>()
  const [defaultActive, setDefaultActive] = useState<string>()
  const courseChapterId = localStorage.getItem('course_chapter_id')
  const [isPassedCourse, setIsPassedCourse] = useState<boolean>(false)
  const [loadingLearningOutcome, setLoadingLearningOutcome] =
    useState<boolean>(false)

  const { setOpenPopupCTA } = useCourseContext()

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
      retry: false,
    })
  }

  const { data: previewPart, isLoading } = useGetData('course-part-detail', {})

  const tree = TreeHelper.convertFromArray(previewPart?.course_section_tree)
  const partDetail = tree[0] as any
  const [activeItem, setActiveItem] = useState<any>()

  const handleActive = (item: any) => {
    setActiveItem(item)
    if (item?.id && item?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
      setChapterDetail(undefined)
    }
  }

  const fetchChapterDetail = async (
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ) => {
    if (
      activeItem?.id &&
      activeItem?.course_section_link_parents?.[0]?.is_preview_locked
    ) {
      setChapterDetail(undefined)
    } else {
      setLoadingChapter(true)
      try {
        if (course_section_id !== router.query.chapter) {
          router.push(`${location.pathname}?chapter=${course_section_id}`)
        }
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
        localStorage.removeItem('course_chapter_id')
      } catch (error) {
      } finally {
        setLoadingChapter(false)
      }
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

  const handleRouterActivity = (id: string, chapter: any) => {
    if (chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    } else {
      router.push({
        pathname: `/courses/${router.query.id}/activity/${id}`,
      })
    }
  }

  const handleRouterCaseStudy = async (
    quizId: string,
    topicId: string,
    sectionId?: string | undefined,
    caseStudyId?: string | undefined,
    chapter?: any,
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
      if (chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
        setOpenPopupCTA({
          lockSection: true,
          ctaUpgrade: false,
          thankYou: false,
          thankYouLater: false,
        })
      } else {
        router.push({
          pathname: `/case-study/result/${getCaseStudy?.attempt?.id}`,
          query: {
            class_user_id: previewPart.class_user_id,
            class_id: router?.query?.id,
            course_section_id: router?.query?.course_section_id,
          },
        })
      }
    } else {
      if (sectionId && caseStudyId) {
        await handleCaseStudyProcess(sectionId, caseStudyId)
      }
      if (chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
        setOpenPopupCTA({
          lockSection: true,
          ctaUpgrade: false,
          thankYou: false,
          thankYouLater: false,
        })
      } else {
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
  }

  const handleRouterChapter = (id: string, chapter?: any) => {
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

    if (
      chapter?.course_section_link_parents?.[0]?.is_preview_locked &&
      chapter?.course_section_type === TEST_TYPE.CHAPTER_TEST
    ) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    }
    if (
      chapter?.course_section_link_parents?.[0]?.is_preview_locked &&
      chapter?.course_section_type === TEST_TYPE.TOPIC_TEST
    ) {
      setChapterDetail(undefined)
    } else {
      if (!chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
        setOpen(true)
      }
    }
  }

  const course_section = chapterDetail?.children?.[0]
  const quiz = course_section?.quiz

  const lockSection =
    course_section?.course_section_link_parents?.[0]?.is_preview_locked

  /**
   * Handles navigation to the next lesson based on the type of the current course section.
   * If the section is locked, it opens a popup. Otherwise, it navigates to the appropriate route.
   */
  const handleNextLesson = () => {
    /**
     * Handles the case when the section is locked by showing a popup and canceling the current action.
     */
    const handleLockedSection = () => {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
      handleCancel()
    }

    /**
     * Handles the case when the section is unlocked by executing the provided callback and canceling the current action.
     * @param callback - The function to execute for navigation or other actions.
     */
    const handleUnlockedSection = (callback: () => void) => {
      callback()
      handleCancel()
    }

    // Determine the action based on the course section type
    if (course_section?.course_section_type === 'CHAPTER_TEST') {
      // Handle chapter test section
      lockSection
        ? handleLockedSection()
        : handleUnlockedSection(() =>
            handleRouterChapter(course_section?.quiz?.id),
          )
    } else if (
      course_section?.course_section_type === 'ACTIVITY' ||
      course_section?.course_section_type === 'UNIT'
    ) {
      // Handle activity or unit section
      lockSection
        ? handleLockedSection()
        : handleUnlockedSection(() =>
            handleRouterActivity(course_section?.children?.[0]?.id, undefined),
          )
    } else if (course_section?.course_section_type === 'STORY') {
      // Handle story section
      lockSection
        ? handleLockedSection()
        : handleUnlockedSection(() =>
            handleRouterCaseStudy(
              quiz?.id,
              quiz?.case_study_story?.instances?.[0]?.question_topic?.id,
              course_section?.id,
              quiz?.case_study_story?.instances?.[0]?.id,
            ),
          )
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
    if (partDetail?.id && partDetail?.children?.learning_progress !== '') {
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
        !courseChapterId && setDefaultActive(matchingChild.id)
      } else if (filteredChildren?.length > 0) {
        !courseChapterId && setDefaultActive(filteredChildren[0].id) // Set default to the first child
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
      is_preview_locked:
        item?.course_section_link_parents?.[0]?.is_preview_locked,
    }
  })

  // Lưu trữ mảng đã được biến đổi vào sessionStorage khi loadingChapter thay đổi
  useEffect(() => {
    // Chuyển đổi mảng thành chuỗi JSON và lưu vào sessionStorage với key 'aaaa'
    window.sessionStorage.setItem(
      'activityId',
      JSON.stringify(transformedArray),
    )
  }, [loadingChapter])

  useEffect(() => {
    courseChapterId && setDefaultActive(courseChapterId as string)
  }, [courseChapterId])

  return (
    <Layout title="Course Part Detail">
      <div className="main mx-auto mt-6 max-w-[1144px]">
        {isLoading ? (
          <Skeleton.Input size="default" className="w-1/2 pt-6" block />
        ) : (
          <SappBreadCrumbs
            isTeacher={false}
            breadcrumbs={[
              {
                title: 'My Course',
                link: '/courses',
              },
              {
                title: previewPart?.name,
                link: `/courses/my-course/${router.query.id}`,
              },
              {
                title: partDetail?.name,
                link: '',
              },
            ]}
          />
        )}
        <PreviewPartDetail
          chapterMenu={partDetail}
          fetchChapterDetail={fetchChapterDetail}
          chapterDetail={chapterDetail}
          loading={isLoading}
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
          defaultActive={router.query.chapter ?? defaultActive}
          focus_id={router?.query?.focus_id as string}
          handleGetItem={handleActive}
          // handleShowToast={handleShowToast}
        />
        <SappDrawerV3
          open={openLearningOutcome}
          onClose={handleCancel}
          title={learningOutcome?.name ?? 'Learning Outcome'}
          handleCancel={handleCancel}
          btnSubmitTile="Next Lesson"
          handleSubmit={handleNextLesson}
          isShowFooter
        >
          <TextSkeleton
            loading={loadingLearningOutcome}
            widths={['70', '100', '100', '50', '100']}
            className="mb-4"
            classChild="rounded"
          >
            <div
              style={{ borderBottom: '1px solid #DCDDDD' }}
              className="learningOutcome-description pb-8 text-base font-normal leading-normal text-secondary"
              dangerouslySetInnerHTML={{
                __html: learningOutcome?.description ?? '',
              }}
            />
          </TextSkeleton>
          {loadingLearningOutcome && (
            <div className="mb-2 mt-4 h-px w-full bg-[#DCDDDD]"></div>
          )}
          <div className="mt-8 flex flex-col gap-6">
            <TextSkeleton
              loading={loadingLearningOutcome}
              className="mt-3 last:mb-4"
              classChild="rounded"
              widths={['70', '100', '100', '50', '100']}
            >
              {learningOutcome?.course_outcomes?.map((outcome, index) => (
                <div key={outcome.id} className="flex items-start gap-2">
                  <div>
                    <StarCircleIcon />
                  </div>
                  <div className="flex items-center text-base font-normal leading-normal text-gray-800">
                    <div className="me-1">LO{index + 1}:</div>
                    <div
                      className="learningOutcome-description"
                      dangerouslySetInnerHTML={{ __html: outcome?.description }}
                    />
                  </div>
                </div>
              ))}
            </TextSkeleton>
          </div>
        </SappDrawerV3>
        {open && (
          <TestModal
            open={open}
            setOpen={setOpen}
            data={chapterData}
            class_user_id={previewPart?.class_user_id}
            activeCourse={() => {}}
            is_passed_course={isPassedCourse}
          />
        )}
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(CoursePartDetail)
