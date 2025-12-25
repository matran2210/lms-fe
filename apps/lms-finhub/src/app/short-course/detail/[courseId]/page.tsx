'use client'
import {
  AlertInfoIcon,
  ChapterIcon,
  CloseIconPreview,
  DocumentTextIcon,
  ResourceIcon,
} from '@lms/assets'
import { Breadcrumb3Level } from '@components/courses'
import LearningOutComeModal from '@components/courses/popup/LearningOutComeModal'
import TestModal from '@components/courses/popup/TestModal'
import Layout from '@components/layout'
import BottomMenu from '@components/v2/course-detail/BottomMenu'
import CardMenuItem from '@components/v2/course-detail/CardMenuItem'
import { buildQueryString, formatDate } from '@lms/utils'
import { Alert, Divider, Skeleton } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import PreviewPartDetail from '@sapp-fe/preview-part'
import { ANIMATION, DEFAULT_PAGESIZE, ROUTES, TEST_TYPE } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  activeNotesList3Level,
  useAppDispatch,
  useCourseContext,
  UserType,
} from '@lms/contexts'
import { ISubSection } from 'src/type/courses-3-level'
import { isEmpty } from 'lodash'
import { PageLink } from 'src/constants/routes'
import { PopupLockContent } from '@lms/feature-courses'
import { LearningResource } from '@lms/ui'
// import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import PromotionalBanner from '@lms/ui/components/banner/PromotionalBanner'
import { CoursesAPI } from 'src/app/api/courses/route'
import { useParams, useRouter } from 'next/navigation'

