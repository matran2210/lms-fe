'use client'
import {
  AlertInfoIcon,
  ChapterIcon,
  CloseIconPreview,
  DocumentTextIcon,
  ResourceIcon,
  StarCircleIcon,
} from '@lms/assets'
import {
  activeNotesList,
  resetNotesList,
  useCourseContext,
  UserType,
} from '@lms/contexts'
import { ANIMATION, ILearningOutcome, TEST_TYPE } from '@lms/core'
import { CardMenuItem, PopupLockContent, TestModal } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  BottomMenu,
  CtaTrial,
  Layout,
  LearningResource,
  SappBreadCrumbs,
  SappDrawerV3,
} from '@lms/ui'
import {
  buildQueryString,
  formatDate,
  handleCheckIsNotActivated,
} from '@lms/utils'
import { Alert, Divider, Skeleton } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import PreviewPartDetail from '@sapp-fe/preview-part'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import { TreeHelper } from 'src/helper/tree'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { CoursesAPI } from 'src/api/courses/index'
import StoryOverview from '@components/storyline/modal/StoryOverview'
import { IStoryline } from '@lms/core'
import { showPopupActivatedCourse } from '@lms/contexts/redux/slice/Popup/ActivatedCourse'

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
  const dispatch = useAppDispatch()

  const { isAlwaysShowSidebar, isMobileView, isTabletView } =
    useTailwindBreakpoint()
  const [chapterDetail, setChapterDetail] = useState<any>(null)
  const [loadingChapter, setLoadingChapter] = useState(true)
  const [openLearningOutcome, setOpenLearningOutcome] = useState(false)
  const [learningOutcome, setLearningOutcome] = useState<ILearningOutcome>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const [readMore, setReadMore] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [chapterData, setChapterData] = useState<any>({})
  const [defaultActive, setDefaultActive] = useState<string>()
  const courseChapterId = localStorage.getItem('course_chapter_id')
  const [isPassedCourse, setIsPassedCourse] = useState<boolean>(false)
  const [isOpenChapter, setIsOpenChapter] = useState<boolean>(false)
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true)
  const [openResource, setOpenResource] = useState<boolean>(false)
  const selectorActivated = useAppSelector?.(
    (state) => state.activateCourseReducer,
  )
  const [openStory, setOpenStory] = useState<{
    isOpen: boolean
    storyline?: IStoryline
  }>({ isOpen: false, storyline: undefined })
  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()

  const useGetData = (queryKey: string) => {
    const fetchData = async () => {
      const { data } = await CoursesAPI.getPartDetail(
        params.id,
        params.course_section_id,
      )
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled:
        params.id !== undefined && params.course_section_id !== undefined,
      retry: false,
      onError: (error: any) => {
        const errResponse = error?.response?.data?.error
        const isNotActivated = handleCheckIsNotActivated(errResponse?.code)
        if (isNotActivated) {
          dispatch?.(
            showPopupActivatedCourse({
              timeActive: errResponse?.replacements?.FLEXIBLE_DAYS,
              classId: errResponse?.replacements?.CLASS_ID,
              courseType: errResponse?.replacements?.COURSE_TYPE,
            }),
          )
        }
      },
    })
  }

  const focusSubSectionIds = query?.focusSubSectionIds as string | undefined
  const focusUnitIds = query?.focusUnitIds as string | undefined
  const deadline = query?.deadline as string | undefined
  const isOverdue = dayjs(deadline).isBefore(new Date())
  const listFocusSubSectionIds = focusSubSectionIds?.split(',') || []
  const listFocusUnitIds = focusUnitIds?.split(',') || []
  const { data: previewPart, isLoading } = useGetData('course-part-detail')

  const tree = TreeHelper.convertFromArray(previewPart?.course_section_tree)
  const partDetail = tree[0] as any
  const [activeItem, setActiveItem] = useState<any>()

  const handleRouterStoryline = (status: boolean, storyline: IStoryline) => {
    setOpenStory({
      isOpen: !!status,
      storyline,
    })
  }
  const closeStoryline = () => {
    setOpenStory({
      isOpen: false,
      storyline: undefined,
    })
  }
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
        if (course_section_id !== query.chapter) {
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
        const newData = nodeList?.map((item: IProps) => {
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
      } catch (error: any) {
        const errResponse = error?.response?.data?.error
        const isNotActivated = handleCheckIsNotActivated(errResponse?.code)
        if (isNotActivated) {
          dispatch?.(
            showPopupActivatedCourse({
              timeActive: errResponse?.replacements?.FLEXIBLE_DAYS,
              classId: errResponse?.replacements?.CLASS_ID,
              courseType: errResponse?.replacements?.COURSE_TYPE,
            }),
          )
        }
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
    try {
      const res = await CoursesAPI.getCourseLearningOutcome(
        chapterDetail?.course_learning_outcome?.id,
        params?.id || undefined,
      )
      setLearningOutcome(res?.data)
    } catch (error) {}
  }

  const handleOpenNotesList = () => {
    dispatch(activeNotesList())
    setOpenResource(false)
    setIsOpenChapter(false)
    document.body.style.overflow = 'hidden'
  }

  const handleOpenResource = () => {
    setOpenResource(true)
    setIsOpenChapter(false)
    dispatch(resetNotesList())
    document.body.style.overflow = 'auto'
  }

  const handleOpenChapter = () => {
    setIsOpenChapter(true)
    setOpenResource(false)
    dispatch(resetNotesList())
    document.body.style.overflow = 'auto'
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
      router.push(
        `/courses/${params.id}/activity/${id}?chapter=${query.chapter}&unit=${chapter?.parent_id}&course_section_id=${params.course_section_id}`,
      )
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
      getCaseStudy?.attempt?.id &&
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
        localStorage.setItem('course_chapter_id', query?.chapter as string)
        router.push(
          `/case-study/result/${getCaseStudy?.attempt?.id}?class_user_id=${previewPart.class_user_id}&class_id=${params?.id}&course_section_id=${params?.course_section_id}`,
        )
      }
    } else {
      if (
        sectionId &&
        caseStudyId &&
        !chapter?.course_section_link_parents?.[0]?.is_preview_locked
      ) {
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
        localStorage.setItem('course_chapter_id', query?.chapter as string)
        router.push(
          `/case-study/${topicId}?quiz_id=${quizId}&class_user_id=${previewPart.class_user_id}&caseStudyId=${caseStudyId}&class_id=${params?.id}&course_section_id=${params?.course_section_id}`,
        )
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
    } else {
      setChapterData(filteredData?.[0])
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
        : handleUnlockedSection(() => {
            const firstChild = course_section?.children?.[0]
            if (firstChild?.course_section_type === 'STORY_LINE') {
              handleCancel()
              handleRouterStoryline(true, firstChild)
            } else {
              handleRouterActivity(course_section?.children?.[0]?.id, undefined)
            }
          })
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
      params.id,
      chapterDetail?.id,
    )
    if (res?.success) {
      fetchChapterDetail(id, course_section_id)
    }
  }

  const handleCaseStudyProcess = async (
    courseId: string,
    caseStudyId: string,
  ) => {
    await CoursesAPI.caseStudyProgress(params.id, courseId, caseStudyId)
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
  }, [pathname, searchParams, partDetail?.id])

  const handleGoBack = () => {
    router.push(
      PageLink.COURSE_DETAIL.replace('[courseId]', params.id as string),
    )
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

  const heightContent = isMobileView
    ? '102px'
    : isTabletView
      ? '128px'
      : '144px'

  useEffect(() => {
    if (!isLoading && !loadingChapter) {
      setLoadingScreen(false)
    }
  }, [isLoading, loadingChapter])

  const isLoadingActivity = selectorActivated.openActive

  return (
    <Layout title="Course Part Detail" showSidebar={isAlwaysShowSidebar}>
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
              <span className="text-accent">
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
      <div className="mb-24 mt-4 min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-5rem)]">
        {loadingScreen || isLoadingActivity ? (
          <Skeleton.Input size="default" active className="!w-1/2" block />
        ) : (
          <SappBreadCrumbs
            className="mb-2"
            isTeacher={false}
            breadcrumbs={[
              {
                title: 'My Course',
                link: PageLink.COURSES,
              },
              {
                title: previewPart?.name,
                link: PageLink.COURSE_DETAIL.replace(
                  '[courseId]',
                  params.id as string,
                ),
              },
              {
                title: partDetail?.name,
                link: '',
              },
            ]}
          />
        )}
        <div data-aos={ANIMATION.DATA_AOS}>
          <PreviewPartDetail
            chapterMenu={partDetail}
            fetchChapterDetail={fetchChapterDetail}
            chapterDetail={chapterDetail}
            loading={loadingScreen || isLoadingActivity}
            loadingChapter={loadingScreen || loadingChapter}
            setLoadingChapter={setLoadingChapter}
            setOpenLearningOutcome={setOpenLearningOutcome}
            course_id={params.id as string}
            course_section_id={params.course_section_id as string}
            handleRouterActivity={handleRouterActivity}
            handleRouterCaseStudy={handleRouterCaseStudy}
            handleLearningOutCome={handleLearningOutCome}
            handleRouterChapter={handleRouterChapter}
            readMore={readMore}
            setReadMore={setReadMore}
            defaultActive={query.chapter ?? defaultActive}
            focus_id={query?.focus_id as string}
            handleGetItem={handleActive}
            handleGoBack={handleGoBack}
            listFocusSubSectionIds={listFocusSubSectionIds}
            listFocusUnitIds={listFocusUnitIds}
            deadline={deadline}
            // handleShowToast={handleShowToast}
            setIsOpenChapter={setIsOpenChapter}
            isOpenChapter={isOpenChapter}
            isLMSV2
            isMobileView={isMobileView}
            isTabletView={isTabletView}
            handleRouterStoryline={handleRouterStoryline}
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
              onClick={handleOpenResource}
            />
            <Divider
              type="vertical"
              className="my-auto h-6 border-white text-white"
              orientation="center"
            />
            <CardMenuItem
              title="Chapter"
              icon={<ChapterIcon />}
              onClick={handleOpenChapter}
              className="md:flex"
            />
          </div>
        </BottomMenu>
        <SappDrawerV3
          open={openLearningOutcome}
          onClose={handleCancel}
          title={learningOutcome?.name ?? 'Learning Outcome'}
          handleCancel={handleCancel}
          btnSubmitTile="Next Lesson"
          handleSubmit={handleNextLesson}
          isShowFooter
          closable
          isShowBtnClose
          placement={isMobileView ? 'bottom' : 'right'}
          submitButtonClassName={isMobileView ? 'w-full' : ''}
          rootClassName={
            isMobileView
              ? 'responsive-drawer-center-mobile-lo'
              : 'responsive-drawer-base'
          }
        >
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: `calc(100% - ${heightContent})`,
            }}
          >
            <div
              style={{ borderBottom: '1px solid #DCDDDD' }}
              className={clsx(
                'learningOutcome-description text-sm font-normal leading-normal text-secondary md:text-base',
                {
                  'pb-8': learningOutcome?.description,
                },
              )}
              dangerouslySetInnerHTML={{
                __html: learningOutcome?.description ?? '',
              }}
            />
            <div className="mt-8 flex flex-col gap-6">
              {learningOutcome?.course_outcomes?.map((outcome, index) => (
                <div key={outcome.id} className="flex items-start gap-2">
                  <div>
                    <StarCircleIcon color="#1C274C" />
                  </div>
                  <div className="flex items-start text-sm font-normal leading-normal text-gray-800 md:text-base">
                    <div className="me-1">LO{index + 1}:</div>
                    <div
                      className="learningOutcome-description"
                      dangerouslySetInnerHTML={{ __html: outcome?.description }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SappDrawerV3>
        <TestModal
          open={open}
          setOpen={setOpen}
          data={chapterData}
          class_user_id={previewPart?.class_user_id}
          activeCourse={() => {}}
          is_passed_course={isPassedCourse}
        />
        <LearningResource
          open={openResource}
          setOpenResource={setOpenResource}
        />
      </div>
      <div className="sticky inset-x-0 bottom-4 z-50 hidden md:block">
        <div className="w-full">
          <CtaTrial />
        </div>
      </div>
      <PopupLockContent showForm={openPopupCTA} setShowForm={setOpenPopupCTA} />
      <StoryOverview
        open={openStory.isOpen}
        setOpen={closeStoryline}
        storylineData={openStory.storyline}
      />
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(CoursePartDetail)
