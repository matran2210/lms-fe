'use client'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { PencilIcon } from '@lms/assets'
import { IExamInformation, TitleSidebar } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  ActionCellWithPopover,
  ExaminationInfo,
  HeaderMobile,
  InfoItemProps,
  Layout,
  PaginationSapp,
  SappTable,
} from '@lms/ui'
import { getDuration } from '@lms/utils'
import { ColumnsType } from 'antd/es/table'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { UserKey } from 'src/api/queryKey'
import { UserApi } from 'src/api/user'
import { PageLink } from 'src/constants/routers'

const ExamInformation = () => {
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<IExamInformation>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const router = useRouter()

  const observer = useRef<IntersectionObserver>()
  const handleBack = () => {
    router.push(PageLink.COURSES)
  }

  /**
   * @description sử dụng react-query và infinite query để lấy data
   */
  const {
    data: mobileData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading: isMobileLoading,
  } = useInfiniteQuery({
    queryKey: ['examListMobile'],
    queryFn: ({ pageParam }) =>
      UserApi.getExamination(pageParam || 1, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.data?.data?.length &&
        allPages?.length < lastPage?.data?.data?.metadata?.total_pages
        ? allPages?.length + 1
        : undefined
    },
    enabled: isMobileView, // ❗ Chỉ gọi khi là mobile view
    retry: false,
  })

  const dataMobile = useMemo(() => {
    return mobileData?.pages.reduce((acc: IExamInformation[], page) => {
      return [...acc, ...page?.data?.data?.data]
    }, [])
  }, [mobileData])

  const {
    data: normalData,
    isLoading: isNormalLoading,
    refetch: refetchNormal,
  } = useQuery({
    queryKey: [UserKey.ExamList, pageIndex, pageSize],
    queryFn: () => UserApi.getExamination(pageIndex, pageSize),
    select: (data) => data?.data?.data,
    retry: false,
    enabled: !isMobileView, // ❗ Chỉ gọi khi Tablet or Desktop
  })

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isMobileLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching, isMobileLoading],
  )

  const handleEdit = (record: IExamInformation) => {
    setIsDrawerOpen(true)
    setCurrentRow(record)
  }
  const textStyle = 'text-base font-medium text-gray-800'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap w-[418px]`
  const className = 'custom-column-table'

  const columnsValue: ColumnsType<IExamInformation> = [
    {
      title: 'Course',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.class?.course?.name}
          className={textTruncateStyle}
        />
      ),
      width: 450,
    },
    // {
    //   title: 'Class Code',
    //   className: className,
    //   align: 'center',
    //   render: (record) => (
    //     <NameNoActionCell dataColumn={record?.class?.code} isCenter />
    //   ),
    //   width: 350,
    // },
    {
      title: 'Program',
      className: className,
      align: 'center',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.class?.course?.course_categories[0].name}
          isCenter
        />
      ),
      width: 100,
    },
    {
      title: 'Duration',
      className: className,
      align: 'center',
      render: (record) => (
        <NameNoActionCell
          dataColumn={getDuration(record?.started_at, record?.finished_at)}
          isCenter
        />
      ),
      width: 300,
    },
    {
      title: 'Exam Date',
      className: className,
      align: 'center',
      render: (record) => (
        <NameNoActionCell
          dataColumn={record?.examination_subject?.examination?.name}
          isCenter
        />
      ),
      width: 120,
    },
    {
      title: '',
      key: 'actions',
      className: className,
      render: (record) => {
        return (
          <div className="flex justify-end">
            {!record?.is_final_examination_subject &&
              record?.remaining_changes > 0 && (
                <ActionCellWithPopover
                  listAction={[
                    {
                      icon: <PencilIcon className="h-5 w-5" />,
                      nameAction: 'Edit',
                      action: () => handleEdit(record),
                    },
                  ]}
                />
              )}
          </div>
        )
      },
    },
  ]

  const InfoItem = ({ label, value }: InfoItemProps) => {
    return (
      <div className="flex justify-start gap-2 text-sm font-normal text-gray-400">
        <div>{label}</div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {value || '-'}
        </div>
      </div>
    )
  }
  const contentMobile = () => {
    return (
      <div className="flex flex-col gap-4 overflow-y-auto">
        {dataMobile?.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col rounded-xl bg-white p-4 text-sm shadow-small md:text-base"
            ref={lastElementRef}
          >
            <div className="mb-4 text-base font-semibold text-gray-800">
              {item?.class?.course?.name}
            </div>

            <div className="flex flex-col gap-2">
              <InfoItem label="Class Code:" value={item?.class?.code} />
              <InfoItem
                label="Program:"
                value={item?.class?.course?.course_categories[0]?.name}
              />
              <InfoItem
                label="Duration:"
                value={getDuration(item?.started_at, item?.finished_at)}
              />
            </div>
            <div
              className="mt-4 flex cursor-pointer items-end gap-2"
              onClick={() => handleEdit(item)}
            >
              <div className="text-sm font-medium text-gray-800 underline">
                Edit
              </div>
              <div>
                <PencilIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <Layout title={TitleSidebar.EXAM_LIST} showSidebar={isAlwaysShowSidebar}>
      <div className="my-4">
        <HeaderMobile
          title={TitleSidebar.EXAM_LIST}
          showIcon={isTabletView || isMobileView}
          onBack={handleBack}
        />
        <div className="mt-6">
          {isMobileView ? (
            contentMobile()
          ) : (
            <>
              <SappTable
                columns={columnsValue}
                data={normalData?.data ?? []}
                pagination={{
                  current: pageIndex,
                  pageSize: pageSize,
                  total: normalData?.metadata?.total_records,
                }}
                loading={isNormalLoading}
                isShowPagination={false}
                className="style-table rounded-xl"
              />
              {!isEmpty(normalData) && (
                <PaginationSapp
                  currentPage={normalData?.metadata?.page_index || 1}
                  pageSize={normalData?.metadata?.page_size || 10}
                  totalItems={normalData?.metadata?.total_records || 0}
                  setCurrentPage={setPageIndex}
                  setPageSize={setPageSize}
                />
              )}
            </>
          )}
        </div>
      </div>

      <ExaminationInfo
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        classIdProps={currentRow?.class?.id}
        currentValue={currentRow?.examination_subject_id}
        onSuccess={refetchNormal}
        isEditProps
        isExamList
      />
    </Layout>
  )
}

ExamInformation.displayName = 'ExamInformation'
export default ExamInformation
