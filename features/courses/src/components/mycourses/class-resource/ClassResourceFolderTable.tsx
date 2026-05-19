'use client'
import NameNoActionCell from './NameNoActionCell'
import {
  CLASS_SUFFIX_TYPE,
  IClassResource,
  IClassResourceList,
} from '@lms/core'
import { Popover, SappTable, Tooltip } from '@lms/ui'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import clsx from 'clsx'

interface IProps {
  folders: IClassResourceList
  pagination: TablePaginationConfig
  onFolderClick?: (folderId: string) => void
}

const className = 'custom-column-table'
const textStyle = 'text-base font-medium text-gray-800'
const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap w-[250px]`

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center gap-3 p-8 pb-0">
    <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
      {title}
    </h2>
    <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-[#22aaff]">
      {count}
    </span>
  </div>
)

const folderColumns = (
  onFolderClick: ((folderId: string) => void) | undefined,
): ColumnsType<IClassResource> => [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      className,
      render: (_, __, index) => (
        <NameNoActionCell
          dataColumn={index + 1}
          className="text-base text-gray-400"
          isCenter
        />
      ),
    },
    {
      title: 'Folder name',
      dataIndex: 'name',
      width: 250,
      key: 'name',
      className: clsx(className),
      render: (name, record) => (
        <Tooltip placement="bottomLeft" title={name}>
          <div
            onClick={() => record?.id && onFolderClick?.(record.id)}
            className={clsx(textTruncateStyle, 'cursor-pointer')}
          >
            {name}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'suffix_type',
      key: 'type',
      className: clsx(className, 'text-center'),
      align: 'center',
      render: (_, record) => (
        <NameNoActionCell
          isCenter
          dataColumn={
            CLASS_SUFFIX_TYPE?.find((item) => item.value === record.suffix_type)
              ?.label
          }
          className="text-base text-gray-400"
        />
      ),
      width: 100,
    },
    {
      title: 'Lesson',
      dataIndex: 'lesson',
      key: 'lesson',
      className: clsx(className, 'text-center'),
      align: 'left',
      render: (_, record) => {
        const schedules = record?.class_resource_permissions?.schedules || []
        const preview = schedules.slice(0, 2)

        return (
          <div>
            {preview.map((i) => (
              <div key={i.name} className="text-base text-gray-400">
                {i.name}
              </div>
            ))}
            <Popover
              placement="right"
              content={
                <div className="tooltip-scroll flex max-h-60 flex-col gap-1 overflow-auto">
                  {schedules.map((i, idx) => (
                    <div className="p-2 text-sm" key={idx}>
                      {i.name}
                    </div>
                  ))}
                </div>
              }
            >
              <div className="inline cursor-pointer">
                {schedules.length > 2 && (
                  <span className="text-sm font-medium text-primary">
                    +{schedules.length - 2} more
                  </span>
                )}
              </div>
            </Popover>
          </div>
        )
      },
      width: 400,
    },
  ]

const ClassResourceFolderTable = ({
  folders,
  pagination,
  onFolderClick,
}: IProps) => (
  <div className="flex flex-col gap-4">
    <SectionHeader
      title="Folders"
      count={folders?.metadata?.total_records ?? 0}
    />
    <SappTable
      columns={folderColumns(onFolderClick)}
      data={folders?.data}
      loading={false}
      rowKey="id"
      pagination={pagination}
      className="style-table-class-resource bg-white"
      isShowPagination={false}
    />
  </div>
)

export default ClassResourceFolderTable
