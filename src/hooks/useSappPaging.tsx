import { useQuery } from 'react-query'
import { TablePaginationConfig } from 'antd'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'

interface UsePagingProps {
  uniqueKey: string
  queryFn: (...args: any[]) => Promise<any>
  params: any
}

interface UsePagingResult {
  data: any
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  isLoading: boolean
  handleChangeParams: (currentPage: number, pageSize: number) => void
}

const useSappPaging = ({
  uniqueKey,
  queryFn,
  params,
}: UsePagingProps): UsePagingResult => {
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true, // Hiển thị lựa chọn số lượng trang
    showQuickJumper: true, // Hiển thị tùy chọn chuyển nhanh trang
  })

  const { data, isLoading } = useQuery({
    queryKey: [uniqueKey, pagination.current, pagination.pageSize, params],
    queryFn,
    enabled: !!uniqueKey,
    retry: false,
  })

  useEffect(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_index: pagination.current,
          page_size: pagination.pageSize,
          ...params,
        },
      },
      undefined,
      { shallow: true },
    )
  }, [pagination, params])

  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }

  useEffect(() => {
    if (data?.meta?.total_records) {
      setPagination((prev) => ({
        ...prev,
        total: data?.meta?.total_records,
      }))
    }
  }, [data])

  return {
    data,
    pagination,
    setPagination,
    isLoading,
    handleChangeParams,
  }
}

export default useSappPaging
