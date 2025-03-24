import { CheckCircleTwoTone } from '@ant-design/icons'
import { EditIcon } from '@assets/icons'
import Layout from '@components/layout'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import ExamEditDrawer from '@components/profile/ExamInformation/ExamEditDrawer'
import { Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import NoData from 'src/common/NoData'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import SappTooltip from 'src/common/SappTooltip'
import { ClassAPI } from 'src/pages/api/class'
import { ClassKey } from 'src/pages/api/queryKey'

const ExamInformation = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isSuccess, isLoading, isError, isFetching } = useQuery({
    queryKey: [ClassKey.ExamInfo],
    queryFn: () =>
      router.query.courseId
        ? ClassAPI.getExamInfo(router.query.courseId as string)
        : Promise.reject('courseId is undefined'),
    enabled: router.isReady,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Exam Information">
        <div className="mx-auto my-0 max-w-xxl xl-max:mx-6">
          <>
            <div className="main relative mx-auto my-0 max-w-xxl">
              <div className="flex w-full items-center justify-between pb-4 pt-6">
                <BreadcrumbFilter
                  name={data?.data.course.name ?? ''}
                  subpath="Exam Information"
                  courseId={router.query.courseId}
                />
              </div>
            </div>
            <div className="mx-auto my-0 max-w-xxl bg-white px-7.5 py-7.5">
              <h1 className="line-clamp-1 flex items-center justify-between border-b border-gray-4 pb-7.5 text-2xl font-light text-bw-1">
                <span className="ml-1.5 font-medium">Exam Information</span>
              </h1>
              {isError && (
                <div className="mt-3 grid place-items-center">
                  <NoData />
                </div>
              )}
              {isLoading || isFetching ? (
                <Skeleton />
              ) : (
                isSuccess && (
                  <>
                    <div className="mt-5 grid w-3/4 grid-cols-2">
                      <p className="text-gray-1">Program</p>
                      <p className="font-medium text-bw-1">
                        {data.data?.program?.name ?? '-'}
                      </p>
                    </div>
                    <div className="mt-5 grid w-3/4 grid-cols-2">
                      <p className="text-gray-1">Subject</p>
                      <p className="font-medium text-bw-1">
                        {data.data?.subject?.name ?? '-'}
                      </p>
                    </div>
                    <div className="mt-5 grid w-3/4 grid-cols-2">
                      <p className="text-gray-1">Scheduled Exam Date</p>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-bw-1">
                          {data.data?.exam?.examination?.name ?? '-'}
                        </p>
                        {data.data?.is_final_examination_subject === true ? (
                          <SappTooltip
                            showTooltip={true}
                            title={
                              'This is your official exam date and can not be changed'
                            }
                          >
                            <CheckCircleTwoTone twoToneColor={'#52c41a'} />
                          </SappTooltip>
                        ) : (
                          data.data.remaining_changes > 0 && (
                            <SappTooltip
                              showTooltip={true}
                              title={'Change Exam Date'}
                            >
                              <div
                                className="cursor-pointer hover:text-primary"
                                onClick={() => setIsOpen(true)}
                              >
                                <EditIcon />
                              </div>
                            </SappTooltip>
                          )
                        )}
                      </div>
                    </div>
                    <ExamEditDrawer
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      data={data}
                      classId={router.query.courseId as string}
                      onSuccess={() => {
                        queryClient.invalidateQueries({
                          queryKey: [ClassKey.ExamInfo],
                        })
                      }}
                      remainingChanges={data.data.remaining_changes}
                    />
                  </>
                )
              )}
            </div>
          </>
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default ExamInformation
