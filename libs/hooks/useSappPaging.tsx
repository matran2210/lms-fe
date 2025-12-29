"use client"
import { useQuery, UseQueryResult } from 'react-query'
import { TablePaginationConfig } from 'antd'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useFeature } from '@lms/contexts'

interface UsePagingProps {
  uniqueKey: string
  queryFn: (...args: any[]) => Promise<any>
  params: Record<string, any>
  enabled?: boolean
}

interface UsePagingResultSapp<TData = any, TError = unknown>
  extends Omit<UseQueryResult<TData, TError>, 'data' | 'isLoading'> {
  data: TData
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  isLoading: boolean
  handleChangeParams: (currentPage: number, pageSize: number) => void
}

const useSappPaging = ({
  uniqueKey,
  queryFn,
  params,
  enabled = true,
}: UsePagingProps): UsePagingResultSapp => {
  const { router } = useFeature()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true, // Hiển thị lựa chọn số lượng trang
    showQuickJumper: true, // Hiển thị tùy chọn chuyển nhanh trang
  })

  const { data, isLoading, ...other } = useQuery({
    queryKey: [uniqueKey, pagination.current, pagination.pageSize, params],
    queryFn,
    enabled: !!uniqueKey && enabled, // Chỉ chạy khi uniqueKey có giá trị hợp lệ và enabled = true
    retry: false, // Không thử lại nếu request bị lỗi
  })

  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }

  useEffect(() => {
    if (
      data?.meta?.total_records ||
      data?.metadata?.total_records ||
      data?.data?.metadata?.total_records ||
      data?.data?.meta?.total_records
    ) {
      setPagination((prev) => ({
        ...prev,
        total:
          data?.meta?.total_records ||
          data?.metadata?.total_records ||
          data?.data?.metadata?.total_records ||
          data?.data?.meta?.total_records,
      }))
    }
  }, [data])

  return {
    data, // Dữ liệu trả về từ queryFn, thường là danh sách hoặc object chứa dữ liệu phân trang
    pagination, // Cấu hình phân trang hiện tại: current page, page size, total, v.v.
    setPagination, // Hàm cho phép cập nhật state phân trang thủ công nếu cần
    isLoading, // Trạng thái loading từ react-query (đang fetch dữ liệu hay không)
    handleChangeParams, // Hàm dùng để cập nhật current page và page size khi user thao tác với bảng
    ...other, // Các thuộc tính khác còn lại từ useQuery như error, refetch, isError, isSuccess, etc.
  }
}

export default useSappPaging
