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
import Tooltip from 'src/common/Tooltip'
import { COURSE_TYPE } from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { ClassAPI } from 'src/pages/api/class'
import { ClassKey } from 'src/pages/api/queryKey'
import { UserType } from 'src/redux/types/User/urser'

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
    refetchOnWindowFocus: false,
    retry: false,
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Exam Information">
        <div className="mx-auto my-0 max-w-[1144px] max-[1199px]:mx-6">
          <>
            <div className="main relative mx-auto my-0 max-w-[1144px]">
              <div className="flex w-full items-center justify-between pb-4 pt-6">
                <BreadcrumbFilter
                  name={data?.data?.course?.name ?? ''}
                  subpath="Exam Information"
                  courseId={router.query.courseId}
                />
              </div>
            </div>
            <div className="px-7.5 py-7.5 mx-auto my-0 max-w-[1144px] bg-white">
              <h1 className="pb-7.5 line-clamp-1 flex items-center justify-between border-b border-[#F9F9F9] text-2xl font-light text-[#050505]">
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
                      <p className="text-[#A1A1A1]">Program</p>
                      <p className="font-medium text-[#050505]">
                        {data.data?.program?.name ?? '-'}
                      </p>
                    </div>
                    <div className="mt-5 grid w-3/4 grid-cols-2">
                      <p className="text-[#A1A1A1]">Subject</p>
                      <p className="font-medium text-[#050505]">
                        {data.data?.subject?.name ?? '-'}
                      </p>
                    </div>
                    <div className="mt-5 grid w-3/4 grid-cols-2">
                      <p className="text-[#A1A1A1]">Scheduled Exam Date</p>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-[#050505]">
                          {data.data?.exam?.examination?.name ?? '-'}
                        </p>
                        {data.data?.is_final_examination_subject === true ? (
                          <Tooltip
                            showTooltip={true}
                            title={
                              'This is your official exam date and can not be changed'
                            }
                          >
                            <CheckCircleTwoTone twoToneColor={'#52c41a'} />
                          </Tooltip>
                        ) : (
                          data?.data?.remaining_changes > 0 &&
                          data?.data.course.course_type ===
                            COURSE_TYPE.NORMAL_COURSE && (
                            <Tooltip
                              showTooltip={true}
                              title={'Change Exam Date'}
                            >
                              <div
                                className="cursor-pointer hover:text-primary"
                                onClick={() => setIsOpen(true)}
                              >
                                <EditIcon />
                              </div>
                            </Tooltip>
                          )
                        )}
                      </div>
                    </div>
                    <ExamEditDrawer
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      classId={router.query.courseId as string}
                      onSuccess={() => {
                        queryClient.invalidateQueries({
                          queryKey: [ClassKey.ExamInfo],
                        })
                      }}
                      remainingChanges={data?.data?.remaining_changes}
                      currentValue={data?.data?.exam?.id}
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

export default withAuthorization([UserType.STUDENT])(ExamInformation)
