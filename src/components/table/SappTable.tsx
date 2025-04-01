import type { TablePaginationConfig, TableProps } from 'antd'
import { Table, Typography } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'

const { Title } = Typography

interface BaseTableProps {
  columns: Array<any>
  showCheckbox?: boolean
  data: Array<any>
  pagination: TablePaginationConfig
  setPagination?: Dispatch<SetStateAction<TablePaginationConfig>>
  loading?: boolean
  handleChangeParams?: (currentPage: number, pageSize: number) => void
  onResolveSelections?: () => void
  setSelection?: Dispatch<SetStateAction<Map<number, React.Key[]>>>
  selections?: Map<number, React.Key[]>
  titleTable?: {
    title: string
    isShowTitle: boolean
  }
}

const SappTable = <T extends { id: React.Key }>({
  columns,
  showCheckbox,
  data,
  pagination,
  setPagination,
  loading,
  handleChangeParams,
  setSelection,
  selections,
  titleTable = { title: '', isShowTitle: false },
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
  // Checkbox selection
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    const currentPage = pagination.current
    setSelection &&
      setSelection((prev) =>
        new Map(prev).set(currentPage ?? 1, newSelectedRowKeys),
      )
  }

  const rowSelection: TableProps<T>['rowSelection'] = {
    selectedRowKeys: selections ? selections.get(pagination?.current ?? 1) : [],
    onChange: onSelectChange,
  }

  return (
    <>
      {titleTable?.isShowTitle && titleTable?.title && (
        <Title level={5} className="mt-6 text-gray-700">
          {titleTable.title}
        </Title>
      )}
      <Table<T>
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={showCheckbox ? rowSelection : undefined}
        loading={loading}
        rowKey={(record) => record?.id || 'id'}
        scroll={{ x: 'max-content' }}
        className="sapp-table"
      />
    </>
  )
}

export default SappTable
