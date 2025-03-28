import type { TablePaginationConfig, TableProps } from 'antd'
import { Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface BaseTableProps {
  columns: Array<any>
  showCheckbox?: boolean
  data: Array<any>
  pagination: TablePaginationConfig
  setPagination?: Dispatch<SetStateAction<TablePaginationConfig>>
  loading?: boolean
  handleChangeParams?: any
  onResolveSelections?: () => void
  setSelection?: Dispatch<SetStateAction<Map<number, React.Key[]>>>
  selections?: Map<number, React.Key[]>
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
}: BaseTableProps) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (setPagination) {
      setPagination(pagination)
    }
    handleChangeParams(pagination.current, pagination.pageSize)
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
    <Table<T>
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={handleTableChange}
      rowSelection={showCheckbox ? rowSelection : undefined}
      loading={loading}
      rowKey={(record) => record?.id || 'id'} // Trả về id làm key
      scroll={{ x: 'max-content' }}
      className="sappTable"
    />
  )
}

export default SappTable
