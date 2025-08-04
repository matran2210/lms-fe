import SappDrawer from '@components/base/SappDrawer'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { Alert } from 'antd'
import { useRouter } from 'next/router'
import PreviewPartDetail from 'preview-part'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink, TEST_TYPE } from 'src/constants'
import { TreeHelper } from 'src/helper/tree'
import TestModal from 'src/pages/courses/test'
import { ILearningOutcome } from 'src/type/courses'
import LayoutTeacher from '@components/layout/Teacher'
import { CoursesAPI } from 'src/pages/api/courses/index'
import { buildQueryString, formatDate } from '@utils/index'
import { useCourseContext } from '@contexts/index'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import dayjs from 'dayjs'
import { AlertInfoIcon, CloseIconPreview } from '@assets/icons'
import clsx from 'clsx'
import { ITabs } from 'src/type/common'
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

const CoursePartDetailTeacher = () => {
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

  const focusSubSectionIds = router?.query?.focusSubSectionIds as
    | string
    | undefined
  const focusUnitIds = router?.query?.focusUnitIds as string | undefined
  const deadline = router?.query?.deadline as string | undefined
  const isOverdue = dayjs(deadline).isBefore(new Date())
  const listFocusSubSectionIds = focusSubSectionIds?.split(',') || []
  const listFocusUnitIds = focusUnitIds?.split(',') || []
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
          const searchParams = buildQueryString({
            focusSubSectionIds,
            focusUnitIds,
            deadline,
            chapter: course_section_id,
          })
          router.push(`${location.pathname}?${searchParams}`)
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
        router?.query?.id || undefined,
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
        pathname: `/teachers/courses/${router.query.id}/activity/${id}`,
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
      lockSection || learningOutcome?.next_section?.is_preview_locked
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

  useEffect(() => {
    courseChapterId && setDefaultActive(courseChapterId as string)
  }, [courseChapterId])

  const listFocusSubsectionNames = useMemo(() => {
    if (listFocusSubSectionIds?.length && partDetail?.children?.length) {
      return listFocusSubSectionIds.map((id) => {
        const section = partDetail.children.find((item: any) => item.id === id)
        return section?.short_name || section?.name
      })
    }

    if (listFocusUnitIds.length && chapterDetail?.children?.length) {
      const hasUnits = chapterDetail.children.some((item: any) =>
        listFocusUnitIds.includes(item.id),
      )
      return hasUnits
        ? [chapterDetail?.chapterDetail || chapterDetail.name]
        : []
    }

    return []
  }, [partDetail, chapterDetail])

  const breadcrumbs: ITabs[] = [
    { link: PageLink.TEACHER_MY_COURSE, title: 'My Course' },
    {
      link: `/teachers/courses/my-course/${router.query.id}`,
      title: previewPart?.name,
    },
    {
      link: '#',
      title: partDetail?.name,
    },
  ]

  return (
    <LayoutTeacher title="Course Part Detail" breadcrumbs={breadcrumbs}>
      {listFocusSubSectionIds?.length || listFocusUnitIds?.length ? (
        <div className="relative flex h-16 w-full items-center justify-center border-b-[0.57px] border-zinc-100 bg-white">
          <Alert
            message={
              <div className="flex items-center gap-2">
                <span className="shrink-0">You are now learning</span>{' '}
                <span className="line-clamp-1 font-medium">
                  {listFocusSubsectionNames?.join(', ')}
                </span>
              </div>
            }
            type={isOverdue ? 'error' : 'info'}
            showIcon
            className="w-full max-w-3xl rounded-none px-[14px]"
            closable
            closeIcon={
              <span className="text-[#99A1B7]">
                <CloseIconPreview />
              </span>
            }
            icon={
              <div
                className={clsx('!mr-4', {
                  'flex items-center gap-2': isOverdue,
                })}
              >
                <AlertInfoIcon />{' '}
                {isOverdue && (
                  <span>Overdue: {formatDate(deadline || '')}</span>
                )}
              </div>
            }
          />
        </div>
      ) : null}

      <div className="main default-content-editor my-0">
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
          listFocusSubSectionIds={listFocusSubSectionIds}
          listFocusUnitIds={listFocusUnitIds}
          deadline={deadline}
        />
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
              className="learningOutcome-description pb-6 text-bw-1"
              dangerouslySetInnerHTML={{
                __html: learningOutcome?.description ?? '',
              }}
            />
          </TextSkeleton>
          {loadingLearningOutcome && (
            <div className="mb-2 mt-4 h-px w-full bg-gray-2"></div>
          )}
          <TextSkeleton
            loading={loadingLearningOutcome}
            className="mt-4 last:mb-4"
            classChild="rounded"
            widths={['70', '100', '100', '50', '100']}
          >
            {learningOutcome?.course_outcomes?.map((outcome, index) => (
              <div className="mr-3 mt-6 flex" key={outcome.id}>
                <div className="me-1 text-base font-medium leading-5 text-bw-1">
                  LO{index + 1}:
                </div>
                <div
                  className="learningOutcome-description text-bw-1"
                  dangerouslySetInnerHTML={{ __html: outcome?.description }}
                />
              </div>
            ))}
          </TextSkeleton>
        </SappDrawer>
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
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(CoursePartDetailTeacher)
