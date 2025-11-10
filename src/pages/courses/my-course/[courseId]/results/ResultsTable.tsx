import PaginationSappV2 from '@components/base/pagination/PaginationSappV2'
import { GradingMethod } from '@utils/constants'
import { useRouter } from 'next/router'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInfiniteQuery } from 'react-query'
import { GRADE_STATUS, PageLink } from 'src/constants'
import useSelectFilter from 'src/hooks/useSelectFilter'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { IResultsList, Results } from 'src/type/results'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon } from '@assets/icons'
import { TEST_TYPE } from 'src/constants'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import CollapseActivity from '@components/learning/activity/CollapseActivity'
import { isEmpty } from 'lodash'
import CardResultTest from '@components/learning/activity/CardResultTest'
import { Avatar, List, Skeleton } from 'antd'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import {
  IOpenChooseItem,
  ISection,
  SectionDropdownFormValues,
  backTypeMap,
  getTypeName,
} from 'src/type/courses'
import ListItemFilterMobile from '@components/common/ListItemFilterMobile'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { FormProvider, useForm } from 'react-hook-form'
import ListFilterMobile from '@components/common/ListFilterMobile'
import NoDataV2 from 'src/common/NodataV2'

const ResultsTable = ({
  openFilter,
  setOpenFilter,
}: {
  openFilter: boolean
  setOpenFilter: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [openReport, setOpenReport] = useState<boolean>(false)
  const [params, setParams] = useState<string>('')
  const observer = useRef<IntersectionObserver>()
  const [openChooseItem, setOpenChooseItem] = useState<IOpenChooseItem>({
    isOpen: false,
    type: 'section',
    name: '',
    params: '',
  })
  const [listSection, setListSection] = useState<ISection[]>([])
  const [listSubsection, setListSubsection] = useState<ISection[]>([])
  const [listUnit, setListUnit] = useState<ISection[]>([])
  const [listActivity, setListActivity] = useState<ISection[]>([])
  const queryParams = [params, pageSize, currentPage, router.query.courseId]
  const methods = useForm<SectionDropdownFormValues>({
    defaultValues: {
      section: null,
      subsection: null,
      unit: null,
      activity: null,
    },
  })

  /**
   * @description sử dụng react-query và infinite query để lấy data
   */

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      CourseKey.ResultsList,
      router.query.courseId,
      params || 'all',
      pageSize,
    ],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: any = {
        page_index: pageParam,
        page_size: pageSize,
      }
      if (params && params.trim() !== '') {
        queryParams.section_id = params
      }
      return CoursesAPI.getCourseSectionTest(
        router.query.courseId as string,
        queryParams,
      )
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.data?.metadata?.total_pages
      const current = allPages?.length || 1
      if (!totalPages) return undefined
      return current < totalPages ? current + 1 : undefined
    },
    enabled: router.query.courseId !== undefined,
    refetchOnWindowFocus: false,
  })

  const flatData = useMemo(() => {
    if (!infiniteData?.pages?.length) return []
    return infiniteData.pages.reduce((acc: any[], page: any) => {
      const items = page?.data?.data || []
      const class_user_id = page?.data?.class_user_id || ''
      const mappedItems = items.map((item: any) => ({
        ...item,
        class_user_id,
      }))
      return acc.concat(mappedItems)
    }, [])
  }, [infiniteData])

  const totalRecords = useMemo(
    () => infiniteData?.pages?.[0]?.data?.metadata?.total_records || 0,
    [infiniteData],
  )

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading],
  )

  const handleSubmit = () => {
    setOpenFilter(false)
    setParams(openChooseItem.params || '')
    setOpenChooseItem({
      ...openChooseItem,
      isOpen: false,
    })
    setCurrentPage(1)
    refetch()
  }

  const handleBack = () => {
    if (openChooseItem.isOpen && openChooseItem.type !== 'section') {
      const type = backTypeMap[openChooseItem.type]
      setOpenChooseItem({
        ...openChooseItem,
        type: type,
        name: getTypeName[type],
      })
    } else {
      setOpenChooseItem({
        ...openChooseItem,
        isOpen: false,
      })
    }
  }

  const title =
    !openChooseItem.isOpen && openFilter ? 'Sort' : openChooseItem.name

  return (
    <FormProvider {...methods}>
      <div className="my-4 hidden items-center justify-end gap-4 md:flex">
        <div className="text-sm leading-[22px] tracking-[0%] text-gray-800">
          {totalRecords} Results
        </div>
        <div className="w-[369px]">
          <FilterCourseSection
            setParams={setParams}
            showOnlySection={true}
            allowClear={true}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading &&
        [...Array(6)].map((_, index) => (
          <Skeleton key={index} active avatar>
            <List.Item.Meta avatar={<Avatar />} />
          </Skeleton>
        ))}

      {/* Empty state */}
      {!isLoading && isEmpty(flatData) && !openFilter && (
        <div className="flex h-full flex-col items-center justify-center">
          <NoDataV2 />
        </div>
      )}

      {/* Main content */}
      {!isLoading && !isEmpty(flatData) && (
        <div className="mt-6 flex flex-col gap-6 md:mt-0">
          <div className="flex flex-col gap-4">
            {flatData?.map((item: any) =>
              item?.quiz === null ? (
                <CollapseActivity key={item?.id} resultData={item} />
              ) : (
                <CardResultTest key={item?.id} resultData={item} />
              ),
            )}
          </div>

          <div ref={lastElementRef} />
          {isFetchingNextPage && (
            <div className="flex flex-col gap-2">
              {[...Array(2)].map((_, index) => (
                <Skeleton key={index} active avatar>
                  <List.Item.Meta avatar={<Avatar />} />
                </Skeleton>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grading modal */}
      <SappModalV3
        open={openReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => setOpenReport(false)}
        fullWidthBtn
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header="Awaiting Grading"
        content="Your test is currently being graded. The result will be sent to you via email as soon as the grading is complete."
      />

      {/* Mobile filter drawer */}
      <SappDrawerV3
        open={openFilter}
        handleCancel={() => setOpenFilter(false)}
        isShowBtnClose
        title={title}
        isShowFooter={openFilter}
        isShowBtnBack={openChooseItem.isOpen}
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        classNameHeader="pb-4 border-b border-gray-200"
        rootClassName="responsive-drawer-center drawer-bottom-0"
        submitButtonClassName="w-full h-10"
        btnSubmitTile="Confirm"
        placement="bottom"
      >
        {openFilter && !openChooseItem.isOpen ? (
          <ListFilterMobile setOpenChooseItem={setOpenChooseItem} />
        ) : (
          <ListItemFilterMobile
            setOpenChooseItem={setOpenChooseItem}
            openChooseItem={openChooseItem}
            listSection={listSection}
            listSubsection={listSubsection}
            listUnit={listUnit}
            listActivity={listActivity}
            setListSection={setListSection}
            setListSubsection={setListSubsection}
            setListUnit={setListUnit}
            setListActivity={setListActivity}
          />
        )}
      </SappDrawerV3>
    </FormProvider>
  )
}

export default ResultsTable
