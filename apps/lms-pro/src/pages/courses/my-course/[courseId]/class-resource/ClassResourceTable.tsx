import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { DownloadIcon } from '@lms/assets'
import {
  CLASS_SUFFIX_TYPE,
  DEFAULT_PAGE_NUMBER,
  IClassResource
} from '@lms/core'
import { ActionCellV2, PaginationSappV2, SappTable } from '@lms/ui'
import { UploadAPI } from '@pages/api/upload'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'

const ClassResourceTable = ({
  data,
  pagination,
  isLoading,
  setPagination,
}: {
  data: any
  pagination: TablePaginationConfig
  isLoading: boolean
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
}) => {
  const router = useRouter()
  const textStyle = 'text-base font-medium text-gray-800'
  const className = 'custom-column-table'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap w-[300px]`
  const columns: ColumnsType<IClassResource> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      className: className,
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <NameNoActionCell
          dataColumn={index + 1}
          className="text-base text-gray-400"
          isCenter
        />
      ),
    },
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
      className: clsx(className),
      render: (name) => (
        <NameNoActionCell dataColumn={name} className={textTruncateStyle} />
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
      align: 'center',
      render: (_, record) =>
        record?.class_resource_permissions?.schedules.map((item) => (
          <div className="text-base text-gray-400">{item?.name}</div>
        )),
      width: 400,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      className: clsx(className),
      align: 'center',
      render: (location) => (
        <NameNoActionCell
          isCenter
          dataColumn={location}
          className="text-base text-gray-400"
        />
      ),
      width: 300,
    },
    {
      title: '',
      key: 'actions',
      className: className,
      render: (_, record) => {
        return (
          <div className="flex justify-end">
            <ActionCellV2
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: () => download(record.name, record.file_key),
                },
              ]}
            />
          </div>
        )
      },
    },
  ]

  const download = async (name: string, file_key: string) => {
    await UploadAPI.downloadFile({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }

  return (
    <>
      <SappTable
        columns={columns}
        data={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={pagination}
        className="style-table-v2 rounded-xl bg-white"
        isShowPagination={false}
      />
      <PaginationSappV2
        currentPage={pagination?.current || DEFAULT_PAGE_NUMBER}
        pageSize={pagination?.pageSize || 10}
        totalItems={pagination?.total || 0}
        setCurrentPage={(page) => {
          setPagination((prev) => ({ ...prev, current: page as number }))
           router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      page_index: page as number,
    },
  })
        }}
        setPageSize={(page) => {
          setPagination((prev) => ({ ...prev, pageSize: page as number }))
           router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      page_size: page as number,
      page_index: DEFAULT_PAGE_NUMBER, 
    },
  })
        }}
      />
    </>
  )
}

export default ClassResourceTable
