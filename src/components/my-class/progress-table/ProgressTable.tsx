import { Table, TablePaginationConfig } from 'antd'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { IProgress } from '../../../type/progress'
import { TableColumn } from '../../../type'
import RequestActionCellProgress from '@components/my-class/progress-table/RequestActionCellProgress'

interface ProgressTableProps {
  loading: boolean
  progress: IProgress[]
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setIsInspect: Dispatch<SetStateAction<boolean>>
}

const columnsTitles: TableColumn<IProgress>[] = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Lesson',
    dataIndex: 'lesson',
  },
  {
    title: 'Time',
    dataIndex: 'time',
  },
  {
    title: 'Section',
    dataIndex: 'section',
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
  },
  {
    title: 'Creator',
    dataIndex: 'creator',
  },
  {
    title: 'Create date',
    dataIndex: 'createDate',
  },
  {
    title: 'Note',
    dataIndex: 'note',
  },
  {
    title: '',
    dataIndex: 'method',
    render: (value: string) => {
      return <RequestActionCellProgress id={value} />
    },
    fixed: 'right',
  },
]

const ProgressTable = ({
  loading,
  progress,
  pagination,
  setPagination,
  setIsEdit,
  setIsInspect,
}: ProgressTableProps) => {
  const { current, pageSize } = pagination
  const tableColumns = columnsTitles.map((item, index) => {
    return {
      ...item,
      key: index,
    }
  })

  const tableData = useMemo(() => {
    return progress.map((item, index) => ({
      ...item,
      index: ((current || 1) - 1) * (pageSize || 10) + index + 1,
      method: item.id,
    }))
  }, [progress, current, pageSize])

  return (
    <Table
      loading={loading}
      rowKey={(record) => record.id}
      columns={tableColumns}
      dataSource={tableData}
      scroll={{ x: 'max-content' }}
      pagination={pagination}
      onChange={setPagination}
    />
  )
}

export default ProgressTable