const CourseDetail = () => {
  const dispatch = useAppDispatch()
  const { isMobileView, isTabletView, isAlwaysShowSidebar } =
    useTailwindBreakpoint()
  const [chapterDetail, setChapterDetail] = useState<any>(null)
  const [loadingChapter, setLoadingChapter] = useState(false)
  const [chapterId, setChapterId] = useState<string>('')
  const [openLearningOutcome, setOpenLearningOutcome] = useState(false)
  const [listLearningOutcome, setListLearningOutcome] = useState<ISubSection[]>(
    [],
  )
  const router = useRouter()
  const params = useParams()
  const [readMore, setReadMore] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [chapterData, setChapterData] = useState<any>({})
  const [defaultActive, setDefaultActive] = useState<string>()
  const courseChapterId = localStorage.getItem('course_chapter_id')
  const [isPassedCourse, setIsPassedCourse] = useState<boolean>(false)
  const [isOpenChapter, setIsOpenChapter] = useState<boolean>(false)
  const [openResource, setOpenResource] = useState<boolean>(false)
  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const { setOpenSidebar } = useCourseContext()

  // const handleOpenSidebar = () => {
  //   setShowSidebar(true)
  //   setOpenSidebar(true)
  // }
  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }

  const { data: previewPart, isLoading } = useQuery({
    queryKey: ['courseDetail', params?.courseId],
    queryFn: () => fetchCourseDetail(params?.courseId),
    enabled: !!params?.courseId,
    retry: false,
  })

  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async (courseId: string | string[] | undefined) => {
    const { data } = await CoursesAPI.getShortCourseDetail(
      courseId,
      1,
      DEFAULT_PAGESIZE,
    )

    const sections = data?.data?.course_sections_with_progress || []
    return {
      class_user_id: data?.class_user_id,
      children: sections,
      courseDetail: {
        ...data?.data,
        learning_progress: data?.learning_progress || {},
        description: data?.data?.description || '',
      },
    }
  }

  const focusSubSectionIds = params?.focusSubSectionIds as
    | string
    | undefined
  const focusUnitIds = params?.focusUnitIds as string | undefined
  const deadline = params?.deadline as string | undefined
  const isOverdue = dayjs(deadline).isBefore(new Date())
  const listFocusSubSectionIds = focusSubSectionIds?.split(',') || []
  const listFocusUnitIds = focusUnitIds?.split(',') || []

  const partDetail = previewPart as any

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
    if (activeItem?.course_section_link_parents?.[0]?.is_preview_locked) {
      setChapterDetail(undefined)
    } else {
      setLoadingChapter(true)
      try {
        if (course_section_id !== params?.partId) {
          const searchParams = buildQueryString({
            focusSubSectionIds,
            focusUnitIds,
            deadline,
            partId: course_section_id,
          })
          router.push(`${location.pathname}?${searchParams}`)
        }
        const res = await CoursesAPI.getCourseDetailActivity(
          id,
          course_section_id,
        )
        const nodeList = res?.data?.course_section_tree
        setIsPassedCourse(res?.data?.is_passed_course)
        const newData = nodeList?.[0]

        setChapterDetail(newData)
        localStorage.removeItem('course_chapter_id')
      } catch (error) {
      } finally {
        setLoadingChapter(false)
      }
    }
  }

  const handleOpenNotesList = () => {
    dispatch(activeNotesList3Level())
    document.body.style.overflow = 'hidden'
  }
  const handleDefaultActiveItem = () => {
    localStorage.setItem('course_chapter_id', params?.partId as string)
  }
  useEffect(() => {
    if (openLearningOutcome && chapterId && chapterDetail) {
      const listLearningOutcomeTemp = chapterDetail?.children?.filter(
        (item: ISubSection) => item?.course_learning_outcome,
      )
      setListLearningOutcome(listLearningOutcomeTemp)
    }
  }, [openLearningOutcome, chapterId, chapterDetail])

  const handleRouterActivity = (id: string, chapter: any) => {
    if (chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    } else {
      handleDefaultActiveItem()
      router.push(ROUTES.ACTIVITY(params?.courseId as string, id))
    }
  }

  const handleRouterCaseStudy = async (
    quizId: string,
    topicId: string,
    sectionId?: string | undefined,
    caseStudyId?: string | undefined,
    chapter?: any,
    quiz?: any,
  ) => {
    if (chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
      return
    }
    const isCompleted = (quiz as any)?.attempt?.number_of_attempts

    const attemptId = (quiz as any)?.attempt?.id as string | undefined

    if (isCompleted && attemptId) {
      handleDefaultActiveItem()
      router.push(
        `/case-study/result/${attemptId}?class_user_id=${previewPart?.class_user_id}&class_id=${params?.courseId}`,
      )
    } else {
      handleDefaultActiveItem()
      router.push(
        `/case-study/${topicId}?quiz_id=${quizId}&class_user_id=${previewPart?.class_user_id}&caseStudyId=${caseStudyId}&class_id=${params?.courseId}&course_section_id=${params?.course_section_id}&sectionId=${sectionId}`,
      )
    }
  }

  const handleRouterChapter = (id: string, chapter?: any) => {
    const partData = partDetail?.children?.filter(
      (item: any) => item?.id === id,
    )
    const filteredData = chapterDetail?.children?.filter(
      (item: any) => item?.quiz?.id === id,
    )
    const isLocked =
      chapter?.course_section_link_parents?.[0]?.is_preview_locked
    const testTypes = [
      TEST_TYPE.MID_TERM_TEST,
      TEST_TYPE.FINAL_TEST,
      TEST_TYPE.CHAPTER_TEST,
      TEST_TYPE.TOPIC_TEST,
    ]

    if (chapter?.course_section_type === TEST_TYPE.CHAPTER_TEST) {
      setChapterData(chapter)
    } else if (partData?.length > 0) {
      setChapterData(partData?.[0])
    } else {
      setChapterData(filteredData?.[0])
    }

    if (isLocked && testTypes.includes(chapter?.course_section_type)) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    }

    if (!chapter?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpen(true)
    }
  }

  const handleLearningOutCome = async (
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ) => {
    const res = await CoursesAPI.learningOutcomeProgress(id, course_section_id)
    if (res?.success) {
      fetchChapterDetail(params?.courseId, course_section_id)
    }
  }
  const handleChangeChapterId = (id: string) => {
    if (id) setChapterId(id)
  }

  useEffect(() => {
    if (
      partDetail?.class_user_id &&
      partDetail?.children?.learning_progress !== ''
    ) {
      const filteredChildren =
        partDetail?.courseDetail?.course_sections_with_progress?.filter(
          (child: any) => child?.course_section_type === 'PART',
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
  }, [router?.asPath, partDetail?.class_user_id])

  const handleGoBack = () => {
    router.push(PageLink.SHORT_COURSE)
  }

  useEffect(() => {
    courseChapterId && setDefaultActive(courseChapterId as string)
  }, [courseChapterId])

  const listFocusSubsectionNames = useMemo(() => {
    if (listFocusSubSectionIds?.length && partDetail?.children?.length) {
      return listFocusSubSectionIds?.map((id) => {
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

  return (
    <Layout
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
      className="relative"
      title="Course Detail"
    >
      <PromotionalBanner />
      {listFocusSubSectionIds?.length || listFocusUnitIds?.length ? (
        <div className="border-zinc-100 relative flex h-16 w-full items-center justify-center border-b-[0.57px] bg-white">
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

      <div className="mt-4 h-full">
        {isLoading ? (
          <Skeleton.Input size="default" className="w-1/2 pt-6" block />
        ) : (
          <>
            {isAlwaysShowSidebar && (
              <Breadcrumb3Level
                className="!pt-0"
                currentPage={previewPart?.courseDetail?.name}
                tabs={[
                  {
                    title: 'My Course',
                    link: PageLink.SHORT_COURSE,
                  },
                  {
                    title: previewPart?.courseDetail?.name,
                    link: '#',
                  },
                ]}
              />
            )}
          </>
        )}

        <div data-aos={ANIMATION.DATA_AOS}>
          <PreviewPartDetail
            chapterMenu={partDetail}
            fetchChapterDetail={fetchChapterDetail}
            chapterDetail={chapterDetail}
            handleChangeChapterId={handleChangeChapterId}
            loading={isLoading}
            loadingChapter={loadingChapter}
            setLoadingChapter={setLoadingChapter}
            setOpenLearningOutcome={setOpenLearningOutcome}
            course_id={params.courseId as any}
            course_section_id={params.course_section_id as any}
            handleRouterActivity={handleRouterActivity}
            handleRouterCaseStudy={handleRouterCaseStudy}
            handleLearningOutCome={handleLearningOutCome}
            handleRouterChapter={handleRouterChapter}
            readMore={readMore}
            setReadMore={setReadMore}
            defaultActive={params.chapter ?? defaultActive}
            focus_id={params?.focus_id as string}
            handleGetItem={handleActive}
            handleGoBack={handleGoBack}
            listFocusSubSectionIds={listFocusSubSectionIds}
            listFocusUnitIds={listFocusUnitIds}
            deadline={deadline}
            setIsOpenChapter={setIsOpenChapter}
            isOpenChapter={isOpenChapter}
            isLMSV2
            isMobileView={isMobileView}
            isTabletView={isTabletView}
            isShortCourse
          />
        </div>
        <BottomMenu>
          <div className="flex items-center justify-center gap-5">
            <CardMenuItem
              title="Note List"
              icon={<DocumentTextIcon className="h-6 w-6" />}
              onClick={handleOpenNotesList}
            />
            <CardMenuItem
              title="Resource"
              icon={<ResourceIcon className="h-6 w-6" />}
              onClick={() => setOpenResource(true)}
            />
            <Divider
              type="vertical"
              className="my-auto h-6 border-white text-white"
              orientation="center"
            />
            <CardMenuItem
              title="Chapter"
              icon={<ChapterIcon />}
              onClick={() => setIsOpenChapter(true)}
              className="md:flex"
            />
          </div>
        </BottomMenu>
        {!isEmpty(listLearningOutcome) && (
          <LearningOutComeModal
            open={openLearningOutcome}
            onClose={() => setOpenLearningOutcome(false)}
            listLearningOutcome={listLearningOutcome}
            handleRouterChapter={handleRouterChapter}
            handleRouterActivity={handleRouterActivity}
          />
        )}

        <TestModal
          title={chapterData?.name}
          open={open}
          setOpen={setOpen}
          data={chapterData}
          class_user_id={previewPart?.class_user_id}
          is_passed_course={isPassedCourse}
        />

        <LearningResource
          open={openResource}
          setOpenResource={setOpenResource}
        />
      </div>
      <PopupLockContent showForm={openPopupCTA} setShowForm={setOpenPopupCTA} />
      {/* <CtaTrial /> */}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(CourseDetail)
