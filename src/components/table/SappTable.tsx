import type { TablePaginationConfig, TableProps } from 'antd'
import { Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
// import './sapp_table.scss'

interface BaseTableProps {
  columns: Array<any>
  fetchData: (page: number, pageSize: number, params?: Object) => any
  extraParams?: Record<string, any>
  showCheckbox?: boolean
  data: Array<any>
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  fetchTableData: (current: number, pageSize: number, params?: Object) => void
  loading?: boolean
  filterParams?: any
  handleChangeParams?: any
  onResolveSelections?: () => void
  setSelection?: Dispatch<SetStateAction<Map<number, React.Key[]>>>
  selections?: Map<number, React.Key[]>
}

const SappTable = <T extends { id: React.Key }>({
  columns,
  extraParams,
  showCheckbox,
  data,
  pagination,
  setPagination,
  fetchTableData,
  loading,
  filterParams,
  handleChangeParams,
  setSelection,
  selections,
}: BaseTableProps) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    fetchTableData(
      pagination.current || 1,
      pagination.pageSize || 10,
      filterParams,
    )
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

  useEffect(() => {
    fetchTableData(
      pagination?.current || 1,
      pagination?.pageSize || 10,
      filterParams,
    )
  }, [extraParams])

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
      className="sapp-table"
    />
  )
}

export default SappTable
