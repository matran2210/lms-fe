import { CloseIcon } from '@lms/assets'
import { ANIMATION, LAYOUT, QUESTION_TYPES } from '@lms/core'
import { ButtonPrimary, ButtonSecondary, FullScreenLayout } from '@lms/ui'
import { roundNumber } from '@utils/helpers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CoursesAPI } from '../../api/courses/index'
import { SappTable } from '@lms/ui/components/base'

const headers = [
  {
    label: '#',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-62px',
  },
  {
    label: 'Question',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-max xl:min-w-[725px]',
  },
  {
    label: 'Type',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[117px]',
  },
  {
    label: 'Result',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[70px]',
  },
  {
    label: '',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[20px]',
  },
]

const TableCaseStudyResult = () => {
  const [scoreDetail, setScoreDetail] = useState<any>({
    answers: [],
    meta: {},
  })
  const [topicAttemptDetail, setTopicAttemptDetail] = useState<any>()
  const router = useRouter()

  const fetchScoreDetail = async (page_index: number, page_size: number) => {
    try {
      const res = await CoursesAPI.getCaseStudyAttemptsTable(
        router.query.id as string,
        page_index,
        page_size,
      )
      return res
    } catch (error) {}
  }
  const fetchTopicAttemptDetail = async (id: string) => {
    try {
      const res = await CoursesAPI.getTopicAttemptsDetail(id)
      return res
    } catch (error) {}
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return
    }
    handlNextPage()
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scoreDetail])

  const handlNextPage = async () => {
    const totalPages = scoreDetail?.meta?.total_pages
    const pageIndex = scoreDetail?.meta?.page_index
    const pageSize = scoreDetail?.meta?.page_size
    if (totalPages && pageIndex < totalPages) {
      const res = await fetchScoreDetail(pageIndex + 1, pageSize)
      const results = scoreDetail?.answers?.concat(res?.data?.answers)
      setScoreDetail({
        meta: res?.data?.meta,
        answers: results,
      })
    }
  }
  const getScoreDetail = async () => {
    const res = await fetchScoreDetail(1, 20)
    const topic = await fetchTopicAttemptDetail(router.query.id as string)
    setScoreDetail(res?.data)
    setTopicAttemptDetail(topic?.data)
  }
  const handleRetake = (
    topicId: string,
    quizId: string,
    class_user_id: string,
    class_id?: string,
    course_section_id?: string,
  ) => {
    router.replace({
      pathname: `/case-study/${topicId}`,
      query: {
        quiz_id: quizId,
        class_user_id: class_user_id,
        class_id: class_id,
        course_section_id: course_section_id,
      },
    })
  }
  // Hàm ánh xạ giá trị enum với tên tương ứng
  const getTypeName = (type: QUESTION_TYPES): string => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return 'True/False'
      case QUESTION_TYPES.ONE_CHOICE:
        return 'One Choice'
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return 'Multiple Choice'
      case QUESTION_TYPES.MATCHING:
        return 'Matching'
      case QUESTION_TYPES.SELECT_WORD:
        return 'Select Word'
      case QUESTION_TYPES.FILL_WORD:
        return 'Fill Up'
      case QUESTION_TYPES.DRAG_DROP:
        return 'Drag Drop'
      case QUESTION_TYPES.ESSAY:
        return 'Constructed'
      default:
        return '--'
    }
  }

  useEffect(() => {
    if (router.query.id) {
      getScoreDetail()
    }
  }, [router.query.id])

  return (
    <FullScreenLayout title="Case Study Result">
      <div className="relative" data-aos={ANIMATION.DATA_AOS}>
        <div
          className="fixed right-0 z-20 cursor-pointer px-6 py-4"
          onClick={() => router.back()}
        >
          <CloseIcon />
        </div>
        <div className="m-auto max-h-full max-w-[1144px] bg-white pt-8">
          <div className="mb-10 flex flex-row items-center justify-between px-6 xl:px-0">
            <div className="pr-4">
              <div className="line-clamp-1 text-xl font-medium text-bw-1">
                {topicAttemptDetail?.question_topic?.name}
              </div>
              <div className="pt-2.5 text-base">
                <span className="pt-1.5 font-normal text-gray-1">
                  Your Score:
                </span>{' '}
                <span className="font-bold text-state-error">
                  {topicAttemptDetail?.score}%
                </span>
              </div>
            </div>
            {topicAttemptDetail?.quiz?.is_limited ? (
              topicAttemptDetail?.quiz?.limit_count > 1 ? (
                topicAttemptDetail?.quiz?.limit_count >
                topicAttemptDetail?.retake_times ? (
                  <ButtonPrimary
                    title={`Retake ${topicAttemptDetail?.retake_times}${
                      topicAttemptDetail?.quiz?.is_limited
                        ? `/${topicAttemptDetail?.quiz?.limit_count}`
                        : '/Unlimited'
                    }`}
                    size="medium"
                    className={'shrink-0 !font-medium'}
                    onClick={() =>
                      handleRetake(
                        topicAttemptDetail?.question_topic?.id,
                        topicAttemptDetail?.quiz?.id,
                        topicAttemptDetail?.class_user_id as string,
                        router?.query?.class_id as string,
                        router?.query?.course_section_id as string,
                      )
                    }
                  />
                ) : (
                  <ButtonSecondary
                    disabled={true}
                    title={`Retake ${topicAttemptDetail?.retake_times}${
                      topicAttemptDetail?.quiz?.is_limited
                        ? `/${topicAttemptDetail?.quiz?.limit_count}`
                        : '/Unlimited'
                    }`}
                    size="medium"
                    className={'shrink-0 !font-medium'}
                  />
                )
              ) : (
                <></>
              )
            ) : (
              <ButtonPrimary
                title={`Retake ${topicAttemptDetail?.retake_times}${
                  topicAttemptDetail?.quiz?.is_limited
                    ? `/${topicAttemptDetail?.quiz?.limit_count}`
                    : '/Unlimited'
                }`}
                size="medium"
                onClick={() =>
                  handleRetake(
                    topicAttemptDetail?.question_topic?.id,
                    topicAttemptDetail?.quiz?.id,
                    topicAttemptDetail?.class_user_id as string,
                    router?.query?.class_id as string,
                    router?.query?.course_section_id as string,
                  )
                }
                className={'shrink-0 !font-medium'}
              />
            )}
          </div>

          <div className="block px-6 xl:pl-4 xl:pr-0">
            <SappTable
              headers={headers}
              loading={true}
              isCheckedAll={true}
              onChange={() => {}}
              hasCheck={false}
              // data={scoreDetail?.answers}
            >
              <>
                {scoreDetail?.answers?.map((e: any, index: number) => {
                  return (
                    <tr
                      className="border-b border-dashed border-gray-2"
                      key={e?.id}
                    >
                      <td className="pr-1 text-bw-1">{index + 1}</td>
                      <td className="m-6 pr-4 text-start">
                        <div
                          className={`line-clamp-1 cursor-pointer text-bw-1 hover:font-semibold`}
                          dangerouslySetInnerHTML={{
                            __html: String(
                              e?.question?.question_content ?? '--',
                            ),
                          }}
                          onClick={() => {
                            router.push(`/explanation/${e?.id}?title=My Course`)
                          }}
                        ></div>
                      </td>
                      <td className="m-6 pr-4 text-start text-bw-1">
                        <div className="mb-6 mr-6 mt-6 min-w-132px">
                          {getTypeName(e?.question?.qType ?? '--')}
                        </div>
                      </td>
                      <td
                        className={`m-6 pr-1 text-start
                      ${
                        e?.is_correct || e?.active === 'SUBMITED'
                          ? ' text-state-success'
                          : ' text-state-error'
                      }
                    `}
                      >
                        {e?.question?.qType !== 'ESSAY' ? (
                          <>{e?.is_correct ? 'Correct' : 'Incorrect'}</>
                        ) : (
                          <>
                            {e?.active === 'SUBMITED'
                              ? 'Submitted'
                              : 'Unfinished'}
                          </>
                        )}
                      </td>
                      <td className="m-6 pr-4 text-start text-gray-1">
                        {e?.question?.qType !== 'ESSAY' && (
                          <div className="ml-1 flex items-center">
                            <img
                              src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                              alt="Correct"
                              className="mr-1 w-4 text-state-success"
                            />
                            {roundNumber(
                              e?.question?.question_report?.ratio || 0,
                            )}
                            %
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </>
            </SappTable>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  )
}

export default TableCaseStudyResult
TableCaseStudyResult.layout = LAYOUT.FULLSCREEN_LAYOUT
