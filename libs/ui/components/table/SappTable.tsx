"use client"
import type { TablePaginationConfig, TableProps } from 'antd'
import { Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { Dispatch, SetStateAction } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@lms/core'
import clsx from 'clsx'

const { Title } = Typography
interface TablePaginationParams {
  page_index: number
  page_size: number
}
export interface ReusableTableProps<DataType, ParamType>
  extends TableProps<DataType> {
  columns: Array<any>
  data: Array<any>
  pagination: TablePaginationConfig
  setPagination?: Dispatch<SetStateAction<TablePaginationConfig>>
  loading?: boolean
  handleChangeParams?: (currentPage: number, pageSize: number) => void
  titleTable?: {
    title: string
    isShowTitle: boolean
  }
  emptyText?: string
  isShowIndex?: boolean
  showFooter?: boolean
  footerComponent?: React.ReactNode
  isShowPagination?: boolean
  className?: string
}

const getIndexColumns = (
  queryParams?: TablePaginationConfig,
): ColumnsType<any> => {
  return [
    {
      title: '#',
      render: (_, __, index: number) =>
        index +
        1 +
        ((queryParams?.current || DEFAULT_PAGE_NUMBER) - 1) *
          (queryParams?.pageSize || DEFAULT_PAGE_SIZE),

      width: 48,
    },
  ]
}

const SappTable = <DataType, ParamType extends TablePaginationParams>({
  columns,
  data,
  pagination,
  setPagination,
  loading,
  handleChangeParams,
  titleTable = { title: '', isShowTitle: false },
  emptyText,
  isShowIndex = false,
  showFooter = false,
  footerComponent = undefined,
  isShowPagination = true,
  className = '',
  ...props
}: ReusableTableProps<DataType, ParamType>) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (setPagination) {
      setPagination(pagination)
    }
    const currentPage = pagination.current || DEFAULT_PAGE_NUMBER
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE
    if (handleChangeParams) {
      handleChangeParams(currentPage, pageSize)
    }
  }

  return (
    <>
      {titleTable?.isShowTitle && titleTable?.title && (
        <Title level={5} className="mt-6 text-gray-700">
          {titleTable.title}
        </Title>
      )}
      <Table<DataType>
        dataSource={data}
        pagination={
          isShowPagination
            ? {
                ...pagination,
                showQuickJumper: false,
                showSizeChanger: true,
                responsive: true,
              }
            : false
        }
        onChange={handleTableChange}
        loading={loading}
        rowKey={props.rowKey || 'id'}
        scroll={{ x: 'max-content' }}
        className={clsx('sapp-table', className)}
        locale={{ emptyText: emptyText }} // ← Customize here
        footer={showFooter ? () => footerComponent : undefined}
        {...props}
        columns={[
          ...(isShowIndex ? getIndexColumns(pagination) : []),
          ...(columns ?? []),
        ]}
      />
    </>
  )
}

export default SappTable
