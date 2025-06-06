import type { TablePaginationConfig, TableProps } from 'antd'
import { Table, Typography } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'

const { Title } = Typography

interface BaseTableProps {
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
}

const SappTable = <T extends { id: React.Key }>({
  columns,
  data,
  pagination,
  setPagination,
  loading,
  handleChangeParams,
  titleTable = { title: '', isShowTitle: false },
  emptyText,
}: BaseTableProps) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (setPagination) {
      setPagination(pagination)
    }
    const currentPage = pagination.current ?? 1
    const pageSize = pagination.pageSize ?? 10
    if (handleChangeParams) {
      handleChangeParams(currentPage, pageSize)
    }
  }

  return (
    <>
      {titleTable?.isShowTitle && titleTable?.title && (
        <Title level={5} className="mt-6 text-[#374151]">
          {titleTable.title}
        </Title>
      )}
      <Table<T>
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        rowKey={(record) => record?.id || 'id'}
        scroll={{ x: 'max-content' }}
        className="sapp-table"
        locale={{ emptyText: emptyText }} // ← Customize here
      />
    </>
  )
}

export default SappTable
